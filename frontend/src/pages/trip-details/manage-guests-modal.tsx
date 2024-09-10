import { ChangeEvent, FormEvent, useState } from 'react';
import { AtSign, Plus, X } from 'lucide-react';
import { z } from 'zod';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Modal } from '../../components/modal';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';

interface ManageGuestsModalProps {
  isOpen: boolean
  closeModal: () => void
  getParticipants: () => Promise<void>
}

export function ManageGuestsModal({
  isOpen,
  closeModal,
  getParticipants,
}: ManageGuestsModalProps) {
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

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

  const { tripId } = useParams();
  const [guestEmail, setGuestEmail] = useState('');
  const [hasAttemptedSubmitForm, setHasAttemptedSubmitForm] = useState(false);
  const [inviteGuestsError, setInviteGuestsError] = useState({
    show: false,
    text: '',
  });
  const [isInvitingGuests, setIsInvitingGuests] = useState(false);
  const [inviteGuestFormErrors, setInviteGuestFormErrors] = useState<
    InviteGuestFormErrors| undefined
  >(undefined);
  const [isUpdateTripModalClosable, setIsUpdateTripModalClosable] = useState({
    maskClosable: true,
    closable: true,
    keyboard: true,
  });

  function removeEmailFromInvites(emailToRemove: string) {
    setEmailsToInvite(emailsToInvite.filter((email) => email !== emailToRemove));
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

  function handleAddEmailToInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasAttemptedSubmitForm(true);

    const formErrors = !!validateInviteGuestFormSchema({});

    if (!formErrors) {
      setEmailsToInvite([...emailsToInvite, guestEmail]);
      setGuestEmail('');
      setHasAttemptedSubmitForm(false);
      setInviteGuestsError({ ...inviteGuestsError, show: false });
    }
  }

  function checkEmailInputValid(e: ChangeEvent<HTMLInputElement>) {
    setGuestEmail(e.target.value);
    validateInviteGuestFormSchema({ email: e.target.value });
  }

  function resetInviteGuestForm() {
    setHasAttemptedSubmitForm(false);
    setGuestEmail('');
    setInviteGuestsError({ ...inviteGuestsError, show: false });
  }

  async function handleInviteGuests() {
    const hasEmailsToInvite = emailsToInvite.length !== 0;
    setInviteGuestsError({ show: !hasEmailsToInvite, text: 'Nenhum e-mail adicionado' });

    if (hasEmailsToInvite) {
      try {
        setIsInvitingGuests(true);
        setIsUpdateTripModalClosable({ maskClosable: false, closable: false, keyboard: false });

        await api.post(`/trips/${tripId}/invite`, {
          emails_to_invite: emailsToInvite,
        });
        closeModal();
        setEmailsToInvite([]);
        await getParticipants();
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError && error.response?.data.message === 'There is no new participant to invite') {
          setInviteGuestsError({
            show: true,
            text: emailsToInvite.length > 1
              ? 'Os e-mails adicionados já foram convidados'
              : 'O e-mail adicionado já foi convidado',
          });
        }
      } finally {
        setIsInvitingGuests(false);
        setIsUpdateTripModalClosable({ maskClosable: true, closable: true, keyboard: true });
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      afterCloseModal={resetInviteGuestForm}
      closable={isUpdateTripModalClosable.closable}
      keyboard={isUpdateTripModalClosable.keyboard}
      maskClosable={isUpdateTripModalClosable.maskClosable}
      footer={(
        <>
          <div className="flex justify-end gap-2">
            <Button variant="danger" onClick={closeModal} disabled={isInvitingGuests}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="w-48"
              onClick={handleInviteGuests}
              disabled={isInvitingGuests}
              loading={isInvitingGuests}
            >
              Adicionar convidados
            </Button>
          </div>
          {inviteGuestsError.show && (
            <span className="block h-5 mt-1 text-sm text-red-500">
              {inviteGuestsError.text}
            </span>
          )}
        </>
      )}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Adicionar novos convidados</h2>

          <p className="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na viagem.
          </p>
        </div>

        {emailsToInvite.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {emailsToInvite.map((email) => (
              <div
                key={email}
                className="bg-zinc-800 rounded-md flex items-center py-1.5 px-2.5 gap-2.5"
              >
                <span className="text-zinc-300">{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmailFromInvites(email)}
                  disabled={isInvitingGuests}
                  aria-label="Close"
                >
                  <X className="size-4 text-zinc-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-zinc-800" />

        <form onSubmit={handleAddEmailToInvite}>
          <div className="flex items-center bg-zinc-950 border border-zinc-800 p-2 gap-2.5 rounded-lg">
            <div className="flex items-center gap-1.5 flex-1 sm:pl-2 sm:gap-2">
              <AtSign className="size-5 text-zinc-400" />
              <input
                type="email"
                name="email"
                placeholder="E-mail do convidado"
                className="flex-1 text-base bg-transparent placeholder-zinc-400 outline-none sm:text-lg"
                disabled={isInvitingGuests}
                value={guestEmail}
                onChange={checkEmailInputValid}
              />
            </div>

            <Button type="submit" variant="primary" disabled={isInvitingGuests}>
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
    </Modal>
  );
}
