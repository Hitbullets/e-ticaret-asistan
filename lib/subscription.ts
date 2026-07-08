import { db } from '@/lib/db';
import { subscriptions, orders, users } from '@/lib/db-schema';
import { eq, and, gte, lte, type InferSelectModel } from 'drizzle-orm';

type SubscriptionRow = InferSelectModel<typeof subscriptions>;

export interface SubscriptionPlan {
  name: string;
  monthlyQuota: number;
  price: number;
  priceFormatted: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  starter: {
    name: 'Starter',
    monthlyQuota: 50,
    price: 349,
    priceFormatted: '349 ₺/ay',
  },
  growth: {
    name: 'Growth',
    monthlyQuota: 200,
    price: 799,
    priceFormatted: '799 ₺/ay',
  },
  enterprise: {
    name: 'Enterprise',
    monthlyQuota: 9999,
    price: 1999,
    priceFormatted: '1.999 ₺/ay',
  },
};

// Kullanıcının aktif aboneliğini getir
export async function getActiveSubscription(userId: string): Promise<SubscriptionRow | null> {
  const now = new Date();
  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active'),
        gte(subscriptions.renewsAt, now)
      )
    )
    .limit(1);

  return result[0] || null;
}

// Kota kontrolü
export async function checkQuota(userId: string): Promise<{ allowed: boolean; remaining: number; subscription: SubscriptionRow | null }> {
  const sub = await getActiveSubscription(userId);

  if (!sub) {
    return { allowed: false, remaining: 0, subscription: null };
  }

  const remaining = sub.monthlyQuota - sub.usedThisMonth;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    subscription: sub,
  };
}

// Kullanım artır
export async function incrementUsage(userId: string, count: number = 1): Promise<void> {
  const sub = await getActiveSubscription(userId);
  if (!sub) return;

  await db
    .update(subscriptions)
    .set({ usedThisMonth: sub.usedThisMonth + count })
    .where(eq(subscriptions.id, sub.id));
}

// Abonelik oluştur
export async function createSubscription(
  userId: string,
  plan: string
): Promise<string> {
  const planDetails = SUBSCRIPTION_PLANS[plan];
  if (!planDetails) throw new Error('Geçersiz plan');

  const renewsAt = new Date();
  renewsAt.setMonth(renewsAt.getMonth() + 1);

  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(subscriptions).values({
    id,
    userId,
    status: 'active',
    monthlyQuota: planDetails.monthlyQuota,
    usedThisMonth: 0,
    renewsAt,
  });

  return id;
}

// Yenileme (cron tarafından çağrılır)
export async function renewSubscriptions(): Promise<number> {
  const now = new Date();
  const expiredSubs = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.status, 'active'),
        lte(subscriptions.renewsAt, now)
      )
    );

  let renewedCount = 0;

  for (const sub of expiredSubs) {
    const newRenewDate = new Date(sub.renewsAt);
    newRenewDate.setMonth(newRenewDate.getMonth() + 1);

    await db
      .update(subscriptions)
      .set({
        usedThisMonth: 0,
        renewsAt: newRenewDate,
      })
      .where(eq(subscriptions.id, sub.id));

    renewedCount++;
  }

  return renewedCount;
}
