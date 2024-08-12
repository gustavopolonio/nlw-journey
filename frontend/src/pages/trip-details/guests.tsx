import { CircleCheck, CircleDashed, UserCog } from 'lucide-react';
import { LoaderFunction, useLoaderData } from 'react-router-dom';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';

interface Participant {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
}

interface TripParams {
  tripId: string
}

const guestsLoader: LoaderFunction<TripParams> = async function (
  { params },
) {
  const response = await api.get<{ participants: Participant[] }>(`/trips/${params.tripId}/participants`);
  return response.data;
};

export function Guests() {
  const { participants } = useLoaderData() as { participants: Participant[] };

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        {participants?.map((participant, index) => (
          <div key={participant.id} className="flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="font-medium text-zinc-100">{participant.name ?? `Convidado ${index}`}</span>
              <span className="text-sm text-zinc-400 block truncate">
                {participant.email}
              </span>
            </div>
            {participant.is_confirmed ? (
              <CircleCheck className="size-5 text-lime-300 shrink-0" />
            ) : (
              <CircleDashed className="size-5 text-zinc-400 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Button variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>
    </div>
  );
}

Guests.loader = guestsLoader;
