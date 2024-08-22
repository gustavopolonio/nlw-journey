import { Calendar, Tag, X } from 'lucide-react';
import { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';
import { useAppDispatch } from '../../app/hooks';
import { getActivitiesThunk } from '../../features/acitivities/activitiesSlice';

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void
}

export function CreateActivityModal({
  closeCreateActivityModal,
}: CreateActivityModalProps) {
  const { tripId } = useParams();
  const dispatch = useAppDispatch();

  async function handleCreateActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const activityTitle = formData.get('title')?.toString();
    const occursAt = formData.get('occurs_at')?.toString();

    // if (!activityTitle || !occursAt) return;

    try {
      await api.post(`/trips/${tripId}/activity`, {
        title: activityTitle,
        occurs_at: occursAt,
      });

      if (tripId) await dispatch(getActivitiesThunk({ tripId }));
    } catch (error) {
      console.log(error);
    } finally {
      closeCreateActivityModal();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="w-[640px] py-5 px-6 bg-zinc-900 rounded-xl shadow-shape space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>
            <button type="button" onClick={closeCreateActivityModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form onSubmit={handleCreateActivity} className="space-y-3">
          <div className="space-y-2">
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Tag className="size-5 text-zinc-400" />
              <input
                type="text"
                name="title"
                placeholder="Qual a atividade?"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Calendar className="size-5 text-zinc-400" />
              <input
                type="datetime-local"
                name="occurs_at"
                placeholder="Data e horário da atividade"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="full">
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  );
}
