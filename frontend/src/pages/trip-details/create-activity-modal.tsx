import { Calendar, Tag, X } from 'lucide-react';
import { Button } from '../../components/button';

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void
}

export function CreateActivityModal({
  closeCreateActivityModal,
}: CreateActivityModalProps) {
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

        <form className="space-y-3">
          <div className="space-y-2">
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Tag className="size-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Qual a atividade?"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Calendar className="size-5 text-zinc-400" />
              <input
                type="datetime-local"
                placeholder="Data e horário da atividade"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>
          </div>

          <Button variant="primary" size="full">
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  );
}
