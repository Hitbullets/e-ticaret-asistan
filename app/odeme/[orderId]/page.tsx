import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { orders } from '@/lib/db-schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, CreditCard, Building2 } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';
import { PaymentNotifyForm } from './payment-notify-form';
import { PaytrPaymentButton } from './paytr-payment-button';
import { getPackageName, formatPrice } from '@/lib/pricing';
import { TrustBadges } from '@/components/trust-badges';
import type { PackageType } from '@/lib/pricing';

export default async function OdemePage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { orderId } = await params;
  const { status: paymentStatus } = await searchParams;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { user: true },
  });

  if (!order) {
    notFound();
  }

  // PayTR success/fail yönlendirmesi
  if (paymentStatus === 'success' && order.status === 'pending_payment') {
    const updatedOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (updatedOrder && updatedOrder.status !== 'pending_payment') {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-md border-border/50 text-center">
            <CardContent className="pt-8">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="size-8 text-primary" />
              </div>
              <h1 className="mb-2 font-heading text-2xl font-bold text-primary">Ödeme Başarılı!</h1>
              <p className="text-muted-foreground">
                Siparişiniz işleniyor. İçerikleriniz hazır olduğunda e-posta ile gönderilecektir.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Sipariş: {orderId}</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  if (paymentStatus === 'fail') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50 text-center">
          <CardContent className="pt-8">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <CreditCard className="size-8 text-destructive" />
            </div>
            <h1 className="mb-2 font-heading text-2xl font-bold text-destructive">Ödeme Başarısız</h1>
            <p className="text-muted-foreground">
              Ödeme işlenemedi. Lütfen tekrar deneyin veya havale yöntemini kullanın.
            </p>
            <a href={`/odeme/${orderId}`} className="mt-4 inline-block text-sm font-medium text-primary underline hover:text-primary/80">
              Ödeme sayfasına dön
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (order.status !== 'pending_payment') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50 text-center">
          <CardContent className="pt-8">
            <h1 className="mb-2 font-heading text-2xl font-bold">Sipariş Durumu</h1>
            <p className="text-muted-foreground">
              Bu siparişin durumu: <Badge>{order.status}</Badge>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Sipariş: {order.id}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ownerName = process.env.PROJECT_OWNER_NAME || '';
  const iban = process.env.PAYMENT_IBAN || '';
  const bankName = process.env.PAYMENT_BANK_NAME || '';
  const packageName = getPackageName(order.packageType as PackageType);
  const hasPaytr = !!(process.env.PAYTR_MERCHANT_ID && process.env.PAYTR_MERCHANT_KEY);

  return (
    <div className="min-h-screen bg-muted/20 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-center font-heading text-3xl font-bold">Ödeme</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Ödeme yönteminizi seçin ve siparişinizi tamamlayın.
        </p>

        {/* Order Summary */}
        <Card className="mb-6 border-border/50">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <div className="text-sm text-muted-foreground">Sipariş</div>
              <div className="font-heading text-lg font-semibold">{packageName}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Tutar</div>
              <div className="font-heading text-2xl font-bold text-primary">{formatPrice(order.amountTry)}</div>
            </div>
          </CardContent>
        </Card>

        {/* PayTR Kredi Kartı */}
        {hasPaytr && (
          <Card className="mb-6 border-primary shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <CreditCard className="size-5 text-primary" />
                Kredi Kartı ile Öde
                <Badge className="bg-accent text-accent-foreground">Önerilen</Badge>
              </CardTitle>
              <CardDescription>
                Güvenli PayTR altyapısı ile kredi kartı veya banka kartı ile ödeme yapın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaytrPaymentButton orderId={order.id} />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                3D Secure ile güvenli ödeme. Taksit seçenekleri ödeme sayfasında görünecektir.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Havale/EFT */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Building2 className="size-5 text-primary" />
              Havale / EFT ile Öde
            </CardTitle>
            <CardDescription>
              Aşağıdaki bilgilere havale yaparak siparişinizi tamamlayın.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-1 text-xs font-medium text-muted-foreground">Hesap Sahibi</div>
              <div className="font-heading text-lg font-semibold">{ownerName}</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-1 text-xs font-medium text-muted-foreground">IBAN</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-heading text-lg font-mono">{iban}</code>
                <CopyButton
                  text={iban}
                  className="rounded-lg bg-primary/10 p-2 text-primary transition-smooth hover:bg-primary/20"
                />
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-1 text-xs font-medium text-muted-foreground">Banka</div>
              <div className="font-heading text-lg font-semibold">{bankName}</div>
            </div>
            <Separator />
            <div className="rounded-lg bg-primary/5 p-4">
              <div className="mb-1 text-xs font-medium text-muted-foreground">Açıklama (Zorunlu)</div>
              <code className="font-heading text-lg font-bold text-primary">{order.id}</code>
            </div>
          </CardContent>
        </Card>

        {/* Havale Bildirimi */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Havale Bildirimi</CardTitle>
            <CardDescription>
              Havaleyi yaptıktan sonra buradan bildirin. {packageName} paketi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentNotifyForm orderId={order.id} customerEmail={order.user.email} />
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <TrustBadges variant="compact" />
      </div>
    </div>
  );
}
