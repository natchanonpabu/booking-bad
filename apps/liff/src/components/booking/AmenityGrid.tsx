import { Icon, type IconName } from '@/components/ui/Icon';
import type { Amenity } from '@/data/types';

export function AmenityGrid({ items }: { items: Amenity[] }) {
  return (
    <ul className="grid grid-cols-2 gap-space-xs">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-space-xs rounded-xl bg-surface-container-low p-space-sm">
          <Icon name={item.icon as IconName} size={20} className="mt-0.5 shrink-0 text-secondary" />
          <div className="min-w-0">
            <p className="font-label-md text-label-md text-on-surface">{item.title}</p>
            <p className="font-body-sm text-body-sm text-muted-foreground">{item.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
