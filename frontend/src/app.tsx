import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CreateTripPage } from './pages/create-trip';
import { TripDetailsPage } from './pages/trip-details';
import { ErrorPage } from './pages/error';
import { DestinationAndDateHeader } from './pages/trip-details/destination-and-date-header';
import { Activities } from './pages/trip-details/activities';
import { Guests } from './pages/trip-details/guests';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateTripPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/trips/:tripId',
    element: <TripDetailsPage />,
    loader: async ({ params, ...args }) => {
      const loaderArgs = {
        params: {
          tripId: params.tripId,
        },
        ...args,
      };

      const trip = await DestinationAndDateHeader.loader(loaderArgs);
      const activities = await Activities.loader(loaderArgs);
      const participants = await Guests.loader(loaderArgs);

      return {
        ...trip,
        ...activities,
        ...participants,
      };
    },
    errorElement: <ErrorPage />,
  },
]);

export function App() {
  return (
    <RouterProvider router={router} />
  );
}
