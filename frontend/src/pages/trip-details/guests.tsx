import { CircleCheck, CircleDashed, UserCog } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';
import { ManageGuestsModal } from './manage-guests-modal';

interface Participant {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
}

export function Guests() {
  const { tripId } = useParams();
  const [participants, setpPrticipants] = useState<Participant[]>([]);
  const [isManageGuestsModalOpen, setIsManageGuestsModalOpen] = useState(false);

  function handleOpenManageGuestsModal() {
    setIsManageGuestsModalOpen(true);
  }

  function handleCloseManageGuestsModal() {
    setIsManageGuestsModalOpen(false);
  }

  const getParticipants = useCallback(async () => {
    const response = await api.get<{ participants: Participant[] }>(`/trips/${tripId}/participants`);
    setpPrticipants(response.data.participants);
  }, [tripId]);

  useEffect(() => {
    getParticipants();
  }, [getParticipants]);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5  max-h-52 overflow-y-auto">
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

      <Button variant="secondary" size="full" onClick={handleOpenManageGuestsModal}>
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>

      <ManageGuestsModal
        isOpen={isManageGuestsModalOpen}
        closeModal={handleCloseManageGuestsModal}
        getParticipants={getParticipants}
      />
    </div>
  );
}
