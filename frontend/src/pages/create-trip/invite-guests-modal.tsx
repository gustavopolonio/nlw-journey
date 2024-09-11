import { AtSign, Plus, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { z } from 'zod';
import { Button } from '../../components/button';
import { Modal } from '../../components/modal';

function generateInviteGuestFormSchema(emailsToInvite: string[]) {
  return z.object({
    email: z.string().email({
      message: 'Email inválido',
    }).refine((email) => !emailsToInvite.includes(email), {
      message: 'Email já adicionado',
    }),
  });
}

type InviteGuestFormSchema = z.infer<ReturnType<typeof generateInviteGuestFormSchema>>

type InviteGuestFormErrors = {
  [key in keyof InviteGuestFormSchema]?: string[]
}

type ValidateInviteGuestFormSchema = {
  [key in keyof InviteGuestFormSchema]?: string
}

interface InviteGuestsModalProps {
  isOpen: boolean
  closeGuestModal: () => void
  emailsToInvite: string[]
  removeEmailFromInvites: (emailToRemove: string) => void
  addEmailToInvite: (email: string) => void
}

export function InviteGuestsModal({
  isOpen,
  closeGuestModal,
  emailsToInvite,
  addEmailToInvite,
  removeEmailFromInvites,
} : InviteGuestsModalProps) {
  const [guestEmail, setGuestEmail] = useState('');
  const [inviteGuestFormErrors, setInviteGuestFormErrors] = useState<
    InviteGuestFormErrors | undefined
  >(undefined);
  const [hasAttemptedSubmitForm, setHasAttemptedSubmitForm] = useState(false);

  const inviteGuestFormSchema = generateInviteGuestFormSchema(emailsToInvite);

  function validateInviteGuestFormSchema({
    email,
  }: ValidateInviteGuestFormSchema) {
    const inviteGuestFormSchemaParsed = inviteGuestFormSchema.safeParse({
      email: email ?? guestEmail,
    });

    const formErrors = inviteGuestFormSchemaParsed.error?.formErrors.fieldErrors;

    setInviteGuestFormErrors(formErrors);
    return formErrors;
  }

  function handleAddEmailToInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasAttemptedSubmitForm(true);

    const formErrors = !!validateInviteGuestFormSchema({});

    if (!formErrors) {
      addEmailToInvite(guestEmail);
      setGuestEmail('');
    }
  }

  function checkEmailInputValid(e: ChangeEvent<HTMLInputElement>) {
    setGuestEmail(e.target.value);
    validateInviteGuestFormSchema({ email: e.target.value });
  }

  function resetInviteGuestForm() {
    setHasAttemptedSubmitForm(false);
    setGuestEmail('');
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeGuestModal} afterCloseModal={resetInviteGuestForm}>
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Selecionar convidados</h2>

          <p className="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na viagem.
          </p>
        </div>

        {emailsToInvite.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {emailsToInvite.map((email) => (
              <button
                key={email}
                type="button"
                className="bg-zinc-800 rounded-md text-base flex items-center py-2.5 px-2.5 gap-2.5"
                onClick={() => removeEmailFromInvites(email)}
              >
                <span className="text-zinc-300">{email}</span>
                <X className="size-4 text-zinc-400" />
              </button>
            ))}
          </div>
        )}

        <div className="h-px bg-zinc-800" />

        <form onSubmit={handleAddEmailToInvite}>
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 p-2 gap-3 rounded-lg sm:items-center sm:gap-2.5 sm:flex-row">
            <div className="flex items-center gap-2 flex-1 pl-2">
              <AtSign className="size-5 text-zinc-400" />
              <input
                type="email"
                name="email"
                placeholder="Digite o e-mail do convidado?"
                className="h-11 flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                value={guestEmail}
                onChange={checkEmailInputValid}
              />
            </div>

            <Button type="submit" variant="primary" className="h-11">
              Convidar
              <Plus className="size-5" />
            </Button>
          </div>

          <span className="block mt-1 text-sm text-red-500 text-center sm:flex sm:h-5">
            {
              (inviteGuestFormErrors?.email && hasAttemptedSubmitForm)
                && inviteGuestFormErrors.email[0]
            }
          </span>
        </form>
      </div>
    </Modal>
  );
}
