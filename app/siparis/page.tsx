'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft, Loader2, Shield, Lock } from 'lucide-react';
import { getAllPackages, formatPrice } from '@/lib/pricing';
import { StepIndicator } from '@/components/step-indicator';
import { TrustBadges } from '@/components/trust-badges';
import type { PackageType } from '@/lib/pricing';
import { toast } from 'sonner';

const steps = [
  { label: 'Paket Seç', description: 'Size uygun paketi seçin' },
  { label: 'Bilgiler', description: 'Kişisel bilgilerinizi girin' },
  { label: 'Ödeme', description: 'Ödeme yönteminizi seçin' },
];

export default function SiparisPage() {
  const router = useRouter();
  const packages = getAllPackages();
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('starter');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedPkg = packages.find((p) => p.type === selectedPackage)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvkkConsent) {
      toast.error('KVKK onayı gereklidir.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageType: selectedPackage,
          customerName: form.name,
          email: form.email,
          phone: form.phone || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Sipariş oluşturulamadı');
      }
      const data = await res.json();
      toast.success('Siparişiniz oluşturuldu!');
      router.push(`/odeme/${data.orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <a href="/">
            <ArrowLeft className="mr-2 size-4" />
            Ana Sayfa
          </a>
        </Button>

        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={steps} currentStep={0} />
        </div>

        <h1 className="mb-2 text-center font-heading text-3xl font-bold">Paket Seçimi</h1>
        <p className="mb-8 text-center text-muted-foreground">
          İhtiyınıza uygun paketi seçin ve siparişinizi tamamlayın.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Package Selection */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.type}
                className={`hover-lift cursor-pointer border-border/50 transition-smooth ${
                  selectedPackage === pkg.type
                    ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10'
                    : ''
                }`}
                onClick={() => setSelectedPackage(pkg.type)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg">{pkg.name}</CardTitle>
                    {selectedPackage === pkg.type && (
                      <CheckCircle className="size-5 text-primary" />
                    )}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <span className="font-heading text-2xl font-bold">{pkg.priceFormatted}</span>
                    {pkg.type === 'subscription' && (
                      <span className="text-sm text-muted-foreground">/ay</span>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{pkg.productCount} ürün</Badge>
                  <ul className="mt-3 space-y-1">
                    {pkg.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle className="size-3 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customer Info */}
          <Card className="mx-auto max-w-md border-border/50">
            <CardHeader>
              <CardTitle className="font-heading">Müşteri Bilgileri</CardTitle>
              <CardDescription>Siparişiniz için gerekli bilgiler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad *</Label>
                <Input
                  id="name"
                  placeholder="Adınız Soyadınız"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
                <Input
                  id="phone"
                  placeholder="05XX XXX XX XX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="kvkk"
                  checked={kvkkConsent}
                  onChange={(e) => setKvkkConsent(e.target.checked)}
                  className="mt-1"
                />
                <Label htmlFor="kvkk" className="text-xs text-muted-foreground">
                  KVKK kapsamında kişisel verilerimin hizmet sunumu amacıyla işlenmesine onay
                  veriyorum.{' '}
                  <a href="#" className="underline hover:text-primary">Aydınlatma Metni</a>
                </Label>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-center text-sm">
                Seçilen Paket: <strong>{selectedPkg.name}</strong> — {selectedPkg.priceFormatted}
                {selectedPkg.type === 'subscription' ? '/ay' : ''}
              </div>

              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading || !kvkkConsent}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sipariş Oluşturuluyor...
                  </>
                ) : (
                  'Siparişi Tamamla'
                )}
              </Button>

              {/* Security */}
              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="size-3" /> SSL Güvenli</span>
                <span className="flex items-center gap-1"><Lock className="size-3" /> KVKK Uyumlu</span>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Trust Badges */}
        <div className="mt-8">
          <TrustBadges variant="compact" />
        </div>
      </div>
    </div>
  );
}
