import { NavLink } from 'react-router-dom';
import { ENABLED_NAV } from '@/app/navConfig';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

export function BottomNav() {
  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-nav bg-surface-container-lowest pb-safe shadow-app-nav"
    >
      <ul className="mx-auto flex h-app-nav max-w-liff items-stretch">
        {ENABLED_NAV.map((item) => (
          <li key={item.id} className="flex flex-1">
            {/* NavLink sets aria-current="page" from the router — never hard-coded. */}
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-touch flex-1 flex-col items-center justify-center gap-0.5 font-label-sm text-label-sm',
                  isActive ? 'font-bold text-primary' : 'text-on-surface-variant',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} filled={isActive} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
