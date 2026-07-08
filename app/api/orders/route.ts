import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, orders } from '@/lib/db-schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { getPackageDetails } from '@/lib/pricing';
import type { PackageType } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageType, customerName, email, phone, paymentMethod } = body;

    if (!packageType || !customerName || !email) {
      return NextResponse.json(
        { error: 'Paket türü, ad ve e-posta zorunludur.' },
        { status: 400 }
      );
    }

    // Paket kontrolü
    const pkg = getPackageDetails(packageType as PackageType);
    if (!pkg) {
      return NextResponse.json({ error: 'Geçersiz paket türü.' }, { status: 400 });
    }

    // Kullanıcı oluştur veya bul
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      const userId = nanoid();
      await db.insert(users).values({
        id: userId,
        email,
        name: customerName,
        phone: phone || null,
        kvkkConsentAt: new Date(),
      });
      user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı oluşturulamadı.' }, { status: 500 });
    }

    // Sipariş oluştur
    const orderId = nanoid();
    const method = paymentMethod === 'paytr' ? 'paytr' : 'bank_transfer';
    await db.insert(orders).values({
      id: orderId,
      userId: user.id,
      packageType,
      amountTry: pkg.price,
      status: 'pending_payment',
      paymentMethod: method,
    });

    return NextResponse.json({ orderId, packageType, amount: pkg.price });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
