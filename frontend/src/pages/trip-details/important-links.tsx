import { Link2, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';
import { CreateLinkModal } from './create-link-modal';

interface Link {
  id: string
  title: string
  url: string
  trip_id: string
}

export function ImportantLinks() {
  const { tripId } = useParams();
  const [importantLinks, setImportantLinks] = useState<Link[]>([]);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);

  function openCreateLinkModal() {
    setIsCreateLinkModalOpen(true);
  }

  function closeCreateLinkModal() {
    setIsCreateLinkModalOpen(false);
  }

  const getLinks = useCallback(async () => {
    const response = await api.get<{ links: Link[] }>(`/trips/${tripId}/link`);
    setImportantLinks(response.data.links);
  }, [tripId]);

  useEffect(() => {
    getLinks();
  }, [getLinks]);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>

      <div className="space-y-5 max-h-52 overflow-y-auto">
        {importantLinks.length > 0 ? (
          importantLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between gap-14">
              <div className="space-y-1.5">
                <span className="font-medium text-zinc-100">{link.title}</span>
                <a
                  href={link.url}
                  target="_blank"
                  className="text-xs text-zinc-400 block truncate hover:text-zinc-200"
                  rel="noreferrer"
                >
                  {link.url}
                </a>
              </div>
              <Link2 className="size-5 text-zinc-400 shrink-0" />
            </div>
          ))
        ) : (
          <span className="text-sm text-zinc-400">Nenhum link cadastrado :(</span>
        )}
      </div>

      <Button variant="secondary" size="full" onClick={openCreateLinkModal}>
        <Plus className="size-5" />
        Cadastrar novo link
      </Button>

      <CreateLinkModal
        isOpen={isCreateLinkModalOpen}
        closeModal={closeCreateLinkModal}
        getLinks={getLinks}
      />
    </div>
  );
}
