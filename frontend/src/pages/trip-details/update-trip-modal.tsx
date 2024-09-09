import { Calendar, MapPin, X } from 'lucide-react';
import { DateRange, DayPicker, getDefaultClassNames } from 'react-day-picker';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useParams, useRevalidator } from 'react-router-dom';
import { format, isBefore } from 'date-fns';
import { z } from 'zod';
import { Button } from '../../components/button';
import { Modal } from '../../components/modal';
import { api } from '../../lib/axios';
import { useAppDispatch } from '../../app/hooks';
import { getActivitiesThunk } from '../../features/acitivities/activitiesSlice';

interface Trip {
  destination: string
  id: string
  is_confirmed: boolean
  starts_at: string
  ends_at: string
}

interface UpdateTripModalProps {
  isOpen: boolean
  closeModal: () => void
  trip: Trip
}

const updateTripFormSchema = z.object({
  destination: z.string().trim().min(3, { message: 'Mínimo 3 caracteres' }),
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

type UpdateTripFormSchema = z.infer<typeof updateTripFormSchema>
type UpdateTripFormErrors = {
  [key in keyof UpdateTripFormSchema]?: string[]
}
type ValidateUpdateTripFormSchema = {
  [key in keyof UpdateTripFormSchema]?: string
}

export function UpdateTripModal({
  isOpen,
  closeModal,
  trip,
}: UpdateTripModalProps) {
  const dispatch = useAppDispatch();
  const revalidator = useRevalidator();
  const { tripId } = useParams();
  const [tripUpdated, setTripUpdated] = useState(trip);
  const [eventStartAndEndDate, setEventStartAndEndDate] = useState<DateRange | undefined>({
    from: new Date(trip.starts_at),
    to: new Date(trip.ends_at),
  });
  const [updateTripFormErrors, setUpdateTripFormErrors] = useState<
    UpdateTripFormErrors | undefined
  >(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [hasAttemptedSubmitForm, setHasAttemptedSubmitForm] = useState(false);
  const [isUpdateTripModalClosable, setIsUpdateTripModalClosable] = useState({
    maskClosable: true,
    closable: true,
    keyboard: true,
  });

  const defaultClassNames = getDefaultClassNames();
  const displayedDate = format(tripUpdated.starts_at, "d 'de' LLL")
    .concat(' até ')
    .concat(format(tripUpdated.ends_at, "d 'de' LLL"));

  function openDatePicker() {
    setIsDatePickerOpen(true);
    setIsUpdateTripModalClosable({ maskClosable: false, closable: false, keyboard: false });
  }

  function closeDatePicker(dateWasUpdated = true) {
    if (!dateWasUpdated) {
      setEventStartAndEndDate({
        from: new Date(tripUpdated.starts_at),
        to: new Date(tripUpdated.ends_at),
      });
    }

    setIsDatePickerOpen(false);
    setIsUpdateTripModalClosable({ maskClosable: true, closable: true, keyboard: true });
  }

  function handleSelectEventStartAndEndDate() {
    if (
      eventStartAndEndDate
    && eventStartAndEndDate.from
    && eventStartAndEndDate.to
    ) {
      setTripUpdated({
        ...tripUpdated,
        starts_at: eventStartAndEndDate.from.toString(),
        ends_at: eventStartAndEndDate.to.toString(),
      });

      checkStartsAndEndsAtInputsValid(
        eventStartAndEndDate.from.toString(),
        eventStartAndEndDate.to.toString(),
      );

      closeDatePicker();
    }
  }

  async function handleUpdateTrip(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasAttemptedSubmitForm(true);

    const formErrors = !!validateUpdateTripFormSchema({});

    if (!formErrors) {
      try {
        await api.put(`trips/${tripId}`, {
          destination: tripUpdated.destination,
          starts_at: tripUpdated.starts_at,
          ends_at: tripUpdated.ends_at,
        });

        revalidator.revalidate(); // Call getTrips
        if (tripId) await dispatch(getActivitiesThunk({ tripId })); // Call getActivities
      } catch (error) {
        console.log(error);
      } finally {
        closeModal();
      }
    }
  }

  function validateUpdateTripFormSchema({
    destination,
    startsAt,
    endsAt,
  }: ValidateUpdateTripFormSchema) {
    const updateTripFormSchemaParsed = updateTripFormSchema.safeParse({
      destination: destination ?? tripUpdated.destination,
      startsAt: startsAt ?? tripUpdated.starts_at,
      endsAt: endsAt ?? tripUpdated.ends_at,
    });

    const formErrors = updateTripFormSchemaParsed.error?.formErrors.fieldErrors;

    setUpdateTripFormErrors(formErrors);
    return formErrors;
  }

  function checkDestinationInputValid(e: ChangeEvent<HTMLInputElement>) {
    setTripUpdated({ ...tripUpdated, destination: e.target.value });
    validateUpdateTripFormSchema({ destination: e.target.value });
  }

  function checkStartsAndEndsAtInputsValid(startsAt: string, endsAt: string) {
    validateUpdateTripFormSchema({ startsAt, endsAt });
  }

  function resetUpdateTripForm() {
    setTripUpdated(trip);
    setEventStartAndEndDate({
      from: new Date(trip.starts_at),
      to: new Date(trip.ends_at),
    });
    setHasAttemptedSubmitForm(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      afterCloseModal={resetUpdateTripForm}
      closable={isUpdateTripModalClosable.closable}
      keyboard={isUpdateTripModalClosable.keyboard}
      maskClosable={isUpdateTripModalClosable.maskClosable}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Editar viagem</h2>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar o local e a data da viagem.
          </p>
        </div>

        <form onSubmit={handleUpdateTrip} className="space-y-3">
          <div>
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <MapPin className="size-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Para onde você vai?"
                className="w-full bg-transparent text-lg text-zinc-100 placeholder-zinc-400 outline-none"
                value={tripUpdated.destination}
                onChange={checkDestinationInputValid}
              />
            </div>

            <span className="block h-5 mb-2 mt-1 text-sm text-red-500">
              {(updateTripFormErrors?.destination && hasAttemptedSubmitForm)
              && updateTripFormErrors.destination[0]}
            </span>

            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <button
                type="button"
                className="flex items-center gap-2 text-lg text-zinc-400"
                onClick={openDatePicker}
              >
                <Calendar className="size-5" />
                <span>{displayedDate}</span>
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
                    selected={eventStartAndEndDate}
                    onSelect={setEventStartAndEndDate}
                    classNames={{
                      range_start: `${defaultClassNames.range_start} bg-gradient-to-r from-transparent from-50% to-lime-300 to-50%`,
                      range_end: `${defaultClassNames.range_end} bg-gradient-to-l from-transparent from-50% to-lime-300 to-50%`,
                      range_middle: `${defaultClassNames.range_middle} bg-lime-300 text-lime-950`,
                      chevron: 'fill-lime-300',
                      today: 'text-lime-300',
                    }}
                    defaultMonth={new Date(tripUpdated.starts_at)}
                  />

                  <Button
                    variant="primary"
                    className="ml-auto"
                    onClick={handleSelectEventStartAndEndDate}
                    disabled={!eventStartAndEndDate
                      || !eventStartAndEndDate.from
                      || !eventStartAndEndDate.to}
                  >
                    Ok
                  </Button>
                </div>
              </div>
              )}
            </div>

            <span className="block h-7 mb-2 mt-1 text-sm text-red-500">
              {
              ((updateTripFormErrors?.startsAt || updateTripFormErrors?.endsAt)
                && hasAttemptedSubmitForm
              )
              && (updateTripFormErrors.startsAt![0] ?? updateTripFormErrors.endsAt![0])
            }
            </span>
          </div>

          <Button type="submit" variant="primary" size="full" className="text-base">
            Salvar viagem
          </Button>
        </form>
      </div>
    </Modal>
  );
}
