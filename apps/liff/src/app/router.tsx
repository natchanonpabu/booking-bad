import { createHashRouter } from 'react-router-dom';
import BookingGrid from '@/screens/BookingGrid';
import Catalog from '@/screens/Catalog';
import BookingReview from '@/screens/BookingReview';
import BookingSuccess from '@/screens/BookingSuccess';
import CourtProfile from '@/screens/CourtProfile';
import HoldExpired from '@/screens/HoldExpired';
import MyBookings from '@/screens/MyBookings';
import NotFound from '@/screens/NotFound';
import Payment from '@/screens/Payment';
import QrDemo from '@/screens/QrDemo';
import { AppShell } from './AppShell';

/** Nine routes (Plan 01 §2.1). Hash router: works on any static host with no rewrite
    rules; whether LIFF's `liff.state` survives it is verified on Day 15 (§3.5 #3). */
export const router = createHashRouter(
  [
    {
      element: <AppShell />,
      children: [
        { index: true, element: <CourtProfile /> },
        { path: 'book', element: <BookingGrid /> },
        { path: 'book/review', element: <BookingReview /> },
        { path: 'book/pay', element: <Payment /> },
        { path: 'book/success/:ref', element: <BookingSuccess /> },
        { path: 'book/expired', element: <HoldExpired /> },
        { path: 'bookings', element: <MyBookings /> },
        { path: 'qr-demo', element: <QrDemo /> },
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
