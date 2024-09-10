import { Plus, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Popconfirm } from 'antd';
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

  async function handleRemoveLink(link: Link) {
    try {
      await api.delete(`/links/${link.id}`);
      await getLinks();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getLinks();
  }, [getLinks]);

  return (
    <div className="space-y-6">
      <h2 className="text-center font-semibold text-xl md:text-left">Links importantes</h2>

      <div className="space-y-5 max-h-52 overflow-y-auto">
        {importantLinks.length > 0 ? (
          importantLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between gap-14">
              <div className="space-y-1.5">
                <span className="font-medium text-zinc-100 block truncate">
                  {link.title}
                </span>
                <a
                  href={link.url}
                  target="_blank"
                  className="text-xs text-zinc-400 block truncate hover:text-zinc-200"
                  rel="noreferrer"
                >
                  {link.url}
                </a>
              </div>

              <Popconfirm
                title="Remover link"
                description={(
                  <div>
                    Tem certeza que deseja remover o link
                    {' '}
                    <span className="font-medium">
                      {link.title}
                    </span>
                    ?
                  </div>
                )}
                okText="Sim"
                cancelText="Cancelar"
                onConfirm={() => handleRemoveLink(link)}
              >
                <Button variant="outline" className="p-0 shrink-0">
                  <Trash className="size-5 text-zinc-400" />
                </Button>
              </Popconfirm>
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
