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
    <div className="bg-zinc-900 rounded-xl p-4 flex flex-col items-center shadow-shape gap-3 sm:flex-row sm:items-center sm:py-3 sm:gap-5">
      <button
        type="button"
        onClick={openGuestModal}
        className="w-full h-11 flex items-center gap-2 sm:flex-1"
      >
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

      <Button
        onClick={openConfirmTripModal}
        variant="primary"
        size="full"
        className="sm:w-fit"
      >
        Confirmar viagem
        <ArrowRight className="size-5 text-lime-950" />
      </Button>
    </div>
  );
}
