import { db } from '@/lib/db';
import { orders } from '@/lib/db-schema';
import { desc, eq, count, sum } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, getPackageName } from '@/lib/pricing';
import type { PackageType } from '@/lib/pricing';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, CheckCircle, Package, DollarSign } from 'lucide-react';

export default async function AdminDashboardPage() {
  let stats = [
    { title: 'Toplam Sipariş', value: '0', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Bekleyen Ödeme', value: '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Ödenen', value: '0', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Teslim Edilen', value: '0', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Toplam Gelir', value: formatPrice(0), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];
  let recentOrders: Array<{
    id: string;
    status: string;
    packageType: string;
    amountTry: number;
    createdAt: Date;
    user: { name: string };
  }> = [];
  let dbError = false;

  try {
    const [totalOrders, pendingOrders, paidOrders, deliveredOrders, totalRevenue] =
      await Promise.all([
        db.select({ count: count() }).from(orders),
        db.select({ count: count() }).from(orders).where(eq(orders.status, 'pending_payment')),
        db.select({ count: count() }).from(orders).where(eq(orders.status, 'paid')),
        db.select({ count: count() }).from(orders).where(eq(orders.status, 'delivered')),
        db.select({ total: sum(orders.amountTry) }).from(orders),
      ]);

    stats = [
      { title: 'Toplam Sipariş', value: String(totalOrders[0]?.count || 0), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
      { title: 'Bekleyen Ödeme', value: String(pendingOrders[0]?.count || 0), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      { title: 'Ödenen', value: String(paidOrders[0]?.count || 0), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
      { title: 'Teslim Edilen', value: String(deliveredOrders[0]?.count || 0), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
      { title: 'Toplam Gelir', value: formatPrice(Number(totalRevenue[0]?.total || 0)), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    recentOrders = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      limit: 10,
      with: { user: true },
    });
  } catch (error) {
    console.error('Admin dashboard DB error:', error);
    dbError = true;
  }

  const statusColors: Record<string, string> = {
    pending_payment: 'bg-amber-100 text-amber-800',
    paid: 'bg-green-100 text-green-800',
    delivered: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    pending_payment: 'Bekliyor',
    paid: 'Ödendi',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal',
  };

  return (
    <div className="min-h-screen bg-muted/20 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
          <Button asChild variant="outline">
            <Link href="/admin/siparisler">Siparişleri Gör</Link>
          </Button>
        </div>

        {dbError && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-700">
                Veritabanına bağlanılamıyor. Lütfen .env dosyasındaki DATABASE_URL değerini kontrol edin.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`size-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`font-heading text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Son Siparişler</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground">Henüz sipariş yok.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-smooth hover:bg-muted/30"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getPackageName(order.packageType as PackageType)} —{' '}
                        {formatPrice(order.amountTry)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <Badge className={statusColors[order.status] || ''}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
