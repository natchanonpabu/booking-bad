import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** shadcn's card plus the four surfaces this product actually uses. `accent` draws the
    6px left bar the booking cards carry; the colour is a Tailwind class so a caller can
    say which meaning it has (`bg-success` for confirmed, `bg-secondary` for pending). */
const cardVariants = cva('relative rounded-xl text-card-foreground', {
  variants: {
    variant: {
      base: 'bg-card shadow-card',
      raised: 'bg-card shadow-card-raised',
      inset: 'bg-surface-container-low',
      accent: 'overflow-hidden bg-card shadow-card',
    },
  },
  defaultVariants: { variant: 'base' },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  accentColor?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, accentColor = 'bg-secondary', children, ...props }, ref) => (
    <div ref={ref} data-slot="card" className={cn(cardVariants({ variant }), 'p-space-md', className)} {...props}>
      {variant === 'accent' && (
        <span className={cn('absolute inset-y-0 left-0 w-1.5', accentColor)} aria-hidden="true" />
      )}
      {children}
    </div>
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-header" className={cn('flex flex-col gap-1', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} data-slot="card-title" className={cn('font-headline-sm text-headline-sm text-primary', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} data-slot="card-description" className={cn('font-body-md text-body-md text-muted-foreground', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn('', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-footer" className={cn('flex items-center', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
