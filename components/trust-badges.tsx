import { Shield, Lock, Clock, CreditCard } from 'lucide-react';

const badges = [
  { icon: Shield, label: '256-bit SSL' },
  { icon: Lock, label: 'KVKK Uyumlu' },
  { icon: Clock, label: '5 Dakikada Teslimat' },
  { icon: CreditCard, label: 'Güvenli Ödeme' },
];

export function TrustBadges({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        {badges.map((badge) => (
          <span key={badge.label} className="flex items-center gap-1">
            <badge.icon className="size-3" />
            {badge.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border/50 bg-background/50 px-6 py-3">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <badge.icon className="size-4 text-primary" />
          </div>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
