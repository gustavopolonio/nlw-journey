import { MapPin, Calendar, ArrowRight, UserRoundPlus, Settings2, X, AtSign, Plus } from 'lucide-react'
import { useState } from 'react'

export function App() {
  const [isGuestInputVisible, setIsGuestInputVisible] = useState(false)
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  function showGuestInput() {
    setIsGuestInputVisible(true)
  }

  function hideGuestInput() {
    setIsGuestInputVisible(false)
  }

  function openGuestModal() {
    setIsGuestModalOpen(true)
  }

  function closeGuestModal() {
    setIsGuestModalOpen(false)
  }

  function handleAddEmailToInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')?.toString()
    if (!email) return

    if (emailsToInvite.includes(email)) {
      return
    }
    
    setEmailsToInvite([...emailsToInvite, email])
    e.currentTarget.reset()
  }

  function removeEmailFromInvites(emailToRemove: string) {
    setEmailsToInvite(emailsToInvite.filter(email => email !== emailToRemove))
  }

  return (
    <div className="h-screen flex justify-center items-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className="space-y-4">
          <div className="h-16 bg-zinc-900 rounded-xl px-4 flex items-center shadow-shape gap-5">
            <div className="flex items-center gap-2 flex-1">
              <MapPin className="size-5 text-zinc-400" />
              <input disabled={isGuestInputVisible} type="text" placeholder="Para onde você vai?" className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none" />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-zinc-400" />
              <input disabled={isGuestInputVisible} type="text" placeholder="Quando?" className="max-w-24 bg-transparent text-lg placeholder-zinc-400 outline-none" />
            </div>

            <div className="w-px bg-zinc-800 h-6" />

            {isGuestInputVisible ? (
              <button onClick={hideGuestInput} className="bg-zinc-800 text-zinc-200 font-medium rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-zinc-700">
                Alterar local/data
                <Settings2 className="size-5" />
              </button>
            ) : (
              <button onClick={showGuestInput} className="bg-lime-300 text-lime-950 font-medium rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-lime-400">
                Continuar
                <ArrowRight className="size-5 text-lime-950" />
              </button>
            )}
          </div>

          {isGuestInputVisible && (
            <div className="h-16 bg-zinc-900 rounded-xl px-4 flex items-center shadow-shape gap-5">
              <button onClick={openGuestModal} className="flex items-center gap-2 flex-1">
                <UserRoundPlus className="size-5 text-zinc-400" />
                <span className="w-full bg-transparent text-lg text-zinc-400 text-left">Quem estará na viagem?</span>
              </button>
              
              <button className="bg-lime-300 text-lime-950 font-medium rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-lime-400">
                Confirmar viagem
                <ArrowRight className="size-5 text-lime-950" />
              </button>
            </div>
          )}
        </div>

        <p className="text-zinc-500 text-sm">
          Ao planejar sua viagem pela plann.er você automaticamente concorda 
          <br /> 
          com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="">políticas de privacidade</a>.
        </p>
      </div>

      {isGuestModalOpen && (
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

            <div className="flex flex-wrap gap-2">
              {emailsToInvite.map(email => (
                <div key={email} className="bg-zinc-800 rounded-md flex items-center py-1.5 px-2.5 gap-2.5">
                  <span className="text-zinc-300">{email}</span>
                  <button onClick={() => removeEmailFromInvites(email)} type="button">
                    <X className="size-4 text-zinc-400" />
                  </button>
                </div>
              ))}

            </div>

            <div className="h-px bg-zinc-800" />

            <form onSubmit={handleAddEmailToInvite} className="bg-zinc-950 border border-zinc-800 p-2 flex items-center gap-2.5 rounded-lg">
              <div className="flex items-center gap-2 flex-1 pl-2">
                <AtSign className="size-5 text-zinc-400" />
                <input 
                  type="email"
                  name="email"
                  placeholder="Digite o e-mail do convidado?" 
                  className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-lime-300 text-lime-950 font-medium rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-lime-400"
              >
                Convidar
                <Plus className="size-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
