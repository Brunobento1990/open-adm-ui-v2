import { useContext } from 'react'
import { AtendimentoChatContext } from './AtendimentoChatContext'

export function useAtendimentoChat() {
  const context = useContext(AtendimentoChatContext)

  if (!context) {
    throw new Error('useAtendimentoChat deve ser usado dentro de AtendimentoChatProvider')
  }

  return context
}
