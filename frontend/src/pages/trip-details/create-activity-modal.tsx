import { Calendar, Tag, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { z } from 'zod';
import { format, isAfter } from 'date-fns';
import { isBefore } from 'date-fns/isBefore';
import { Button } from '../../components/button';
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

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void
}

export function CreateActivityModal({
  closeCreateActivityModal,
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
        closeCreateActivityModal();
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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="w-[640px] py-5 px-6 bg-zinc-900 rounded-xl shadow-shape space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>
            <button type="button" onClick={closeCreateActivityModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form onSubmit={handleCreateActivity} className="space-y-3">
          <div className="">
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Tag className="size-5 text-zinc-400" />
              <input
                type="text"
                name="title"
                placeholder="Qual a atividade?"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
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
                type="datetime-local"
                name="occurs_at"
                placeholder="Data e horário da atividade"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                value={activityOccursAt}
                onChange={checkOccursAtInputValid}
              />
            </div>

            <span className="block h-5 mb-2 mt-1 text-sm text-red-500">
              {(createActivityFormErrors?.occursAt && hasAttemptedSubmitForm)
                && createActivityFormErrors.occursAt[0]}
            </span>
          </div>

          <Button type="submit" variant="primary" size="full">
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  );
}
