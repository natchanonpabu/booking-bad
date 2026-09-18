import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { Spinner } from './Spinner';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'tonal' | 'ghost' | 'line' | 'danger';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  ghost: 'bg-transparent text-primary',
  // White on the LINE green is 2.26:1 and fails AA, so this variant hard-codes navy
  // text and there is no prop that can change it (Plan 01 §5.1, correction 1).
  line: 'bg-line text-primary-container',
  danger: 'bg-error text-on-error',
};

const SIZES: Record<Size, string> = {
  md: 'min-h-touch px-space-md gap-space-xs text-label-lg font-label-lg',
  lg: 'min-h-[52px] px-space-lg gap-space-sm text-body-lg font-body-lg font-semibold',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
  /** Render as the child element (a router <Link>, say) keeping these styles. */
  asChild?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'primary', size = 'md', leadingIcon, trailingIcon, loading = false,
  fullWidth = false, asChild = false, className, disabled, children, ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-transform',
        'disabled:opacity-40 disabled:pointer-events-none active:scale-98',
        VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className,
      )}
      aria-busy={loading || undefined}
      disabled={asChild ? undefined : disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size={20} /> : leadingIcon && <Icon name={leadingIcon} size={20} />}
      {children}
      {trailingIcon && !loading && <Icon name={trailingIcon} size={20} />}
    </Comp>
  );
}
