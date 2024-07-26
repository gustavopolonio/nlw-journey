import {
  ArrowRight,
  Calendar,
  MapPin,
  Settings2,
} from 'lucide-react';
import { Button } from '../../../components/button';

interface DestinationAndDateStepProps {
  isGuestInputVisible: boolean
  hideGuestInput: () => void
  showGuestInput: () => void
}

export function DestinationAndDateStep({
  isGuestInputVisible,
  hideGuestInput,
  showGuestInput,
}: DestinationAndDateStepProps) {
  return (
    <div className="h-16 bg-zinc-900 rounded-xl px-4 flex items-center shadow-shape gap-5">
      <div className="flex items-center gap-2 flex-1">
        <MapPin className="size-5 text-zinc-400" />
        <input disabled={isGuestInputVisible} type="text" placeholder="Para onde você vai?" className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none" />
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="size-5 text-zinc-400" />
        <input disabled={isGuestInputVisible} type="text" placeholder="Quando?" className="max-w-24 bg-transparent text-lg placeholder-zinc-400 outline-none" />
      </div>

      <div className="w-px bg-zinc-800 h-6" />

      {isGuestInputVisible ? (
        <Button onClick={hideGuestInput} variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      ) : (
        <Button onClick={showGuestInput} variant="primary">
          Continuar
          <ArrowRight className="size-5 text-lime-950" />
        </Button>
      )}
    </div>
  );
}
