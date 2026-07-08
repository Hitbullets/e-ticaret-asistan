import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db-schema';
import { eq } from 'drizzle-orm';
import { requestPaytrToken, tlToKurus } from '@/lib/paytr';

// PayTR iFrame token oluştur ve iframe URL'ini döndür
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Siparişi bul
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
    }

    if (order.status !== 'pending_payment') {
      return NextResponse.json(
        { error: 'Bu sipariş zaten işlendi.' },
        { status: 400 }
      );
    }

    // Müşteri IP'sini al
    const userIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // PayTR URL'lerini oluştur
    const baseUrl = request.nextUrl.origin;
    const successUrl = `${baseUrl}/odeme/${orderId}?status=success`;
    const failUrl = `${baseUrl}/odeme/${orderId}?status=fail`;
    const callbackUrl = `${baseUrl}/api/webhooks/paytr`;

    // PayTR token iste
    const { token, iframeUrl } = await requestPaytrToken({
      orderId: order.id,
      amountInKurus: tlToKurus(order.amountTry),
      email: order.user.email,
      displayName: order.user.name,
      userIp,
      successUrl,
      failUrl,
      callbackUrl,
    });

    return NextResponse.json({ token, iframeUrl });
  } catch (error) {
    console.error('PayTR token error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PayTR bağlantısı kurulamadı.' },
      { status: 500 }
    );
  }
}
