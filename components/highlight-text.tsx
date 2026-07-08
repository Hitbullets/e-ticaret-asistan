interface HighlightTextProps {
  children: React.ReactNode;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
}

export function HighlightText({ children, as: Tag = 'span' }: HighlightTextProps) {
  return (
    <Tag className="highlight-coral font-semibold text-[var(--accent)]">
      {children}
    </Tag>
  );
}
