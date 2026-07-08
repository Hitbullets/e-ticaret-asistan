import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db-schema';
import { desc } from 'drizzle-orm';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const allOrders = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: { user: true },
    });

    return NextResponse.json(allOrders);
  } catch (error) {
    console.error('List orders error:', error);
    return NextResponse.json({ error: 'Siparişler listelenemedi.' }, { status: 500 });
  }
}
