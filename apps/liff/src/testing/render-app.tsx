import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ROUTES } from '@/app/routes';
import { BookingFlowProvider } from '@/app/providers/booking-flow-provider';
import { ToastProvider } from '@/components/ui/toast';

/**
 * Mounts the app's real route table at `path`, inside the real providers.
 *
 * Built from ROUTES, never a copy. Both cross-feature tests used to declare their own
 * `<Route path="/book/success/:ref">`, so renaming a path or a param in app/routes.tsx
 * left every test green against a table the app does not use — verified: `:ref` → `:code`
 * there passed all 16. Reading the table is what closes that, and `useParams()` keys are
 * not something TypeScript can check.
 *
 * AppLayout is deliberately left out: these assert a screen's own markup, and the header
 * and nav have their own tests.
 */
export const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <BookingFlowProvider>
          <Routes>
            {ROUTES.map(({ path: routePath, element }) =>
              routePath === null ? (
                <Route key="index" index element={element} />
              ) : (
                <Route key={routePath} path={routePath} element={element} />
              ),
            )}
          </Routes>
        </BookingFlowProvider>
      </ToastProvider>
    </MemoryRouter>,
  );
