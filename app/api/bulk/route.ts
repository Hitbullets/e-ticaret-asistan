import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, orders, products, generations } from '@/lib/db-schema';
import { generateProductContent } from '@/lib/ai';
import { eq } from 'drizzle-orm';

interface BulkProduct {
  title: string;
  description: string;
  category?: string;
}

export async function POST(request: NextRequest) {
  const { products: bulkProducts, email } = await request.json();

  if (!bulkProducts || !Array.isArray(bulkProducts) || bulkProducts.length === 0) {
    return NextResponse.json({ error: 'Ürün listesi gerekli' }, { status: 400 });
  }

  if (bulkProducts.length > 50) {
    return NextResponse.json({ error: 'Maksimum 50 ürün yüklenebilir' }, { status: 400 });
  }

  // Email varsa kullanıcı bul, yoksa admin
  let userId = 'admin_bulk';
  if (email) {
    const user = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    if (user.length > 0) {
      userId = user[0].id;
    }
  }

  // Sipariş oluştur
  const orderId = `bulk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(orders).values({
    id: orderId,
    userId,
    packageType: 'growth',
    amountTry: 0,
    status: 'generating',
    paymentMethod: 'bulk',
  });

  let generated = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const product of bulkProducts) {
    try {
      // Ürün kaydı
      const productId = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      await db.insert(products).values({
        id: productId,
        orderId,
        inputTitle: product.title,
        inputDescription: product.description,
        inputCategory: product.category || null,
      });

      // AI ile içerik üret
      const result = await generateProductContent({
        title: product.title,
        description: product.description,
        category: product.category,
      });

      const content = result as typeof result & { model?: string };

      // Üretilen içeriği kaydet
      const genId = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      await db.insert(generations).values({
        id: genId,
        productId,
        seoTitle: content.seoTitle,
        descriptionHtml: content.descriptionHtml,
        keywords: content.keywords,
        socialPosts: content.socialPosts,
        modelUsed: content.model || 'unknown',
        status: 'completed',
      });

      generated++;
    } catch (e) {
      failed++;
      errors.push(`${product.title}: ${e instanceof Error ? e.message : 'Bilinmeyen hata'}`);
    }
  }

  // Sipariş durumunu güncelle
  await db
    .update(orders)
    .set({ status: generated > 0 ? 'completed' : 'failed' })
    .where(eq(orders.id, orderId));

  return NextResponse.json({
    success: generated > 0,
    orderId,
    generated,
    failed,
    errors,
  });
}
