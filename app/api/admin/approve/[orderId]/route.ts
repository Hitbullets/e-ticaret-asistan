import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, generations } from '@/lib/db-schema';
import { eq, inArray } from 'drizzle-orm';
import { generateProductContent } from '@/lib/ai';
import { sendDeliveryEmail } from '@/lib/email';
import { getPackageName } from '@/lib/pricing';
import type { PackageType } from '@/lib/pricing';
import { nanoid } from 'nanoid';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { orderId } = await params;

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: true,
        products: { with: { generations: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
    }

    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: 'Bu sipariş onaylanmamış.' },
        { status: 400 }
      );
    }

    // Zaten üretilmiş mi kontrol et
    const hasGenerations = order.products.some((p) => p.generations.length > 0);
    if (hasGenerations) {
      return NextResponse.json(
        { error: 'Bu sipariş zaten üretilmiş.' },
        { status: 400 }
      );
    }

    await db
      .update(orders)
      .set({ status: 'delivered', approvedAt: new Date() })
      .where(eq(orders.id, orderId));

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
          modelUsed: 'gemini-2.0-flash',
          status: 'done',
        });
      } catch (genError) {
        console.error(`Generation failed for product ${product.id}:`, genError);
      }
    }

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

    return NextResponse.json({ success: true, generationsCount: allGenerations.length });
  } catch (error) {
    console.error('Approve order error:', error);
    return NextResponse.json(
      { error: 'Sipariş onaylanırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
