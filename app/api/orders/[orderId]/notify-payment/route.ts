import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db-schema';
import { eq } from 'drizzle-orm';
import { sendPaymentNotificationEmail } from '@/lib/email';
import { getPackageName } from '@/lib/pricing';
import type { PackageType } from '@/lib/pricing';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'E-posta gereklidir.' }, { status: 400 });
    }

    // Siparişi bul
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
    }

    // E-posta sipariş sahibiyle eşleşmeli
    if (order.user.email !== email) {
      return NextResponse.json(
        { error: 'E-posta adresi sipariş sahibiyle eşleşmiyor.' },
        { status: 403 }
      );
    }

    if (order.status !== 'pending_payment') {
      return NextResponse.json(
        { error: 'Bu sipariş zaten işlendi.' },
        { status: 400 }
      );
    }

    // Ödeme bildirimini kaydet
    await db
      .update(orders)
      .set({ paymentNotifiedAt: new Date() })
      .where(eq(orders.id, orderId));

    // Admin'e e-posta bildirimi gönder
    const packageName = getPackageName(order.packageType as PackageType);
    await sendPaymentNotificationEmail(
      orderId,
      order.user.name,
      order.user.email,
      packageName
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment notification error:', error);
    return NextResponse.json(
      { error: 'Bildirim gönderilemedi.' },
      { status: 500 }
    );
  }
}
