import { Mail, User } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { z } from 'zod';
import { Button } from '../../components/button';
import { Modal } from '../../components/modal';

interface ConfirmTripModalProps {
  isOpen: boolean
  closeConfirmTripModal: () => void
  createTrip: () => void
  tripOwnerName: string
  tripOwnerEmail: string
  setOwnerName: (name: string) => void
  setOwnerEmail: (email: string) => void
  destination?: string
  startAndEndDate?: DateRange
  isCreatingTrip: boolean
}

const confirmTripCreationFormSchema = z.object({
  ownerName: z.string().min(1, { message: 'Informe o nome do organizador da viagem' }),
  ownerEmail: z.string().email({ message: 'Email inválido' }),
});

type ConfirmTripCreationFormSchema = z.infer<typeof confirmTripCreationFormSchema>
type ConfirmTripCreationFormErrors = {
  [key in keyof ConfirmTripCreationFormSchema]?: string[]
}
type ValidateConfirmTripCreationFormSchema = {
  [key in keyof ConfirmTripCreationFormSchema]?: string
}

export function ConfirmTripModal({
  isOpen,
  closeConfirmTripModal,
  createTrip,
  tripOwnerName,
  tripOwnerEmail,
  setOwnerName,
  setOwnerEmail,
  destination,
  startAndEndDate,
  isCreatingTrip,
}: ConfirmTripModalProps) {
  const [confirmTripCreationFormErrors, setConfirmTripCreationFormErrors] = useState<
    ConfirmTripCreationFormErrors | undefined
  >(undefined);
  const [hasAttemptedSubmitForm, setHasAttemptedSubmitForm] = useState(false);

  const displayedDate = startAndEndDate && startAndEndDate.from && startAndEndDate.to
    ? format(startAndEndDate.from, "d 'de' LLLL 'de' yyyy", {
      locale: ptBR,
    })
      .concat(' até ')
      .concat(format(startAndEndDate.to, "d 'de' LLLL 'de' yyyy", {
        locale: ptBR,
      }))
    : '-';

  function handleCreateTrip(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasAttemptedSubmitForm(true);

    const formErrors = !!validateConfirmTripCreationFormSchema({});

    if (!formErrors) {
      createTrip();
    }
  }

  function validateConfirmTripCreationFormSchema({
    ownerName,
    ownerEmail,
  }: ValidateConfirmTripCreationFormSchema) {
    const confirmTripCreationFormSchemaParsed = confirmTripCreationFormSchema.safeParse({
      ownerName: ownerName ?? tripOwnerName,
      ownerEmail: ownerEmail ?? tripOwnerEmail,
    });

    const formErrors = confirmTripCreationFormSchemaParsed.error?.formErrors.fieldErrors;

    setConfirmTripCreationFormErrors(formErrors);
    return formErrors;
  }

  function checkOwnerNameInputValid(e: ChangeEvent<HTMLInputElement>) {
    setOwnerName(e.target.value);
    validateConfirmTripCreationFormSchema({ ownerName: e.target.value });
  }

  function checkOwnerEmailInputValid(e: ChangeEvent<HTMLInputElement>) {
    setOwnerEmail(e.target.value);
    validateConfirmTripCreationFormSchema({ ownerEmail: e.target.value });
  }

  function resetConfirmTripCreationForm() {
    setHasAttemptedSubmitForm(false);
    setOwnerName('');
    setOwnerEmail('');
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeConfirmTripModal}
      afterCloseModal={resetConfirmTripCreationForm}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Confirmar criação da viagem</h2>

          <p className="text-sm text-zinc-400">
            Para concluir a criação da viagem para
            {' '}
            <span className="text-zinc-100 font-semibold">{destination || '-'}</span>
            {' '}
            nas datas de
            {' '}
            <span className="text-zinc-100 font-semibold">{displayedDate}</span>
            {' '}
            preencha seus dados abaixo:
          </p>
        </div>

        <form onSubmit={handleCreateTrip} className="space-y-3">
          <div className="space-y-2">
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-1.5 flex items-center gap-2.5 rounded-lg">
              <User className="size-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Seu nome completo"
                className="h-11 flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                value={tripOwnerName}
                onChange={checkOwnerNameInputValid}
              />
            </div>

            <span className="block h-5 mt-1 text-sm text-red-500">
              {
                (confirmTripCreationFormErrors?.ownerName && hasAttemptedSubmitForm)
                  && confirmTripCreationFormErrors?.ownerName[0]
              }
            </span>

            <div className="bg-zinc-950 border border-zinc-800 px-4 py-1.5 flex items-center gap-2.5 rounded-lg">
              <Mail className="size-5 text-zinc-400" />
              <input
                type="email"
                placeholder="Seu e-mail pessoal"
                className="h-11 flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                value={tripOwnerEmail}
                onChange={checkOwnerEmailInputValid}
              />
            </div>

            <span className="block h-5 mt-1 text-sm text-red-500">
              {
                (confirmTripCreationFormErrors?.ownerEmail && hasAttemptedSubmitForm)
                  && confirmTripCreationFormErrors?.ownerEmail[0]
              }
            </span>
          </div>

          <Button type="submit" variant="primary" size="full" disabled={isCreatingTrip}>
            Confirmar criação da viagem
          </Button>
        </form>
      </div>
    </Modal>
  );
}
