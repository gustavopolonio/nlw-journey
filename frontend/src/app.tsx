import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { CreateTripPage } from './pages/create-trip';
import { TripDetailsPage } from './pages/trip-details';
import { ErrorPage } from './pages/error';
import { DestinationAndDateHeader } from './pages/trip-details/destination-and-date-header';
import { store } from './app/store';

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

      return {
        ...trip,
      };
    },
    errorElement: <ErrorPage />,
  },
]);

export function App() {
  return (
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  );
}
