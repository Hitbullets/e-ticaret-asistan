'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { getAllPackages } from '@/lib/pricing';
import { ComparisonCard } from '@/components/comparison-card';
import { StatBadge } from '@/components/stat-badge';
import { HighlightText } from '@/components/highlight-text';
import { FeatureCard } from '@/components/feature-card';
import { EditorialButton } from '@/components/editorial-button';
import { toast } from 'sonner';

export default function HomePage() {
  const packages = getAllPackages();
  const [trialForm, setTrialForm] = useState({ productName: '', description: '', category: '', email: '' });
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialResult, setTrialResult] = useState<{ seoTitle: string; descriptionHtml: string; keywords: string[]; socialPosts: string[] } | null>(null);

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrialLoading(true);
    setTrialResult(null);
    try {
      const res = await fetch('/api/trial', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(trialForm) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      setTrialResult(await res.json());
      toast.success('İçeriğiniz hazır!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Hata'); }
    finally { setTrialLoading(false); }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-[1280px] text-center">
          <Badge variant="secondary" className="mb-6 border-[var(--editor-border)] bg-[var(--surface-container)] text-[var(--primary)]">
            <Sparkles className="mr-1 size-3" /> Türkiye&apos;nin #1 E-Ticaret İçerik Servisi
          </Badge>
          <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight md:text-6xl">
            Ham veriden,<br />
            <HighlightText>yayına hazır</HighlightText> içeriğe.
          </h1>
          <p className="mb-8 text-lg text-[var(--muted-foreground)] md:text-xl">
            Trendyol, Hepsiburada ve N11 için SEO uyumlu başlık, açıklama ve sosyal medya postları.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <EditorialButton href="#deneme" size="lg">
              Ücretsiz Dene <ArrowRight className="ml-2 size-4" />
            </EditorialButton>
            <EditorialButton variant="secondary" href="#fiyatlandirma" size="lg">Fiyatları Gör</EditorialButton>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
            <StatBadge value="10K+" label="İçerik Üretildi" />
            <StatBadge value="500+" label="Mutlu Satıcı" variant="teal" />
            <StatBadge value="%98" label="Memnuniyet" />
            <StatBadge value="5 dk" label="Teslimat" variant="teal" />
          </div>
        </div>
      </section>

      {/* Girdi/Çıktı Comparison */}
      <section className="bg-[var(--editor-bg)] px-4 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Girdiğiniz bilgi,<br /><HighlightText>profesyonel içeriğe</HighlightText> dönüşsün.
            </h2>
          </div>
          <ComparisonCard
            inputTitle="Siz Girin"
            inputContent={<div className="space-y-2"><p className="font-medium">Kadifemsi Doku Kadın Bluz</p><p className="opacity-60">Yumuşak dokulu, rahat kesim kadın bluz. %100 pamuk.</p></div>}
            outputTitle="AI Üretsin"
            outputContent={<div className="space-y-2"><p className="font-bold">Kadifemsi Doku Kadın Bluz | Premium Pamuklu | Şık ve Rahat</p><p className="opacity-80">Kadifemsi dokusuyla fark yaratan bu bluz, %100 pamuklu yapısıyla cildinize nefes aldırır...</p></div>}
            badge={{ text: "Dönüşüm", value: "+34%" }}
          />
        </div>
      </section>

      {/* Özellikler */}
      <section id="ozellikler" className="px-4 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">Neden SatışMetni?</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="search" title="SEO Uyumlu Başlık" description="Pazaryeri kurallarına uygun, arama sonuçlarında üst sıralarda çıkan başlıklar." />
            <FeatureCard icon="description" title="Zengin Açıklama" description="Özellik listesi ve fayda odaklı, müşteriyi satın almaya yönlendiren açıklamalar." />
            <FeatureCard icon="share" title="Sosyal Medya" description="Instagram ve Reels için hazır, hashtag'li tanıtım metinleri." />
            <FeatureCard icon="bolt" title="5 Dakikada" description="Yükleyin, birkaç dakika içinde profesyonel içerikleriniz hazır olsun." />
          </div>
        </div>
      </section>

      {/* Fiyatlandırma */}
      <section id="fiyatlandirma" className="bg-[var(--editor-bg)] px-4 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">Basit Fiyatlandırma</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <Card key={pkg.type} className={`border-[var(--editor-border)] bg-[var(--surface-container)] ${pkg.type === 'growth' ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10' : ''}`}>
                <CardContent className="flex flex-1 flex-col p-6">
                  {pkg.type === 'growth' && <Badge className="mb-3 w-fit bg-[var(--accent)] text-[var(--accent-foreground)]">En Popüler</Badge>}
                  <h3 className="font-heading text-lg font-semibold">{pkg.name}</h3>
                  <div className="mt-2 mb-4"><span className="font-heading text-3xl font-bold">{pkg.priceFormatted}</span>{pkg.type === 'subscription' && <span className="text-[var(--muted-foreground)]">/ay</span>}</div>
                  <ul className="mb-6 flex-1 space-y-2">
                    {pkg.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><span className="material-symbols-outlined size-4 text-[var(--tertiary)]">check_circle</span>{f}</li>)}
                  </ul>
                  <EditorialButton href="/siparis" className="w-full" variant={pkg.type === 'growth' ? 'primary' : 'secondary'}>Satın Al</EditorialButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deneme */}
      <section id="deneme" className="px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">1 Ürün Ücretsiz Dene</h2>
          </div>
          {trialResult ? (
            <Card className="border-[var(--editor-border)] bg-[var(--surface-container)]">
              <CardContent className="space-y-4 p-6">
                <h3 className="font-heading text-lg font-semibold text-[var(--tertiary)]">İçeriğiniz Hazır!</h3>
                <div><Label className="text-xs text-[var(--muted-foreground)]">SEO Başlık</Label><p className="mt-1 text-sm">{trialResult.seoTitle}</p></div>
                <div><Label className="text-xs text-[var(--muted-foreground)]">Açıklama</Label><div className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: trialResult.descriptionHtml }} /></div>
                <div><Label className="text-xs text-[var(--muted-foreground)]">Anahtar Kelimeler</Label><div className="mt-1 flex flex-wrap gap-1">{trialResult.keywords.map((kw) => <Badge key={kw} variant="secondary" className="bg-[var(--primary)]/10 text-[var(--primary)]">{kw}</Badge>)}</div></div>
                <EditorialButton href="/siparis" className="w-full">Daha Fazla Ürün İçin Paket Seç</EditorialButton>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[var(--editor-border)] bg-[var(--surface-container)]">
              <CardContent className="p-6">
                <form onSubmit={handleTrialSubmit} className="space-y-4">
                  <div className="space-y-2"><Label>Ürün Adı *</Label><Input placeholder="Örn: Kadifemsi Doku Kadın Bluz" value={trialForm.productName} onChange={(e) => setTrialForm({ ...trialForm, productName: e.target.value })} required className="border-[var(--editor-border)] bg-[var(--editor-surface)]" /></div>
                  <div className="space-y-2"><Label>Açıklama *</Label><Textarea placeholder="Ürünün temel özelliklerini yazın..." value={trialForm.description} onChange={(e) => setTrialForm({ ...trialForm, description: e.target.value })} required rows={3} className="border-[var(--editor-border)] bg-[var(--editor-surface)]" /></div>
                  <div className="space-y-2"><Label>Kategori</Label><Input placeholder="Örn: Kadın Giyim" value={trialForm.category} onChange={(e) => setTrialForm({ ...trialForm, category: e.target.value })} className="border-[var(--editor-border)] bg-[var(--editor-surface)]" /></div>
                  <div className="space-y-2"><Label>E-posta *</Label><Input type="email" placeholder="ornek@email.com" value={trialForm.email} onChange={(e) => setTrialForm({ ...trialForm, email: e.target.value })} required className="border-[var(--editor-border)] bg-[var(--editor-surface)]" /></div>
                  <EditorialButton type="submit" className="w-full" disabled={trialLoading}>
                    {trialLoading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Üretiliyor...</> : <><Sparkles className="mr-2 size-4" /> Ücretsiz İçerik Üret</>}
                  </EditorialButton>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
