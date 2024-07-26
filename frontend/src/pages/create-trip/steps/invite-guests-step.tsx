import { ArrowRight, UserRoundPlus } from 'lucide-react';
import { Button } from '../../../components/button';

interface InviteGuestsStepProps {
  emailsToInvite: string[]
  openGuestModal: () => void
  openConfirmTripModal: () => void
}

export function InviteGuestsStep({
  emailsToInvite,
  openGuestModal,
  openConfirmTripModal,
}: InviteGuestsStepProps) {
  return (
    <div className="h-16 bg-zinc-900 rounded-xl px-4 flex items-center shadow-shape gap-5">
      <button type="button" onClick={openGuestModal} className="flex items-center gap-2 flex-1">
        <UserRoundPlus className="size-5 text-zinc-400" />
        {emailsToInvite.length > 0 ? (
          <span className="w-full bg-transparent text-lg text-zinc-100 text-left">
            {emailsToInvite.length}
            {' '}
            pessoa(s) convidada(s)
          </span>
        ) : (
          <span className="w-full bg-transparent text-lg text-zinc-400 text-left">
            Quem estará na viagem?
          </span>
        )}
      </button>

      <Button onClick={openConfirmTripModal} variant="primary">
        Confirmar viagem
        <ArrowRight className="size-5 text-lime-950" />
      </Button>
    </div>
  );
}
