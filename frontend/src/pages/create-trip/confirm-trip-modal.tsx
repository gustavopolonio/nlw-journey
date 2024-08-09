import { Mail, User, X } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from '../../components/button';

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void
  createTrip: (e: FormEvent<HTMLFormElement>) => void
  setOwnerName: (name: string) => void
  setOwnerEmail: (email: string) => void
  isCreatingTrip: boolean
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  createTrip,
  setOwnerName,
  setOwnerEmail,
  isCreatingTrip,
}: ConfirmTripModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="w-[640px] py-5 px-6 bg-zinc-900 rounded-xl shadow-shape space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Confirmar criação da viagem</h2>
            <button type="button" onClick={closeConfirmTripModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Para concluir a criação da viagem para
            {' '}
            <span className="text-zinc-100 font-semibold">Florianópolis, Brasil</span>
            {' '}
            nas datas de
            {' '}
            <span className="text-zinc-100 font-semibold">16 a 27 de Agosto de 2024</span>
            {' '}
            preencha seus dados abaixo:
          </p>
        </div>

        <form onSubmit={createTrip} className="space-y-3">
          <div className="space-y-2">
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <User className="size-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Seu nome completo"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Mail className="size-5 text-zinc-400" />
              <input
                type="email"
                placeholder="Seu e-mail pessoal"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                onChange={(e) => setOwnerEmail(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="full" disabled={isCreatingTrip}>
            Confirmar criação da viagem
          </Button>
        </form>
      </div>
    </div>
  );
}
