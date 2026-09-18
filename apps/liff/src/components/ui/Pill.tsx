import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { cn } from '@/lib/cn';

type Tone = 'success' | 'peak' | 'error' | 'neutral' | 'info' | 'line';

// One tone per meaning. The mockups shipped three different visual languages for
// "confirmed / paid / available"; `success` is now one thing (D51/D52).
const TONES: Record<Tone, string> = {
  success: 'bg-success-container text-on-success-container',
  peak: 'bg-secondary-container text-on-secondary-container',
  error: 'bg-error-container text-on-error-container',
  neutral: 'bg-surface-container-high text-on-surface-variant',
  info: 'bg-primary-fixed text-on-primary-fixed',
  line: 'bg-line text-primary-container',
};

const DOTS: Record<Tone, string> = {
  success: 'bg-success', peak: 'bg-secondary', error: 'bg-error',
  neutral: 'bg-outline', info: 'bg-primary', line: 'bg-primary-container',
};

export function Pill({ tone = 'neutral', dot = false, pulse = false, icon, children, className }: {
  tone?: Tone; dot?: boolean; pulse?: boolean; icon?: IconName; children: ReactNode; className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-label-sm text-label-sm', TONES[tone], className)}>
      {dot && <span className={cn('size-1.5 rounded-full', DOTS[tone], pulse && 'animate-pulse')} aria-hidden="true" />}
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}
