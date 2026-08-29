import { type ReactNode, useState } from 'react'
import type { ChatViewModel } from '../types/AtendimentoChatTypes'
import { AtendimentoChatContext } from './AtendimentoChatContext'

type AtendimentoChatProviderProps = {
  children: ReactNode
}

export function AtendimentoChatProvider({ children }: AtendimentoChatProviderProps) {
  const [floatingChatAberto, setFloatingChatAberto] = useState(false)
  const [chatInicialSuspenso, setChatInicialSuspenso] = useState<ChatViewModel>()

  function abrirChatSuspenso(chat?: ChatViewModel) {
    setChatInicialSuspenso(chat)
    setFloatingChatAberto(true)
  }

  function fecharChatSuspenso() {
    setFloatingChatAberto(false)
  }

  return (
    <AtendimentoChatContext.Provider
      value={{
        floatingChatAberto,
        abrirChatSuspenso,
        fecharChatSuspenso,
        chatInicialSuspenso,
      }}
    >
      {children}
    </AtendimentoChatContext.Provider>
  )
}
