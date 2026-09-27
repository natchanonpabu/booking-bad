import type { ReactElement } from 'react';
import BookingGrid from '@/routes/book/page';
import Catalog from '@/routes/__catalog/page';
import BookingReview from '@/routes/book/review/page';
import BookingSuccess from '@/routes/book/success/[ref]/page';
import CourtProfile from '@/routes/home/page';
import MyBookings from '@/routes/bookings/page';
import NotFound from '@/routes/not-found/page';

export interface RouteDef {
  /** What react-router matches. `null` is the index route. */
  path: string | null;
  element: ReactElement;
}

/** Five screens plus the catch-all (Plan 01 §2.1, after Revision 5 cut the payment
    screen, the QR landing page and the hold-expiry screen).

    Data, and its own module, so routes.test.ts can read it without constructing the
    router — createHashRouter touches `document` at import time. react-router has no
    filesystem routing, so src/routes/ mirrors these paths by convention only and that
    test is what keeps a folder and its URL in step. Adding a route is a line here plus
    the folder the test asks for. */
export const ROUTES: readonly RouteDef[] = [
  { path: null, element: <CourtProfile /> },
  { path: 'book', element: <BookingGrid /> },
  { path: 'book/review', element: <BookingReview /> },
  { path: 'book/success/:ref', element: <BookingSuccess /> },
  { path: 'bookings', element: <MyBookings /> },
  // Scratch route for the device pass; not linked from the app.
  { path: '__catalog', element: <Catalog /> },
  { path: '*', element: <NotFound /> },
];
