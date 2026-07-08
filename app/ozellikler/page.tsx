import { FeatureCard } from '@/components/feature-card';
import { HighlightText } from '@/components/highlight-text';

export default function OzelliklerPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl">
            <HighlightText>Profesyonel</HighlightText> Özellikler
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">E-ticaret içerik üretimi için ihtiyacınız olan her şey.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon="search" title="SEO Uyumlu Başlık" description="Trendyol, Hepsiburada ve N11 kurallarına uygun, maksimum 100 karakter başlıklar." />
          <FeatureCard icon="description" title="Zengin Ürün Açıklaması" description="HTML formatında, en az 150 kelime, özellik listesi + fayda odaklı metin." />
          <FeatureCard icon="key" title="Anahtar Kelimeler" description="En az 10 adet SEO anahtar kelimesi, Türkçe ve aranabilir." />
          <FeatureCard icon="share" title="Sosyal Medya Postları" description="Instagram ve Reels için 3 adet hazır, hashtag'li tanıtım metni." />
          <FeatureCard icon="bolt" title="Hızlı Teslimat" description="5 dakika içinde içerikleriniz hazır. E-posta ile gönderilir." />
          <FeatureCard icon="palette" title="Kategori Desteği" description="Her ürün kategorisine özel, özelleştirilmiş içerik üretimi." />
          <FeatureCard icon="verified" title="Kalite Garantisi" description="AI çıktıları kalite kontrolünden geçer, profesyonel standartlarda." />
          <FeatureCard icon="support_agent" title="7/24 Destek" description="Sorularınız için her zaman yanınızdayız." />
          <FeatureCard icon="analytics" title="SEO Analizi" description="Üretilen içeriklerin SEO skoru ve iyileştirme önerileri." />
        </div>
      </div>
    </div>
  );
}
