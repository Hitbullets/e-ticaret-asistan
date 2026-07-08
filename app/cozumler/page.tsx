import { ComparisonCard } from '@/components/comparison-card';
import { HighlightText } from '@/components/highlight-text';
import { FeatureCard } from '@/components/feature-card';

export default function CozumlerPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl">
            <HighlightText>Çözümlerimiz</HighlightText>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">Her ölçekte satıcı için içerik üretim çözümleri.</p>
        </div>

        <div className="space-y-8">
          <ComparisonCard
            inputTitle="Girdi"
            inputContent={<div><p className="font-medium">Kadifemsi Doku Kadın Bluz</p><p className="opacity-60 text-sm">Yumuşak dokulu, rahat kesim kadın bluz.</p></div>}
            outputTitle="Çıktı"
            outputContent={<div><p className="font-bold">Kadifemsi Doku Kadın Bluz | Premium Pamuklu</p><p className="opacity-80 text-sm">Kadifemsi dokusuyla fark yaratan bu bluz...</p></div>}
            badge={{ text: "Dönüşüm", value: "+34%" }}
          />

          <ComparisonCard
            inputTitle="Girdi"
            inputContent={<div><p className="font-medium">Deri Ceket Erkek</p><p className="opacity-60 text-sm">Gerçek deri, slim fit, siyah renk.</p></div>}
            outputTitle="Çıktı"
            outputContent={<div><p className="font-bold">Gerçek Deri Erkek Ceket | Slim Fit | Şık ve Dayanıklı</p><p className="opacity-80 text-sm">100% doğal deriden üretilen bu ceket...</p></div>}
            badge={{ text: "Dönüşüm", value: "+28%" }}
          />
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <FeatureCard icon="storefront" title="Pazaryeri Satıcıları" description="Trendyol, Hepsiburada, N11'de satış yapanlar için optimize edilmiş içerikler." />
          <FeatureCard icon="shopping_bag" title="Instagram Butikleri" description="Sosyal medya odaklı, dikkat çekici ürün tanıtımları." />
          <FeatureCard icon="local_shipping" title="Dropshipping" description="Toplu ürün içerik üretimi ile hız kazanın." />
        </div>
      </div>
    </div>
  );
}
