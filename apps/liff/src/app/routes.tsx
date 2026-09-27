import type { ReactElement } from 'react';
import BookingGrid from '@/features/booking/routes/booking-grid';
import Catalog from './pages/catalog';
import BookingReview from '@/features/booking/routes/booking-review';
import BookingSuccess from '@/features/booking/routes/booking-success';
import CourtProfile from '@/features/venue/routes/court-profile';
import MyBookings from '@/features/booking/routes/my-bookings';
import NotFound from './pages/not-found';

export interface RouteDef {
  /** What react-router matches. `null` is the index route. */
  path: string | null;
  element: ReactElement;
}

/** Five screens plus the catch-all (Plan 01 §2.1, after Revision 5 cut the payment
    screen, the QR landing page and the hold-expiry screen).

    Data, and its own module, so a test can read it without constructing the router —
    createHashRouter touches `document` at import time.

    This is the one place that knows every URL. Pages live in the feature that owns them
    (features/booking/routes, features/venue/routes), so no folder mirrors the URL and
    nothing but this table says what the app serves. not-found and catalog are here
    instead: a 404 belongs to no feature, and the catalog is a scratch sheet for
    components/ui. */
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
