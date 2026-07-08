interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-[var(--editor-border)] bg-[var(--surface-container)] p-6 transition-smooth hover:border-[var(--primary)]/30">
      <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[var(--primary)]/10">
        <span className="material-symbols-outlined text-[var(--primary)]">{icon}</span>
      </div>
      <h3 className="mb-2 font-heading text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
    </div>
  );
}
