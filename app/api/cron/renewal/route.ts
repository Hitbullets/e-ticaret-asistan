import { NextRequest, NextResponse } from 'next/server';
import { renewSubscriptions } from '@/lib/subscription';

// Vercel Cron: Günde 1 kez çalışır (0 0 * * *)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const renewedCount = await renewSubscriptions();
    return NextResponse.json({ success: true, renewed: renewedCount });
  } catch (error) {
    console.error('Renewal cron error:', error);
    return NextResponse.json({ error: 'Renewal hatası' }, { status: 500 });
  }
}
