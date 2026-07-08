import { db } from '@/lib/db';
import { users } from '@/lib/db-schema';
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

// Referans tablosu (schema'ya eklenmeli, şimdilik burada tanımlı)
export const referrals = pgTable('referrals', {
  id: text('id').primaryKey(),
  referrerUserId: text('referrer_user_id').notNull().references(() => users.id),
  referralCode: text('referral_code').notNull().unique(),
  referredUserId: text('referred_user_id').references(() => users.id),
  commissionPct: integer('commission_pct').notNull().default(20),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Kod üret (6 haneli, benzersiz)
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Referans kodu oluştur
export async function createReferralCode(userId: string): Promise<string> {
  const existing = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerUserId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].referralCode;
  }

  const code = generateReferralCode();

  await db.insert(referrals).values({
    id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    referrerUserId: userId,
    referralCode: code,
  });

  return code;
}

// Referansı uygula (yeni kullanıcı kayıt olurken)
export async function applyReferral(code: string, newUserId: string): Promise<boolean> {
  const referral = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referralCode, code))
    .limit(1);

  if (referral.length === 0) return false;

  await db
    .update(referrals)
    .set({
      referredUserId: newUserId,
      status: 'completed',
    })
    .where(eq(referrals.id, referral[0].id));

  return true;
}

// Kullanıcının referanslarını getir
export async function getReferralStats(userId: string) {
  const referralList = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerUserId, userId));

  return {
    code: referralList[0]?.referralCode || null,
    totalReferrals: referralList.filter((r) => r.status === 'completed').length,
    pendingReferrals: referralList.filter((r) => r.status === 'pending').length,
  };
}
