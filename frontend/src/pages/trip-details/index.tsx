import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateActivityModal } from './create-activity-modal';
import { ImportantLinks } from './important-links';
import { Guests } from './guests';
import { Activities } from './activities';
import { DestinationAndDateHeader } from './destination-and-date-header';
import { Button } from '../../components/button';

export function TripDetailsPage() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true);
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-5 pb-10 space-y-8 sm:py-10">
      <DestinationAndDateHeader />

      <main className="flex flex-col gap-16 xmd:flex-row xmd:px-6">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-3 items-center justify-between sm:flex-row xmd:flex-col lg:flex-row">
            <h2 className="text-3xl font-semibold">Atividades</h2>
            <Button size="full" className="sm:w-fit xmd:w-full lg:w-fit" onClick={openCreateActivityModal}>
              <Plus className="size-5" />
              Cadastrar atividade
            </Button>
          </div>

          <Activities />
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xmd:w-80 xmd:flex xmd:flex-col xmd:gap-0 xmd:space-y-6">
          <ImportantLinks />

          <div className="hidden h-px bg-zinc-800 xmd:block" />

          <Guests />
        </div>
      </main>

      <CreateActivityModal
        isOpen={isCreateActivityModalOpen}
        closeModal={closeCreateActivityModal}
      />
    </div>
  );
}
