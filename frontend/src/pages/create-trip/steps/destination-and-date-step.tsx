import {
  ArrowRight,
  Calendar,
  MapPin,
  Settings2,
  X,
} from 'lucide-react';
import { DateRange, DayPicker, getDefaultClassNames } from 'react-day-picker';
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '../../../components/button';
// eslint-disable-next-line import/no-unresolved
import 'react-day-picker/style.css';

interface DestinationAndDateStepProps {
  isGuestInputVisible: boolean
  hideGuestInput: () => void
  showGuestInput: () => void
  setDestination: (destination: string) => void
  eventStartAndEndDate: DateRange | undefined
  setEventStartAndEndDate: (dates: DateRange | undefined) => void
}

export function DestinationAndDateStep({
  isGuestInputVisible,
  hideGuestInput,
  showGuestInput,
  setDestination,
  eventStartAndEndDate,
  setEventStartAndEndDate,
}: DestinationAndDateStepProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [eventStartAndEndDateAux, setEventStartAndEndDateAux] = useState<DateRange | undefined>();
  // const [eventStartAndEndDate, setEventStartAndEndDate] = useState<DateRange | undefined>();

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    setEventStartAndEndDateAux(undefined);
    setIsDatePickerOpen(false);
  }

  function handleSelectEventStartAndEndDate() {
    if (
      eventStartAndEndDateAux
      && eventStartAndEndDateAux.from
      && eventStartAndEndDateAux.to
    ) {
      setEventStartAndEndDate(eventStartAndEndDateAux);
      closeDatePicker();
    }
  }

  const defaultClassNames = getDefaultClassNames();

  const displayedDate = eventStartAndEndDate && eventStartAndEndDate.from && eventStartAndEndDate.to
    ? format(eventStartAndEndDate.from, "d 'de' LLL").concat(' até ').concat(format(eventStartAndEndDate.to, "d 'de' LLL"))
    : null;

  return (
    <div className="h-16 bg-zinc-900 rounded-xl px-4 flex items-center shadow-shape gap-5">
      <div className="flex items-center gap-2 flex-1">
        <MapPin className="size-5 text-zinc-400" />
        <input
          disabled={isGuestInputVisible}
          type="text"
          placeholder="Para onde você vai?"
          className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="flex items-center gap-2 text-lg text-zinc-400"
        disabled={isGuestInputVisible}
        onClick={openDatePicker}
      >
        <Calendar className="size-5" />
        <span>
          {displayedDate || 'Quando'}
        </span>
      </button>

      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="py-5 px-6 bg-zinc-900 rounded-xl shadow-shape space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Selecione a data</h2>
                <button type="button" onClick={closeDatePicker}>
                  <X className="size-5 text-zinc-400" />
                </button>
              </div>
            </div>

            <DayPicker
              mode="range"
              selected={eventStartAndEndDate}
              onSelect={setEventStartAndEndDateAux}
              classNames={{
                range_start: `${defaultClassNames.range_start} bg-gradient-to-r from-transparent from-50% to-lime-300 to-50%`,
                range_end: `${defaultClassNames.range_end} bg-gradient-to-l from-transparent from-50% to-lime-300 to-50%`,
                range_middle: `${defaultClassNames.range_middle} bg-lime-300 text-lime-950`,
                chevron: 'fill-lime-300',
                today: 'text-lime-300',
              }}
            />

            <Button
              variant="primary"
              className="ml-auto"
              onClick={handleSelectEventStartAndEndDate}
              disabled={!eventStartAndEndDateAux
                || !eventStartAndEndDateAux.from
                || !eventStartAndEndDateAux.to}
            >
              Ok
            </Button>
          </div>
        </div>
      )}

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
