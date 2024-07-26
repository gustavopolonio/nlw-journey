import { CircleCheck } from 'lucide-react';

export function Activities() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-zinc-300 text-xl font-semibold">Dia 17</span>
          <span className="text-zinc-500 text-xs">Sábado</span>
        </div>
        <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-zinc-300 text-xl font-semibold">Dia 18</span>
          <span className="text-zinc-500 text-xs">Domingo</span>
        </div>
        <div className="flex items-center justify-between py-2.5 px-4 bg-zinc-900 rounded-xl shadow-shape">
          <div className="flex items-center gap-3">
            <CircleCheck className="size-5 text-lime-300" />
            <span className="text-zinc-100">Corrida de Kart</span>
          </div>
          <span className="text-zinc-400 text-sm">14:00h</span>
        </div>
        <div className="flex items-center justify-between py-2.5 px-4 bg-zinc-900 rounded-xl shadow-shape">
          <div className="flex items-center gap-3">
            <CircleCheck className="size-5 text-lime-300" />
            <span className="text-zinc-100">Almoço</span>
          </div>
          <span className="text-zinc-400 text-sm">12:00h</span>
        </div>
      </div>
    </div>
  );
}
