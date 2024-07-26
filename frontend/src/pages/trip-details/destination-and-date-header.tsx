import { MapPin, Calendar, Settings2 } from 'lucide-react';
import { Button } from '../../components/button';

export function DestinationAndDateHeader() {
  return (
    <div className="flex items-center justify-between bg-zinc-900 px-4 h-16 rounded-xl shadow-shape">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">Florianópolis, Brasil</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">17 a 23 de Agosto</span>
        </div>

        <div className="w-px bg-zinc-800 h-6" />

        <Button variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>
    </div>
  );
}
