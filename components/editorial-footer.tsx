import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function EditorialFooter() {
  return (
    <footer className="border-t border-[var(--editor-border)] bg-[var(--editor-bg)]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 lg:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-[var(--primary)]">
              <Sparkles className="size-5" />
              SatışMetni
            </Link>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Türkiye&apos;deki e-ticaret satıcıları için profesyonel ürün içerik üretimi.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Ürün</h4>
            <ul className="space-y-2">
              <li><Link href="/cozumler" className="text-sm text-[var(--muted-foreground)] transition-smooth hover:text-[var(--primary)]">Çözümler</Link></li>
              <li><Link href="/ozellikler" className="text-sm text-[var(--muted-foreground)] transition-smooth hover:text-[var(--primary)]">Özellikler</Link></li>
              <li><Link href="/#fiyatlandirma" className="text-sm text-[var(--muted-foreground)] transition-smooth hover:text-[var(--primary)]">Fiyatlandırma</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Destek</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-[var(--muted-foreground)]">destek@satismetni.com</span></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Yasal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-[var(--muted-foreground)]">KVKK Aydınlatma Metni</span></li>
              <li><span className="text-sm text-[var(--muted-foreground)]">Gizlilik Politikası</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--editor-border)] pt-8 text-center text-xs text-[var(--muted-foreground)]">
          &copy; {new Date().getFullYear()} SatışMetni. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
