'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <Sparkles className="size-5" />
          SatışMetni AI
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/#ozellikler" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">
            Özellikler
          </Link>
          <Link href="/#fiyatlandirma" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">
            Fiyatlandırma
          </Link>
          <Link href="/#deneme" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">
            Ücretsiz Dene
          </Link>
          <Button asChild size="sm">
            <a href="/siparis">Hemen Başla</a>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="size-9 flex items-center justify-center rounded-lg md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/#ozellikler" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Özellikler
            </Link>
            <Link href="/#fiyatlandirma" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Fiyatlandırma
            </Link>
            <Link href="/#deneme" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Ücretsiz Dene
            </Link>
            <Button asChild size="sm" className="w-full">
              <a href="/siparis" onClick={() => setMobileOpen(false)}>Hemen Başla</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
