import { CircleCheck, CircleDashed, UserCog } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';

interface Participant {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
}

export function Guests() {
  const { tripId } = useParams();
  const [participants, setpPrticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function getParticipants() {
      const response = await api.get<{ participants: Participant[] }>(`/trips/${tripId}/participants`);
      setpPrticipants(response.data.participants);
    }
    getParticipants();
  }, [tripId]);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        {participants?.map((participant, index) => (
          <div key={participant.id} className="flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="font-medium text-zinc-100">
                {participant.name ? (
                  <>
                    {participant.name}
                    {' '}
                    -
                    {' '}
                    <span className="text-lime-300">Organizador</span>
                  </>
                ) : `Convidado ${index}`}
              </span>
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
