interface ComparisonCardProps {
  inputTitle: string;
  inputContent: React.ReactNode;
  outputTitle: string;
  outputContent: React.ReactNode;
  badge?: { text: string; value: string };
}

export function ComparisonCard({ inputTitle, inputContent, outputTitle, outputContent, badge }: ComparisonCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--editor-border)]">
      {badge && (
        <div className="absolute -right-3 -top-3 z-10 flex size-20 items-center justify-center rounded-full bg-[var(--accent)] text-center text-xs font-bold text-[var(--accent-foreground)] shadow-lg">
          <div>
            <div className="text-lg font-bold">{badge.value}</div>
            <div className="text-[10px]">{badge.text}</div>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2">
        {/* Input Side - Dark */}
        <div className="bg-[var(--editor-surface)] p-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{inputTitle}</div>
          <div className="text-sm text-[var(--foreground)] opacity-60">{inputContent}</div>
        </div>
        {/* Output Side - Light */}
        <div className="bg-white p-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">{outputTitle}</div>
          <div className="text-sm text-gray-900">{outputContent}</div>
        </div>
      </div>
    </div>
  );
}
