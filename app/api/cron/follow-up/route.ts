import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, users } from '@/lib/db-schema';
import { eq, and, lte, gte } from 'drizzle-orm';
import { sendFollowUp7Days, sendFollowUp14Days, sendFollowUp30Days } from '@/lib/email-sequences';

// Vercel Cron: Günde 1 kez çalışır (0 9 * * *)
export async function GET(request: NextRequest) {
  // Cron secret kontrolü
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results = { followUp7: 0, followUp14: 0, followUp30: 0, errors: 0 };

  try {
    // 7 gün önce teslim edilen siparişler
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sevenDaysAgoEnd = new Date(sevenDaysAgo);
    sevenDaysAgoEnd.setHours(23, 59, 59, 999);

    const deliveredOrders7 = await db
      .select({ orderId: orders.id, userEmail: users.email, userName: users.name })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(
        and(
          eq(orders.status, 'delivered'),
          gte(orders.approvedAt, sevenDaysAgo),
          lte(orders.approvedAt, sevenDaysAgoEnd)
        )
      );

    for (const order of deliveredOrders7) {
      try {
        await sendFollowUp7Days(order.userEmail, order.userName, order.orderId);
        results.followUp7++;
      } catch (e) {
        console.error(`Follow-up 7d failed for ${order.orderId}:`, e);
        results.errors++;
      }
    }

    // 14 gün önce teslim edilen siparişler
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const fourteenDaysAgoEnd = new Date(fourteenDaysAgo);
    fourteenDaysAgoEnd.setHours(23, 59, 59, 999);

    const deliveredOrders14 = await db
      .select({ orderId: orders.id, userEmail: users.email, userName: users.name })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(
        and(
          eq(orders.status, 'delivered'),
          gte(orders.approvedAt, fourteenDaysAgo),
          lte(orders.approvedAt, fourteenDaysAgoEnd)
        )
      );

    for (const order of deliveredOrders14) {
      try {
        await sendFollowUp14Days(order.userEmail, order.userName, order.orderId);
        results.followUp14++;
      } catch (e) {
        console.error(`Follow-up 14d failed for ${order.orderId}:`, e);
        results.errors++;
      }
    }

    // 30 gün önce teslim edilen siparişler
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysAgoEnd = new Date(thirtyDaysAgo);
    thirtyDaysAgoEnd.setHours(23, 59, 59, 999);

    const deliveredOrders30 = await db
      .select({ orderId: orders.id, userEmail: users.email, userName: users.name })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(
        and(
          eq(orders.status, 'delivered'),
          gte(orders.approvedAt, thirtyDaysAgo),
          lte(orders.approvedAt, thirtyDaysAgoEnd)
        )
      );

    for (const order of deliveredOrders30) {
      try {
        await sendFollowUp30Days(order.userEmail, order.userName);
        results.followUp30++;
      } catch (e) {
        console.error(`Follow-up 30d failed for ${order.orderId}:`, e);
        results.errors++;
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error('Follow-up cron error:', error);
    return NextResponse.json({ error: 'Cron hatası' }, { status: 500 });
  }
}
