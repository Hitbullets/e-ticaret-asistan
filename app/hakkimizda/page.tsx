import { HighlightText } from '@/components/highlight-text';
import { StatBadge } from '@/components/stat-badge';

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl">
            <HighlightText>Hakkımızda</HighlightText>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">E-ticaret içerik üretimini demokratikleştiriyoruz.</p>
        </div>

        <div className="mb-20 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 font-heading text-2xl font-bold">Hikayemiz</h2>
            <p className="mb-4 text-[var(--muted-foreground)]">
              SatışMetni, Türkiye&apos;deki küçük ve orta ölçekli e-ticaret satıcılarının profesyonel ürün içeriklerine erişmesini sağlamak amacıyla kuruldu.
            </p>
            <p className="text-[var(--muted-foreground)]">
              Yapay zeka destekli platformumuz, ajans kalitesinde ürün başlıkları, açıklamaları ve sosyal medya metinleri üreterek satıcıların zaman ve maliyet tasarrufu yapmasını sağlıyor.
            </p>
          </div>
          <div>
            <h2 className="mb-4 font-heading text-2xl font-bold">Misyonumuz</h2>
            <p className="text-[var(--muted-foreground)]">
              Her satıcının, büyük bütçeler ayırmasına gerek kalmadan profesyonel içeriklere erişebilmesini sağlamak. AI teknolojisini kullanarak içerik üretimini hızlandırmak ve kaliteyi artırmak.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          <StatBadge value="10K+" label="İçerik Üretildi" />
          <StatBadge value="500+" label="Mutlu Satıcı" variant="teal" />
          <StatBadge value="%98" label="Memnuniyet" />
          <StatBadge value="5 dk" label="Ortalama Teslimat" variant="teal" />
        </div>
      </div>
    </div>
  );
}
