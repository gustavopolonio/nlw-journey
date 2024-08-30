import { AtSign, Plus, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { z } from 'zod';
import { Button } from '../../components/button';

interface InviteGuestsModalProps {
  closeGuestModal: () => void
  emailsToInvite: string[]
  removeEmailFromInvites: (emailToRemove: string) => void
  addEmailToInvite: (email: string) => void
}

export function InviteGuestsModal({
  closeGuestModal,
  emailsToInvite,
  addEmailToInvite,
  removeEmailFromInvites,
} : InviteGuestsModalProps) {
  const inviteGuestFormSchema = z.object({
    email: z.string().email({
      message: 'Email inválido',
    }).refine((email) => !emailsToInvite.includes(email), {
      message: 'Email já adicionado',
    }),
  });

  type InviteGuestFormSchema = z.infer<typeof inviteGuestFormSchema>
  type InviteGuestFormErrors = {
    [key in keyof InviteGuestFormSchema]?: string[]
  }
  type ValidateInviteGuestFormSchema = {
    [key in keyof InviteGuestFormSchema]?: string
  }

  const [guestEmail, setGuestEmail] = useState('');
  const [inviteGuestFormErrors, setInviteGuestFormErrors] = useState<
    InviteGuestFormErrors | undefined
  >(undefined);
  const [hasAttemptedSubmitForm, setHasAttemptedSubmitForm] = useState(false);

  function handleAddEmailToInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasAttemptedSubmitForm(true);

    const formErrors = !!validateInviteGuestFormSchema({});

    if (!formErrors) {
      addEmailToInvite(guestEmail);
      setGuestEmail('');
    }
  }

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

  function checkEmailInputValid(e: ChangeEvent<HTMLInputElement>) {
    setGuestEmail(e.target.value);
    validateInviteGuestFormSchema({ email: e.target.value });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="w-[640px] py-5 px-6 bg-zinc-900 rounded-xl shadow-shape space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Selecionar convidados</h2>
            <button type="button" onClick={closeGuestModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na viagem.
          </p>
        </div>

        {emailsToInvite.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {emailsToInvite.map((email) => (
              <div key={email} className="bg-zinc-800 rounded-md flex items-center py-1.5 px-2.5 gap-2.5">
                <span className="text-zinc-300">{email}</span>
                <button onClick={() => removeEmailFromInvites(email)} type="button">
                  <X className="size-4 text-zinc-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-zinc-800" />

        <form onSubmit={handleAddEmailToInvite}>
          <div className="flex items-center bg-zinc-950 border border-zinc-800 p-2 gap-2.5 rounded-lg">
            <div className="flex items-center gap-2 flex-1 pl-2">
              <AtSign className="size-5 text-zinc-400" />
              <input
                type="email"
                name="email"
                placeholder="Digite o e-mail do convidado?"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                value={guestEmail}
                onChange={checkEmailInputValid}
              />
            </div>

            <Button type="submit" variant="primary">
              Convidar
              <Plus className="size-5" />
            </Button>
          </div>

          <span className="block h-5 mt-1 text-sm text-red-500">
            {
              (inviteGuestFormErrors?.email && hasAttemptedSubmitForm)
                && inviteGuestFormErrors.email[0]
            }
          </span>
        </form>
      </div>
    </div>
  );
}
