import { MapPin, Calendar, Settings2 } from 'lucide-react';
import { useLoaderData, LoaderFunction } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';
import { UpdateTripModal } from './update-trip-modal';

interface Trip {
  destination: string
  id: string
  is_confirmed: boolean
  starts_at: string
  ends_at: string
}

interface TripParams {
  tripId: string
}

const destinationAndDateHeaderLoader: LoaderFunction<TripParams> = async (
  { params },
) => {
  const response = await api.get(`/trips/${params.tripId}`);
  return response.data;
};

export function DestinationAndDateHeader() {
  const { trip } = useLoaderData() as { trip: Trip };
  const [isUpdateTripModalOpen, setIsUpdateTripModalOpen] = useState(false);

  const displayedDate = trip
    ? format(trip?.starts_at, "d 'de' LLL").concat(' até ').concat(format(trip?.ends_at, "d 'de' LLL"))
    : null;

  function openUpdateTripModal() {
    setIsUpdateTripModalOpen(true);
  }

  function closeUpdateTripModal() {
    setIsUpdateTripModalOpen(false);
  }

  return (
    <div className="flex flex-col justify-between gap-3 bg-zinc-900 p-4 rounded-xl shadow-shape sm:flex-row sm:items-center sm:h-16 sm:py-0">
      <div className="h-11 flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="h-px w-full bg-zinc-800 sm:hidden" />

      <div className="w-full flex flex-col items-start gap-3 sm:items-center sm:gap-5 sm:flex-row sm:w-fit">
        <div className="h-11 flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">
            { displayedDate }
          </span>
        </div>

        <div className="hidden w-px bg-zinc-800 h-6 sm:block" />

        <Button
          variant="secondary"
          size="full"
          onClick={openUpdateTripModal}
          className="sm:w-fit"
        >
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>

      <UpdateTripModal
        isOpen={isUpdateTripModalOpen}
        closeModal={closeUpdateTripModal}
        trip={trip}
      />
    </div>
  );
}

DestinationAndDateHeader.loader = destinationAndDateHeaderLoader;
