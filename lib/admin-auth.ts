import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function requireAdminAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  return null; // auth passed
}
