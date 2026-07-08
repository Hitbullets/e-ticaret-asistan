import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db-schema';
import { eq } from 'drizzle-orm';
import { createReferralCode, getReferralStats, applyReferral } from '@/lib/referral';

// GET: Referans kodunu ve istatistikleri getir
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

    const stats = await getReferralStats(user[0].id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Referral GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST: Referans kodu oluştur veya uygula
export async function POST(request: NextRequest) {
  const { email, action, code } = await request.json();

  if (!email || !action) {
    return NextResponse.json({ error: 'E-posta ve action gerekli' }, { status: 400 });
  }

  try {
    const user = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    if (action === 'create') {
      const referralCode = await createReferralCode(user[0].id);
      return NextResponse.json({ success: true, code: referralCode });
    }

    if (action === 'apply') {
      if (!code) {
        return NextResponse.json({ error: 'Referans kodu gerekli' }, { status: 400 });
      }
      const applied = await applyReferral(code, user[0].id);
      return NextResponse.json({ success: applied });
    }

    return NextResponse.json({ error: 'Geçersiz action' }, { status: 400 });
  } catch (error) {
    console.error('Referral POST error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
