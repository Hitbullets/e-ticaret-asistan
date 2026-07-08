import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Basit admin auth (MVP için yeterli)
// Varsayım: ADMIN_PASSWORD env'den okunur

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin şifresi yapılandırılmamış.' }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Şifre hatalı.' }, { status: 401 });
    }

    // Cookie ayarla
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 saat
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Giriş başarısız.' }, { status: 500 });
  }
}
