import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, orders, products } from '@/lib/db-schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'Bu e-posta ile kayıtlı sipariş bulunamadı.' }, { status: 404 });
    }

    const userOrders = await db
      .select({
        id: orders.id,
        packageType: orders.packageType,
        amountTry: orders.amountTry,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        createdAt: orders.createdAt,
        approvedAt: orders.approvedAt,
      })
      .from(orders)
      .where(eq(orders.userId, user[0].id))
      .orderBy(orders.createdAt);

    return NextResponse.json({
      user: { name: user[0].name, email: user[0].email },
      orders: userOrders,
    });
  } catch (error) {
    console.error('Panel API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
