import type { ReactNode } from 'react';
import { asset } from '@/lib/asset';

type Pose = 'idle' | 'cheer' | 'sleep';

const MASCOT: Record<Pose, { src: string; alt: string }> = {
  idle: { src: 'mascot/capybara-idle.webp', alt: 'คาปิบาร่าถือแร็กเกตยืนรออยู่' },
  cheer: { src: 'mascot/capybara-cheer.webp', alt: 'คาปิบาร่าชูแร็กเกตดีใจ' },
  sleep: { src: 'mascot/capybara-sleep.webp', alt: 'คาปิบาร่านอนหลับ' },
};

export function EmptyState({ mascot = 'idle', badge, headline, body, primaryAction, secondary }: {
  mascot?: Pose; badge?: ReactNode; headline: string; body?: string;
  primaryAction?: ReactNode; secondary?: ReactNode;
}) {
  const art = MASCOT[mascot];
  return (
    <div className="flex flex-col items-center px-space-md py-space-xl text-center">
      <img src={asset(art.src)} alt={art.alt} width={160} height={160} className="size-40" />
      {badge && <div className="mt-space-sm">{badge}</div>}
      <h2 className="mt-space-md font-headline-sm text-headline-sm text-primary">{headline}</h2>
      {body && <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">{body}</p>}
      {primaryAction && <div className="mt-space-lg w-full">{primaryAction}</div>}
      {secondary && <div className="mt-space-sm">{secondary}</div>}
    </div>
  );
}
