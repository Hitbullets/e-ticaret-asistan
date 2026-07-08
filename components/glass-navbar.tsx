'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';

export function GlassNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-[var(--editor-border)]">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-[var(--primary)]">
          <Sparkles className="size-5" />
          SatışMetni
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/cozumler" className="text-sm font-medium text-[var(--foreground)] opacity-70 transition-smooth hover:opacity-100">
            Çözümler
          </Link>
          <Link href="/ozellikler" className="text-sm font-medium text-[var(--foreground)] opacity-70 transition-smooth hover:opacity-100">
            Özellikler
          </Link>
          <Link href="/#fiyatlandirma" className="text-sm font-medium text-[var(--foreground)] opacity-70 transition-smooth hover:opacity-100">
            Fiyatlandırma
          </Link>
          <Link href="/hakkimizda" className="text-sm font-medium text-[var(--foreground)] opacity-70 transition-smooth hover:opacity-100">
            Hakkımızda
          </Link>
          <Button asChild size="sm" className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90">
            <a href="/siparis">Hemen Başla</a>
          </Button>
        </div>

        <button
          className="size-9 flex items-center justify-center rounded-lg md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[var(--editor-border)] bg-[var(--surface)] px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/cozumler" className="text-sm font-medium text-[var(--foreground)]" onClick={() => setMobileOpen(false)}>Çözümler</Link>
            <Link href="/ozellikler" className="text-sm font-medium text-[var(--foreground)]" onClick={() => setMobileOpen(false)}>Özellikler</Link>
            <Link href="/#fiyatlandirma" className="text-sm font-medium text-[var(--foreground)]" onClick={() => setMobileOpen(false)}>Fiyatlandırma</Link>
            <Link href="/hakkimizda" className="text-sm font-medium text-[var(--foreground)]" onClick={() => setMobileOpen(false)}>Hakkımızda</Link>
            <Button asChild size="sm" className="w-full bg-[var(--accent)] text-[var(--accent-foreground)]">
              <a href="/siparis" onClick={() => setMobileOpen(false)}>Hemen Başla</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
