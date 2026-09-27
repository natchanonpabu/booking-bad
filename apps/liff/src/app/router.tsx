import { createHashRouter } from 'react-router-dom';
import BookingGrid from '@/routes/book/page';
import Catalog from '@/routes/__catalog/page';
import BookingReview from '@/routes/book/review/page';
import BookingSuccess from '@/routes/book/success/[ref]/page';
import CourtProfile from '@/routes/home/page';
import MyBookings from '@/routes/bookings/page';
import NotFound from '@/routes/not-found/page';
import { AppLayout } from '@/layouts/app-layout';

/** Five screens plus the catch-all (Plan 01 §2.1, after Revision 5 cut the payment
    screen, the QR landing page and the hold-expiry screen). Hash router: works on any
    static host with no rewrite rules, and on a laptop shared over the venue's wifi. */
export const router = createHashRouter(
  [
    {
      element: <AppLayout />,
      children: [
        { index: true, element: <CourtProfile /> },
        { path: 'book', element: <BookingGrid /> },
        { path: 'book/review', element: <BookingReview /> },
        { path: 'book/success/:ref', element: <BookingSuccess /> },
        { path: 'bookings', element: <MyBookings /> },
        // Scratch route for the device pass; not linked from the app.
        { path: '__catalog', element: <Catalog /> },
        { path: '*', element: <NotFound /> },
      ],
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
