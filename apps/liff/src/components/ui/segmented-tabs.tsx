import { useId } from 'react';
import { useRovingFocus } from '@/lib/use-roving-focus';
import { cn } from '@/lib/utils';

export interface TabItem { id: string; label: string; count?: number }

/** Real tablist semantics (the mockups swap className and expose nothing), with the
    hand-written roving focus so a disabled tab would still be reachable (§4.5). */
export function SegmentedTabs({ tabs, value, onChange, className }: {
  tabs: TabItem[]; value: string; onChange: (id: string) => void; className?: string;
}) {
  const base = useId();
  const roving = useRovingFocus(tabs.length, Math.max(0, tabs.findIndex((t) => t.id === value)));

  return (
    <div role="tablist" className={cn('flex gap-1 rounded-xl bg-surface-container p-1', className)}>
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${base}-panel-${tab.id}`}
            className={cn(
              'min-h-touch flex-1 rounded-lg px-space-sm font-label-lg text-label-lg transition-colors',
              selected ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant',
            )}
            onClick={() => onChange(tab.id)}
            {...roving.itemProps(index)}
          >
            {tab.label}
            {tab.count !== undefined && <span className="ml-1 opacity-70">{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
