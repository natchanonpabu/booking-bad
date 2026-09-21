import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from './Icon';
import { Spinner } from './Spinner';

/**
 * shadcn's button, adapted (Plan 01 §4.5, revised 2026-09-20):
 *  · variants are ours, not shadcn's — `bg-secondary` in the stock file is our dark
 *    brown, which is wrong for a muted button, so those classes are rewritten here
 *  · sizes are 48px minimum, because every target in this app is thumb-sized
 *  · `line` hard-codes navy text: white on the LINE green is 2.26:1 and fails AA
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-space-xs whitespace-nowrap rounded-xl transition-all active:scale-98 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary/90',
        tonal: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80',
        ghost: 'text-primary hover:bg-accent',
        outline: 'border border-outline-variant bg-surface-container-lowest text-primary hover:bg-accent',
        line: 'bg-line text-primary-container hover:bg-line-hover',
        danger: 'bg-error text-on-error hover:bg-error/90',
      },
      size: {
        md: 'min-h-touch px-space-md font-label-lg text-label-lg',
        lg: 'min-h-[52px] px-space-lg font-body-lg text-body-lg font-semibold',
        icon: 'size-11 rounded-full px-0',
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', fullWidth: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  loading?: boolean;
}

function Button({
  className, variant, size, fullWidth, asChild = false,
  leadingIcon, trailingIcon, loading = false, disabled, children, ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, fullWidth, className }));

  // Radix Slot merges props onto exactly ONE child element. Injecting an icon beside
  // `children` gives it three, and it throws — so an `asChild` button renders its child
  // untouched, and the caller puts any icon inside the link.
  if (asChild) {
    return <Slot data-slot="button" className={classes} {...props}>{children}</Slot>;
  }

  return (
    <button
      data-slot="button"
      className={classes}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size={20} /> : leadingIcon && <Icon name={leadingIcon} size={20} />}
      {children}
      {trailingIcon && !loading && <Icon name={trailingIcon} size={20} />}
    </button>
  );
}

export { Button, buttonVariants };
