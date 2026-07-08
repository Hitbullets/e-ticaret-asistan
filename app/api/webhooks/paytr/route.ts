import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, products, generations } from '@/lib/db-schema';
import { eq, inArray } from 'drizzle-orm';
import { generateProductContent } from '@/lib/ai';
import { sendDeliveryEmail } from '@/lib/email';
import { verifyPaytrCallback } from '@/lib/paytr';
import { getPackageName } from '@/lib/pricing';
import type { PackageType } from '@/lib/pricing';
import { nanoid } from 'nanoid';

// PayTR webhook callback'i
// PayTR, ödeme sonucunu POST ile bu URL'e bildirir
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const merchantOid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const totalAmount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;

    if (!merchantOid || !status || !totalAmount || !hash) {
      return new NextResponse('INVALID_PARAMS', { status: 400 });
    }

    // Hash doğrulama
    const isValid = verifyPaytrCallback({
      merchantOid,
      status,
      totalAmount,
      hash,
    });

    if (!isValid) {
      console.error('PayTR hash verification failed for order:', merchantOid);
      return new NextResponse('INVALID_HASH', { status: 400 });
    }

    // Siparişi bul
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, merchantOid),
      with: { user: true, products: true },
    });

    if (!order) {
      console.error('PayTR callback: Order not found:', merchantOid);
      return new NextResponse('ORDER_NOT_FOUND', { status: 404 });
    }

    if (status === 'success') {
      // Ödeme başarılı: sipariş durumunu 'paid' yap
      await db
        .update(orders)
        .set({
          status: 'paid',
          paymentMethod: 'paytr',
          paymentNotifiedAt: new Date(),
        })
        .where(eq(orders.id, merchantOid));

      // Otomatik içerik üretimi
      const packageName = getPackageName(order.packageType as PackageType);

      for (const product of order.products) {
        try {
          const content = await generateProductContent({
            title: product.inputTitle,
            description: product.inputDescription,
            category: product.inputCategory || undefined,
          });

          const genId = nanoid();
          await db.insert(generations).values({
            id: genId,
            productId: product.id,
            seoTitle: content.seoTitle,
            descriptionHtml: content.descriptionHtml,
            keywords: content.keywords,
            socialPosts: content.socialPosts,
            modelUsed: 'ai-fallback',
            status: 'done',
          });
        } catch (genError) {
          console.error(`Generation failed for product ${product.id}:`, genError);
        }
      }

      // Generasyonları topla ve e-posta ile gönder
      const productIds = order.products.map((p) => p.id);
      const allGenerations =
        productIds.length > 0
          ? await db.query.generations.findMany({
              where: inArray(generations.productId, productIds),
            })
          : [];

      if (allGenerations.length > 0) {
        const firstGen = allGenerations[0];
        await sendDeliveryEmail(order.user.email, order.user.name, packageName, {
          seoTitle: firstGen.seoTitle,
          descriptionHtml: firstGen.descriptionHtml,
          keywords: firstGen.keywords as string[],
          socialPosts: firstGen.socialPosts as string[],
        });
      }

      // Durumu 'delivered' yap
      await db
        .update(orders)
        .set({ status: 'delivered', approvedAt: new Date() })
        .where(eq(orders.id, merchantOid));

      return new NextResponse('OK', { status: 200 });
    } else {
      // Ödeme başarısız: siparişi iptal et
      await db
        .update(orders)
        .set({ status: 'cancelled' })
        .where(eq(orders.id, merchantOid));

      return new NextResponse('CANCELLED', { status: 200 });
    }
  } catch (error) {
    console.error('PayTR webhook error:', error);
    return new NextResponse('ERROR', { status: 500 });
  }
}
