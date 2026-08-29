import type { ChatViewModel, MensagemChatViewModel } from '../../../types/AtendimentoChatTypes'

const chatTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const chatDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

function normalizarDataUtc(value: string) {
  const temTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value)

  return temTimezone ? value : `${value}Z`
}

function isMesmoDia(primeiraData: Date, segundaData: Date) {
  return primeiraData.getFullYear() === segundaData.getFullYear()
    && primeiraData.getMonth() === segundaData.getMonth()
    && primeiraData.getDate() === segundaData.getDate()
}

function subtrairDias(date: Date, dias: number) {
  const result = new Date(date)
  result.setDate(result.getDate() - dias)

  return result
}

export function getChatName(chat: ChatViewModel) {
  return chat.contatoNome ?? chat.nome ?? chat.remoteJid
}

export function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase()
}

export function getChatTime(value: string | null) {
  if (!value) return ''

  const date = new Date(normalizarDataUtc(value))

  if (Number.isNaN(date.getTime())) return ''

  const hoje = new Date()

  if (isMesmoDia(date, hoje)) {
    return chatTimeFormatter.format(date)
  }

  if (isMesmoDia(date, subtrairDias(hoje, 1))) {
    return 'Ontem'
  }

  return chatDateFormatter.format(date)
}

function getMensagemTime(value: string | null) {
  if (!value) return ''

  const date = new Date(normalizarDataUtc(value))

  if (Number.isNaN(date.getTime())) return ''

  return chatTimeFormatter.format(date)
}

export function getMensagemChatTime(message: MensagemChatViewModel) {
  return getMensagemTime(message.enviadaEm ?? message.recebidaEm ?? message.dataDeCadastro)
}
