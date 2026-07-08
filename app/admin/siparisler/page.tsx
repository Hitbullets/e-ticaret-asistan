import { db } from '@/lib/db';
import { orders } from '@/lib/db-schema';
import { desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, getPackageName } from '@/lib/pricing';
import type { PackageType } from '@/lib/pricing';
import Link from 'next/link';
import { ApproveButton } from './approve-button';
import { Package, ArrowLeft } from 'lucide-react';

export default async function AdminSiparislerPage() {
  let allOrders: Array<{
    id: string;
    status: string;
    packageType: string;
    amountTry: number;
    createdAt: Date;
    paymentNotifiedAt: Date | null;
    user: { name: string; email: string };
  }> = [];
  let dbError = false;

  try {
    allOrders = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: { user: true },
    });
  } catch (error) {
    console.error('Admin siparisler DB error:', error);
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
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">
                <ArrowLeft className="mr-1 size-4" />
                Dashboard
              </Link>
            </Button>
            <h1 className="font-heading text-3xl font-bold">Siparişler</h1>
          </div>
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

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Package className="size-5 text-primary" />
              Tüm Siparişler ({allOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allOrders.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Package className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                <p>Henüz sipariş yok.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-smooth hover:bg-muted/30"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-sm text-muted-foreground">{order.user.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {getPackageName(order.packageType as PackageType)} —{' '}
                        {formatPrice(order.amountTry)}
                      </div>
                      <div className="text-xs text-muted-foreground">Sipariş: {order.id}</div>
                      <div className="text-xs text-muted-foreground">
                        Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                      {order.paymentNotifiedAt && (
                        <div className="text-xs text-amber-600">
                          Ödeme bildirimi: {new Date(order.paymentNotifiedAt).toLocaleString('tr-TR')}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusColors[order.status] || ''}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                      {order.status === 'paid' && (
                        <ApproveButton orderId={order.id} />
                      )}
                    </div>
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
