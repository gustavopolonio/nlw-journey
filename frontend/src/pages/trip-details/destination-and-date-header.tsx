import { MapPin, Calendar, Settings2 } from 'lucide-react';
import { useLoaderData, LoaderFunction } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';

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

const destinationAndDateHeaderLoader: LoaderFunction<TripParams> = async function (
  { params },
) {
  const response = await api.get(`/trips/${params.tripId}`);
  return response.data;
};

export function DestinationAndDateHeader() {
  const { trip } = useLoaderData() as { trip: Trip };

  const displayedDate = trip
    ? format(trip?.starts_at, "d 'de' LLL").concat(' até ').concat(format(trip?.ends_at, "d 'de' LLL"))
    : null;

  return (
    <div className="flex items-center justify-between bg-zinc-900 px-4 h-16 rounded-xl shadow-shape">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">
            { displayedDate }
          </span>
        </div>

        <div className="w-px bg-zinc-800 h-6" />

        <Button variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>
    </div>
  );
}

DestinationAndDateHeader.loader = destinationAndDateHeaderLoader;
