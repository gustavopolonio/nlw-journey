import { AtSign, Plus, X } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from '../../components/button';

interface InviteGuestsModalProps {
  closeGuestModal: () => void
  emailsToInvite: string[]
  removeEmailFromInvites: (emailToRemove: string) => void
  handleAddEmailToInvite: (e: FormEvent<HTMLFormElement>) => void
}

export function InviteGuestsModal({
  closeGuestModal,
  emailsToInvite,
  handleAddEmailToInvite,
  removeEmailFromInvites,
} : InviteGuestsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="w-[640px] py-5 px-6 bg-zinc-900 rounded-xl shadow-shape space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Selecionar convidados</h2>
            <button type="button" onClick={closeGuestModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na viagem.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {emailsToInvite.map((email) => (
            <div key={email} className="bg-zinc-800 rounded-md flex items-center py-1.5 px-2.5 gap-2.5">
              <span className="text-zinc-300">{email}</span>
              <button onClick={() => removeEmailFromInvites(email)} type="button">
                <X className="size-4 text-zinc-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="h-px bg-zinc-800" />

        <form onSubmit={handleAddEmailToInvite} className="bg-zinc-950 border border-zinc-800 p-2 flex items-center gap-2.5 rounded-lg">
          <div className="flex items-center gap-2 flex-1 pl-2">
            <AtSign className="size-5 text-zinc-400" />
            <input
              type="email"
              name="email"
              placeholder="Digite o e-mail do convidado?"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          <Button type="submit" variant="primary">
            Convidar
            <Plus className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
