import { Icon } from '@/components/ui/icon';

/** Four keys, each showing the same non-colour encoding the grid uses (DESIGN.md §2). */
export function LegendBar({ standard, peak }: { standard: string; peak: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 rounded-xl bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded border border-outline-variant bg-card" />
        ว่าง {standard}
      </span>
      <span className="flex items-center gap-1.5">
        <Icon name="bolt" size={14} className="text-secondary" />
        ช่วงพีค {peak}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="swatch-booked size-3 rounded border border-outline-variant" />
        เต็มแล้ว
      </span>
      <span className="flex items-center gap-1.5">
        <span className="swatch-maintenance size-3 rounded border border-outline-variant" />
        ปิดปรับปรุง
      </span>
    </div>
  );
}
