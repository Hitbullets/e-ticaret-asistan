import { Button } from '@/components/ui/button';

interface EditorialButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function EditorialButton({
  variant = 'primary',
  size = 'default',
  children,
  href,
  onClick,
  disabled,
  className = '',
  type = 'button',
}: EditorialButtonProps) {
  const variantClasses = {
    primary: 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90',
    secondary: 'border border-[var(--editor-border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-container)]',
    ghost: 'bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-container)]',
  };

  const classes = `${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Button asChild size={size} className={classes}>
        <a href={href}>{children}</a>
      </Button>
    );
  }

  return (
    <Button size={size} className={classes} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </Button>
  );
}
