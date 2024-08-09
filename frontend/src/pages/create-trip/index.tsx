import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { InviteGuestsModal } from './invite-guests-modal';
import { ConfirmTripModal } from './confirm-trip-modal';
import { DestinationAndDateStep } from './steps/destination-and-date-step';
import { InviteGuestsStep } from './steps/invite-guests-step';
import { api } from '../../lib/axios';

export function CreateTripPage() {
  const navigate = useNavigate();

  const [isGuestInputVisible, setIsGuestInputVisible] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

  const [destination, setDestination] = useState('');
  const [eventStartAndEndDate, setEventStartAndEndDate] = useState<DateRange | undefined>();
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  function showGuestInput() {
    setIsGuestInputVisible(true);
  }

  function hideGuestInput() {
    setIsGuestInputVisible(false);
  }

  function openGuestModal() {
    setIsGuestModalOpen(true);
  }

  function closeGuestModal() {
    setIsGuestModalOpen(false);
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  }

  function handleAddEmailToInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString();
    if (!email) return;

    if (emailsToInvite.includes(email)) return;

    setEmailsToInvite([...emailsToInvite, email]);
    e.currentTarget.reset();
  }

  function removeEmailFromInvites(emailToRemove: string) {
    setEmailsToInvite(emailsToInvite.filter((email) => email !== emailToRemove));
  }

  async function createTrip(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!destination) return;
    if (!eventStartAndEndDate || !eventStartAndEndDate.from || !eventStartAndEndDate.to) return;
    if (!ownerName || !ownerEmail) return;
    if (emailsToInvite.length === 0) return;

    try {
      setIsCreatingTrip(true);
      const response = await api.post<{tripId: string}>('/trips', {
        destination,
        starts_at: eventStartAndEndDate.from,
        ends_at: eventStartAndEndDate.to,
        owner_name: ownerName,
        owner_email: ownerEmail,
        emails_to_invite: emailsToInvite,
      });

      const { tripId } = response.data;

      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.log(error);
      setIsCreatingTrip(false);
    } finally {
      setIsCreatingTrip(false);
    }
  }

  return (
    <div className="h-screen flex justify-center items-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            isGuestInputVisible={isGuestInputVisible}
            showGuestInput={showGuestInput}
            hideGuestInput={hideGuestInput}
            setDestination={setDestination}
            eventStartAndEndDate={eventStartAndEndDate}
            setEventStartAndEndDate={setEventStartAndEndDate}
          />

          {isGuestInputVisible && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestModal={openGuestModal}
            />
          )}
        </div>

        <p className="text-zinc-500 text-sm">
          Ao planejar sua viagem pela plann.er você automaticamente concorda
          <br />
          com nossos
          {' '}
          <a className="text-zinc-300 underline" href="/">termos de uso</a>
          {' '}
          e
          {' '}
          <a className="text-zinc-300 underline" href="/">políticas de privacidade</a>
          .
        </p>
      </div>

      {isGuestModalOpen && (
        <InviteGuestsModal
          closeGuestModal={closeGuestModal}
          emailsToInvite={emailsToInvite}
          handleAddEmailToInvite={handleAddEmailToInvite}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          isCreatingTrip={isCreatingTrip}
        />
      )}
    </div>
  );
}
