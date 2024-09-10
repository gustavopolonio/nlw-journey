import { Link2, Tag } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { z } from 'zod';
import { useParams } from 'react-router-dom';
import { Modal } from '../../components/modal';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';

interface CreateLinkModalProps {
  isOpen: boolean
  closeModal: () => void
  getLinks: () => Promise<void>
}

const createLinkFormSchema = z.object({
  title: z.string().trim().min(3, { message: 'Mínimo 3 caracteres' }),
  url: z.string().url({ message: 'URL inválida' }),
});

type CreateLinkFormSchema = z.infer<typeof createLinkFormSchema>
type CreateLinkFormErrors = {
  [key in keyof CreateLinkFormSchema]?: string[]
}
type ValidateCreateLinkFormSchema = {
  [key in keyof CreateLinkFormSchema]?: string
}

export function CreateLinkModal({
  isOpen,
  closeModal,
  getLinks,
}: CreateLinkModalProps) {
  const { tripId } = useParams();
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [hasAttemptedSubmitForm, setHasAttemptedSubmitForm] = useState(false);
  const [createLinkFormErrors, setCreateLinkFormErrors] = useState<
    CreateLinkFormErrors | undefined
  >(undefined);

  function resetCreateLinkFormFields() {
    setLinkTitle('');
    setLinkUrl('');
    setHasAttemptedSubmitForm(false);
  }

  function validateCreateLinkFormSchema({
    title,
    url,
  }: ValidateCreateLinkFormSchema) {
    const createLinkFormSchemaParsed = createLinkFormSchema.safeParse({
      title: title ?? linkTitle,
      url: url ?? linkUrl,
    });

    const formErrors = createLinkFormSchemaParsed.error?.formErrors.fieldErrors;

    setCreateLinkFormErrors(formErrors);
    return formErrors;
  }

  async function handleCreateLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasAttemptedSubmitForm(true);

    const formErrors = !!validateCreateLinkFormSchema({});

    if (!formErrors) {
      try {
        await api.post(`/trips/${tripId}/link`, {
          title: linkTitle,
          url: linkUrl,
        });

        await getLinks();
      } catch (error) {
        console.log(error);
      } finally {
        closeModal();
        resetCreateLinkFormFields();
      }
    }
  }

  function checkTitleInputValid(e: ChangeEvent<HTMLInputElement>) {
    setLinkTitle(e.target.value);
    validateCreateLinkFormSchema({ title: e.target.value });
  }

  function checkUrlInputValid(e: ChangeEvent<HTMLInputElement>) {
    setLinkUrl(e.target.value);
    validateCreateLinkFormSchema({ url: e.target.value });
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Cadastrar link</h2>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar os links importantes.
          </p>
        </div>

        <form onSubmit={handleCreateLink} className="space-y-3">
          <div>
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Tag className="size-5 text-zinc-400" />
              <input
                type="text"
                name="title"
                placeholder="Título do link"
                className="flex-1 h-5 bg-transparent text-lg text-zinc-100 placeholder-zinc-400 outline-none"
                value={linkTitle}
                onChange={checkTitleInputValid}
              />
            </div>

            <span className="block h-5 mb-2 mt-1 text-sm text-red-500">
              {(createLinkFormErrors?.title && hasAttemptedSubmitForm)
                && createLinkFormErrors.title[0]}
            </span>

            <div className="bg-zinc-950 border border-zinc-800 px-4 py-[18px] flex items-center gap-2.5 rounded-lg">
              <Link2 className="size-5 text-zinc-400" />
              <input
                type="test"
                name="occurs_at"
                placeholder="URL"
                className="flex-1 h-5 bg-transparent text-lg text-zinc-100 placeholder-zinc-400 outline-none"
                value={linkUrl}
                onChange={checkUrlInputValid}
              />
            </div>

            <span className="block h-5 mb-2 mt-1 text-sm text-red-500">
              {(createLinkFormErrors?.url && hasAttemptedSubmitForm)
                && createLinkFormErrors.url[0]}
            </span>
          </div>

          <Button type="submit" variant="primary" size="full" className="text-base">
            Salvar link
          </Button>
        </form>
      </div>
    </Modal>
  );
}
