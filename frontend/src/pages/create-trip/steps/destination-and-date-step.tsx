import {
  ArrowRight,
  Calendar,
  MapPin,
  Settings2,
  X,
} from 'lucide-react';
import { DateRange, DayPicker, getDefaultClassNames } from 'react-day-picker';
import { ChangeEvent, useState } from 'react';
import { format, isBefore } from 'date-fns';
import { z } from 'zod';
import { Button } from '../../../components/button';
import 'react-day-picker/style.css';

interface DestinationAndDateStepProps {
  isGuestInputVisible: boolean
  hideGuestInput: () => void
  showGuestInput: () => void
  tripDestination: string
  setDestination: (destination: string) => void
  eventStartAndEndDate: DateRange | undefined
  setEventStartAndEndDate: (dates: DateRange | undefined) => void
}

const destinationAndDateFormSchema = z.object({
  destination: z.string().trim().min(3, { message: 'Destino deve ter no mínimo 3 caracteres' }),
  startsAt: z.coerce.date({
    errorMap: ({ code }, { defaultError }) => ({
      message: code === 'invalid_date' ? 'Selecione uma data' : defaultError,
    }),
  }).refine((date) => !isBefore(date, new Date().setHours(0, 0, 0, 0)), {
    message: 'A data inicial da viagem não pode ser anterior ao dia de hoje',
  }),
  endsAt: z.coerce.date({
    errorMap: ({ code }, { defaultError }) => ({
      message: code === 'invalid_date' ? 'Selecione uma data' : defaultError,
    }),
  }),
});

type DestinationAndDateFormSchema = z.infer<typeof destinationAndDateFormSchema>
type DestinationAndDateFormErrors = {
  [key in keyof DestinationAndDateFormSchema]?: string[]
}
type ValidateDestinationAndDateFormSchema = {
  [key in keyof DestinationAndDateFormSchema]?: string
}

export function DestinationAndDateStep({
  isGuestInputVisible,
  hideGuestInput,
  showGuestInput,
  tripDestination,
  setDestination,
  eventStartAndEndDate,
  setEventStartAndEndDate,
}: DestinationAndDateStepProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startAndEndDate, setStartAndEndDate] = useState<DateRange | undefined>(
    eventStartAndEndDate,
  );
  const [destinationAndDateFormErrors, setDestinationAndDateFormErrors] = useState<
    DestinationAndDateFormErrors | undefined
  >(undefined);
  const [hasAttemptedSubmitForm, setHasAttemptedSubmitForm] = useState(false);

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function closeDatePicker(dateWasUpdated = true) {
    if (!dateWasUpdated) {
      setStartAndEndDate(eventStartAndEndDate);
    }
    setIsDatePickerOpen(false);
  }

  function handleSelectEventStartAndEndDate() {
    if (
      startAndEndDate
      && startAndEndDate.from
      && startAndEndDate.to
    ) {
      setEventStartAndEndDate(startAndEndDate);
      checkStartsAndEndsAtInputsValid(
        startAndEndDate.from.toString(),
        startAndEndDate.to.toString(),
      );
      closeDatePicker();
    }
  }

  const defaultClassNames = getDefaultClassNames();

  const displayedDate = eventStartAndEndDate && eventStartAndEndDate.from && eventStartAndEndDate.to
    ? format(eventStartAndEndDate.from, "d 'de' LLL").concat(' até ').concat(format(eventStartAndEndDate.to, "d 'de' LLL"))
    : null;

  function validateDestinationAndDateFormSchema({
    destination,
    startsAt,
    endsAt,
  }: ValidateDestinationAndDateFormSchema) {
    const destinationAndDateFormSchemaParsed = destinationAndDateFormSchema.safeParse({
      destination: destination ?? tripDestination,
      startsAt: startsAt ?? eventStartAndEndDate?.from,
      endsAt: endsAt ?? eventStartAndEndDate?.to,
    });

    const formErrors = destinationAndDateFormSchemaParsed.error?.formErrors.fieldErrors;

    setDestinationAndDateFormErrors(formErrors);
    return formErrors;
  }

  function checkDestinationInputValid(e: ChangeEvent<HTMLInputElement>) {
    setDestination(e.target.value);
    validateDestinationAndDateFormSchema({ destination: e.target.value });
  }

  function checkStartsAndEndsAtInputsValid(startsAt: string, endsAt: string) {
    validateDestinationAndDateFormSchema({ startsAt, endsAt });
  }

  function handleGoToInviteGuestsStep() {
    setHasAttemptedSubmitForm(true);
    const formErrors = !!validateDestinationAndDateFormSchema({});

    if (!formErrors) {
      showGuestInput();
    }
  }

  return (
    <div>
      <div className="h-16 bg-zinc-900 rounded-xl px-4 flex items-center shadow-shape gap-5">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="size-5 text-zinc-400" />
          <input
            disabled={isGuestInputVisible}
            type="text"
            placeholder="Para onde você vai?"
            className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
            onChange={checkDestinationInputValid}
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
                <button type="button" onClick={() => closeDatePicker(false)}>
                  <X className="size-5 text-zinc-400" />
                </button>
              </div>
            </div>

            <DayPicker
              mode="range"
              selected={startAndEndDate}
              onSelect={setStartAndEndDate}
              classNames={{
                range_start: `${defaultClassNames.range_start} bg-gradient-to-r from-transparent from-50% to-lime-300 to-50%`,
                range_end: `${defaultClassNames.range_end} bg-gradient-to-l from-transparent from-50% to-lime-300 to-50%`,
                range_middle: `${defaultClassNames.range_middle} bg-lime-300 text-lime-950`,
                chevron: 'fill-lime-300',
                today: 'text-lime-300',
                day_button: `${defaultClassNames.day_button} disabled:cursor-not-allowed`,
              }}
              defaultMonth={eventStartAndEndDate?.from}
              disabled={{ before: new Date() }}
            />

            <Button
              variant="primary"
              className="ml-auto"
              onClick={handleSelectEventStartAndEndDate}
              disabled={!startAndEndDate
                || !startAndEndDate.from
                || !startAndEndDate.to}
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
          <Button onClick={handleGoToInviteGuestsStep} variant="primary">
            Continuar
            <ArrowRight className="size-5 text-lime-950" />
          </Button>
        )}
      </div>

      {!isGuestInputVisible && (
        <span className="flex h-5 mt-1 text-sm text-red-500">
          {
            (destinationAndDateFormErrors?.destination && hasAttemptedSubmitForm)
              && destinationAndDateFormErrors.destination[0]
          }
          {
            (destinationAndDateFormErrors?.destination
              && (destinationAndDateFormErrors?.startsAt || destinationAndDateFormErrors?.endsAt)
              && hasAttemptedSubmitForm
            )
            && ' e '
          }
          {
            ((destinationAndDateFormErrors?.startsAt ?? destinationAndDateFormErrors?.endsAt)
              && hasAttemptedSubmitForm
            )
            && (
              destinationAndDateFormErrors.startsAt![0]
              ?? destinationAndDateFormErrors.endsAt![0]
            )
          }
        </span>
      )}
    </div>
  );
}
