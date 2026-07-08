import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, subscriptions } from '@/lib/db-schema';
import { eq } from 'drizzle-orm';
import { getActiveSubscription, createSubscription, SUBSCRIPTION_PLANS } from '@/lib/subscription';

// GET: Kullanıcının aboneliğini getir
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 });
  }

  try {
    const user = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const sub = await getActiveSubscription(user[0].id);

    return NextResponse.json({
      subscription: sub,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    console.error('Subscription GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST: Yeni abonelik oluştur
export async function POST(request: NextRequest) {
  const { email, plan } = await request.json();

  if (!email || !plan) {
    return NextResponse.json({ error: 'E-posta ve plan gerekli' }, { status: 400 });
  }

  if (!SUBSCRIPTION_PLANS[plan]) {
    return NextResponse.json({ error: 'Geçersiz plan' }, { status: 400 });
  }

  try {
    const user = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const subId = await createSubscription(user[0].id, plan);

    return NextResponse.json({ success: true, subscriptionId: subId });
  } catch (error) {
    console.error('Subscription POST error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
