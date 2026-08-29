import { createContext } from 'react'
import type { ChatViewModel } from '../types/AtendimentoChatTypes'

export type AtendimentoChatContextValue = {
  floatingChatAberto: boolean
  abrirChatSuspenso: (chat?: ChatViewModel) => void
  fecharChatSuspenso: () => void
  chatInicialSuspenso?: ChatViewModel
}

export const AtendimentoChatContext = createContext<AtendimentoChatContextValue | null>(null)
