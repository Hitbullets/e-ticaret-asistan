'use client';

import { Copy } from 'lucide-react';

export function CopyButton({ text, className }: { text: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      className={className}
      title="Kopyala"
    >
      <Copy className="size-4" />
    </button>
  );
}
