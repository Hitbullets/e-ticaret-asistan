import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
              <Sparkles className="size-5" />
              SatışMetni AI
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Türkiye&apos;deki e-ticaret satıcıları için profesyonel ürün içerik üretimi.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Ürün</h4>
            <ul className="space-y-2">
              <li><Link href="/#ozellikler" className="text-sm text-muted-foreground transition-smooth hover:text-primary">Özellikler</Link></li>
              <li><Link href="/#fiyatlandirma" className="text-sm text-muted-foreground transition-smooth hover:text-primary">Fiyatlandırma</Link></li>
              <li><Link href="/#deneme" className="text-sm text-muted-foreground transition-smooth hover:text-primary">Ücretsiz Dene</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Destek</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">destek@satismetni.com</span></li>
              <li><span className="text-sm text-muted-foreground">SSS (Yakında)</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Yasal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">KVKK Aydınlatma Metni</span></li>
              <li><span className="text-sm text-muted-foreground">Gizlilik Politikası</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SatışMetni AI. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-green-500"></span>
              SSL Güvenli
            </span>
            <span className="text-xs text-muted-foreground">KVKK Uyumlu</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
