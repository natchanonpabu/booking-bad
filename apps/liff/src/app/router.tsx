import { createHashRouter } from 'react-router-dom';
import BookingGrid from '@/screens/booking-grid';
import Catalog from '@/screens/catalog';
import BookingReview from '@/screens/booking-review';
import BookingSuccess from '@/screens/booking-success';
import CourtProfile from '@/screens/court-profile';
import MyBookings from '@/screens/my-bookings';
import NotFound from '@/screens/not-found';
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
