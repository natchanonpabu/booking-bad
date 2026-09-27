import { createHashRouter } from 'react-router-dom';
import { AppLayout } from '@/layouts/app-layout';
import { ROUTES } from './routes';

/** Hash router: works on any static host with no rewrite rules, and on a laptop
    shared over the venue's wifi. The table itself lives in ./routes. */
export const router = createHashRouter(
  [
    {
      element: <AppLayout />,
      children: ROUTES.map(({ path, element }) =>
        path === null ? { index: true, element } : { path, element },
      ),
    },
  ],
  {
    // Opt in to v7 behaviour now, so a later move to React Router 7 is a version bump.
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
