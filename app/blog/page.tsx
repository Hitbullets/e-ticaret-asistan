'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl">Blog</h1>
          <p className="text-lg text-[var(--muted-foreground)]">E-ticaret ve içerik üretimi hakkında ipuçları.</p>
        </div>
        <Card className="border-[var(--editor-border)] bg-[var(--surface-container)]">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Package className="mb-4 size-12 text-[var(--primary)]" />
            <h2 className="mb-2 font-heading text-xl font-semibold">Yakında</h2>
            <p className="text-[var(--muted-foreground)]">Blog yazılarımız yakında yayında olacak.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
