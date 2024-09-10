import { Calendar, Tag } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { z } from 'zod';
import { format, isAfter } from 'date-fns';
import { isBefore } from 'date-fns/isBefore';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';
import { useAppDispatch } from '../../app/hooks';
import { getActivitiesThunk } from '../../features/acitivities/activitiesSlice';
import { Modal } from '../../components/modal';

interface Trip {
  destination: string
  id: string
  is_confirmed: boolean
  starts_at: string
  ends_at: string
}

interface CreateActivityModalProps {
  isOpen: boolean
  closeModal: () => void
}

export function CreateActivityModal({
  isOpen,
  closeModal,
}: CreateActivityModalProps) {
  const { trip } = useLoaderData() as { trip: Trip };
  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const [activityTitle, setActivityTitle] = useState('');
  const [activityOccursAt, setActivityOccursAt] = useState('');
  const [hasAttemptedSubmitForm, setHasAttemptedSubmitForm] = useState(false);

  const createActivityFormSchema = z.object({
    title: z.string().trim().min(3, { message: 'Mínimo 3 caracteres' }),
    occursAt: z.coerce.date({
      errorMap: ({ code }, { defaultError }) => ({
        message: code === 'invalid_date' ? 'Selecione uma data' : defaultError,
      }),
    }).refine((date) => {
      const dateFormatted = format(date, 'MM/dd/yyyy');
      const startsAtFormatted = format(trip.starts_at, 'MM/dd/yyyy');
      return !isBefore(dateFormatted, startsAtFormatted); // If false: returns error msg
    }, {
      message: 'A data escolhida é antes do início da viagem',
    }).refine((date) => {
      const dateFormatted = format(date, 'MM/dd/yyyy');
      const endsAtFormatted = format(trip.ends_at, 'MM/dd/yyyy');
      return !isAfter(dateFormatted, endsAtFormatted); // If false: returns error msg
    }, {
      message: 'A data escolhida é depois do término da viagem',
    }),
  });

  type CreateActivityFormSchema = z.infer<typeof createActivityFormSchema>
  type CreateActivityFormErrors = {
    [key in keyof CreateActivityFormSchema]?: string[]
  }
  type ValidateCreateActivityFormSchema = {
    [key in keyof CreateActivityFormSchema]?: string
  }

  const [createActivityFormErrors, setCreateActivityFormErrors] = useState<
    CreateActivityFormErrors | undefined
  >(undefined);

  function validateCreateActivityFormSchema(
    {
      title,
      occursAt,
    }: ValidateCreateActivityFormSchema,
  ) {
    const createActivityFormSchemaParsed = createActivityFormSchema.safeParse({
      title: title ?? activityTitle,
      occursAt: occursAt ?? activityOccursAt,
    });
    const formErrors = createActivityFormSchemaParsed.error?.formErrors.fieldErrors;

    setCreateActivityFormErrors(formErrors);
    return formErrors;
  }

  function resetCreateActivityFormFields() {
    setActivityTitle('');
    setActivityOccursAt('');
    setHasAttemptedSubmitForm(false);
  }

  async function handleCreateActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttemptedSubmitForm(true);

    const formHasErrors = !!validateCreateActivityFormSchema({});

    if (!formHasErrors) {
      try {
        await api.post(`/trips/${tripId}/activity`, {
          title: activityTitle,
          occurs_at: activityOccursAt,
        });

        if (tripId) await dispatch(getActivitiesThunk({ tripId }));
      } catch (error) {
        console.log(error);
      } finally {
        closeModal();
        resetCreateActivityFormFields();
      }
    }
  }

  function checkTitleInputValid(e: ChangeEvent<HTMLInputElement>) {
    setActivityTitle(e.target.value);
    validateCreateActivityFormSchema({ title: e.target.value });
  }

  function checkOccursAtInputValid(e: ChangeEvent<HTMLInputElement>) {
    setActivityOccursAt(e.target.value);
    validateCreateActivityFormSchema({ occursAt: e.target.value });
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Cadastrar atividade</h2>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form onSubmit={handleCreateActivity} className="space-y-3">
          <div>
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Tag className="size-5 text-zinc-400" />
              <input
                type="text"
                name="title"
                placeholder="Qual a atividade?"
                className="flex-1 h-5 bg-transparent text-lg text-zinc-100 placeholder-zinc-400 outline-none"
                value={activityTitle}
                onChange={checkTitleInputValid}
              />
            </div>

            <span className="block h-5 mb-2 mt-1 text-sm text-red-500">
              {(createActivityFormErrors?.title && hasAttemptedSubmitForm)
                && createActivityFormErrors.title[0]}
            </span>

            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Calendar className="size-5 text-zinc-400" />
              <input
                type={activityOccursAt ? 'datetime-local' : 'text'}
                name="occurs_at"
                placeholder="Data e horário da atividade"
                className="flex-1 h-5 bg-transparent text-lg text-zinc-100 placeholder-zinc-400 outline-none cursor-pointer"
                value={activityOccursAt}
                onChange={checkOccursAtInputValid}
                onFocus={(e) => {
                  e.target.type = 'datetime-local';
                  e.target.showPicker();
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = 'text';
                  }
                }}
              />
            </div>

            <span className="block h-5 mb-2 mt-1 text-sm text-red-500">
              {(createActivityFormErrors?.occursAt && hasAttemptedSubmitForm)
                && createActivityFormErrors.occursAt[0]}
            </span>
          </div>

          <Button type="submit" variant="primary" size="full" className="text-base">
            Salvar atividade
          </Button>
        </form>
      </div>
    </Modal>
  );
}
