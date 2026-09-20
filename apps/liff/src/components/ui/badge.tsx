import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from './Icon';

/** shadcn's badge with our tones. One tone per meaning: the mockups shipped three
    different visual languages for "confirmed / paid / available" (D51, D52). */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-label-sm text-label-sm',
  {
    variants: {
      tone: {
        success: 'bg-success-container text-on-success-container',
        peak: 'bg-secondary-container text-on-secondary-container',
        error: 'bg-error-container text-on-error-container',
        neutral: 'bg-surface-container-high text-on-surface-variant',
        info: 'bg-primary-fixed text-on-primary-fixed',
        line: 'bg-line text-primary-container',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

const DOTS: Record<NonNullable<VariantProps<typeof badgeVariants>['tone']>, string> = {
  success: 'bg-success', peak: 'bg-secondary', error: 'bg-error',
  neutral: 'bg-outline', info: 'bg-primary', line: 'bg-primary-container',
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  pulse?: boolean;
  icon?: IconName;
}

function Badge({ className, tone = 'neutral', dot, pulse, icon, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot && <span className={cn('size-1.5 rounded-full', DOTS[tone ?? 'neutral'], pulse && 'animate-pulse')} aria-hidden="true" />}
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
