import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, orders, products, generations } from '@/lib/db-schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const order = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, user[0].id)))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }

    const orderProducts = await db
      .select()
      .from(products)
      .where(eq(products.orderId, orderId));

    const productIds = orderProducts.map((p) => p.id);
    const allGenerations = [];

    for (const pid of productIds) {
      const gens = await db
        .select()
        .from(generations)
        .where(eq(generations.productId, pid));
      allGenerations.push(...gens);
    }

    return NextResponse.json({
      order: order[0],
      products: orderProducts,
      generations: allGenerations,
    });
  } catch (error) {
    console.error('Panel order detail error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
