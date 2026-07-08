'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, CheckCircle, Download, ArrowRight } from 'lucide-react';

// Varsayım: Bu sayfa Faz 2'de tamamlanacak, şimdilik placeholder
export default function PanelPage() {
  return (
    <div className="min-h-screen bg-muted/20 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Müşteri Paneli</h1>
          <p className="mt-2 text-muted-foreground">
            Siparişlerinizi ve içeriklerinizi buradan yönetin.
          </p>
        </div>

        {/* Coming Soon */}
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Package className="size-8 text-primary" />
            </div>
            <h2 className="mb-2 font-heading text-xl font-semibold">Yakında Hizmetinizde</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              Müşteri paneli özellikleri yakında eklenecektir. Sipariş geçmişiniz, içerik indirme ve profil yönetimi buradan yapılabilecektir.
            </p>
            <Button asChild>
              <a href="/">
                Ana Sayfaya Dön <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Preview Features */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: Package, title: 'Sipariş Geçmişi', desc: 'Tüm siparişlerinizi görüntüleyin' },
            { icon: Download, title: 'İçerik İndirme', desc: 'Hazırlanan içerikleri indirin' },
            { icon: Clock, title: 'Durum Takibi', desc: 'Sipariş durumunu anlık izleyin' },
          ].map((feature) => (
            <Card key={feature.title} className="border-border/50 opacity-60">
              <CardContent className="flex items-start gap-3 py-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-heading text-sm font-semibold">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
