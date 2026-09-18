import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'base' | 'raised' | 'inset' | 'accent';

const VARIANTS: Record<Variant, string> = {
  base: 'bg-surface-container-lowest shadow-card',
  raised: 'bg-surface-container-lowest shadow-card-raised',
  inset: 'bg-surface-container-low',
  accent: 'bg-surface-container-lowest shadow-card relative overflow-hidden',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  /** Tailwind background class for the 6px accent bar, e.g. `bg-success`. */
  accentColor?: string;
}

export function Card({ variant = 'base', accentColor = 'bg-secondary', className, children, ...rest }: CardProps) {
  return (
    <div className={cn('rounded-xl p-space-md', VARIANTS[variant], className)} {...rest}>
      {variant === 'accent' && (
        <span className={cn('absolute inset-y-0 left-0 w-1.5', accentColor)} aria-hidden="true" />
      )}
      {children}
    </div>
  );
}
