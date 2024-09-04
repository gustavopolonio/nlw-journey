import {
  CircleCheck,
  CircleDashed,
  Trash,
  UserCog,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';
import { ManageGuestsModal } from './manage-guests-modal';

interface Participant {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
  is_owner: boolean
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

  async function handleRemoveParticipant(participant: Participant) {
    try {
      await api.delete(`/participants/${participant.id}`);
      await getParticipants();
    } catch (error) {
      console.log(error);
    }
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
          <div key={participant.id} className="flex items-center justify-between gap-5">
            <div className="space-y-1.5">
              <span className="font-medium text-zinc-100">
                {participant.is_owner ? (
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
            <div className="flex items-center gap-3 shrink-0">
              {participant.is_confirmed ? (
                <Tooltip title="Confirmou presença" color="#27272a" key="#27272a">
                  <CircleCheck className="size-5 text-lime-300" />
                </Tooltip>
              ) : (
                <Tooltip title="Não confirmou presença" color="#27272a" key="#27272a">
                  <CircleDashed className="size-5 text-zinc-400" />
                </Tooltip>
              )}

              {!participant.is_owner && (
                <Popconfirm
                  title="Remover convidado"
                  description={(
                    <div>
                      Tem certeza que deseja desconvidar o
                      {' '}
                      <span className="font-medium">
                        {participant.email}
                      </span>
                      ?
                    </div>
                )}
                  okText="Sim"
                  cancelText="Cancelar"
                  onConfirm={() => handleRemoveParticipant(participant)}
                >
                  <Button variant="outline" className="p-0">
                    <Trash className="size-5 text-zinc-400" />
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" size="full" onClick={handleOpenManageGuestsModal}>
        <UserCog className="size-5" />
        Adicionar convidados
      </Button>

      <ManageGuestsModal
        isOpen={isManageGuestsModalOpen}
        closeModal={handleCloseManageGuestsModal}
        getParticipants={getParticipants}
      />
    </div>
  );
}
