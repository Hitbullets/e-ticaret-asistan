interface StatBadgeProps {
  value: string;
  label: string;
  variant?: 'coral' | 'teal';
}

export function StatBadge({ value, label, variant = 'coral' }: StatBadgeProps) {
  const colors = variant === 'coral'
    ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
    : 'bg-[var(--tertiary-container)] text-[var(--foreground)]';

  return (
    <div className={`flex flex-col items-center justify-center rounded-full px-4 py-3 text-center ${colors}`}>
      <div className="font-heading text-xl font-bold">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}
