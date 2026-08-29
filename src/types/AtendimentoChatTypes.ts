export const ChatIcon = {
  Add: 'solar:add-circle-bold-duotone',
  ArrowDown: 'fe:arrow-down',
  Attach: 'solar:paperclip-bold-duotone',
  Check: 'heroicons:check',
  CheckDouble: 'line-md:check-all',
  Close: 'solar:close-circle-bold-duotone',
  Conversations: 'solar:chat-round-dots-bold-duotone',
  ContactDetails: 'solar:user-id-bold-duotone',
  Clock: 'solar:clock-circle-linear',
  Error: 'solar:danger-triangle-bold-duotone',
  Expand: 'solar:maximize-square-3-bold-duotone',
  Minimize: 'solar:minimize-square-3-bold-duotone',
  More: 'solar:menu-dots-bold',
  Media: 'solar:gallery-wide-bold-duotone',
  Mic: 'solar:microphone-3-bold-duotone',
  Pause: 'solar:pause-bold',
  Phone: 'solar:phone-bold-duotone',
  Play: 'solar:play-bold',
  MessageOptions: 'solar:alt-arrow-down-linear',
  Edit: 'solar:pen-bold-duotone',
  Reply: 'solar:reply-bold',
  Stop: 'solar:stop-circle-bold-duotone',
  Search: 'solar:magnifer-linear',
  Send: 'solar:plain-bold-duotone',
  Smile: 'solar:smile-circle-bold-duotone',
  Trash: 'solar:trash-bin-trash-bold-duotone',
  Video: 'solar:videocamera-record-bold-duotone',
} as const

export enum DirecaoMensagemEnum {
  Recebida = 1,
  Enviada = 2,
}

export enum TipoMensagemEnum {
  Texto = 1,
  Imagem = 2,
  Audio = 3,
  Video = 4,
  Documento = 5,
  Sticker = 6,
  Localizacao = 7,
  Contato = 8,
  Desconhecido = 99,
}

export enum StatusMensagemEnum {
  Pendente = 1,
  Enviada = 2,
  Entregue = 3,
  Lida = 4,
  Erro = 5,
  Excluida = 6,
}

export enum SidebarChatVariant {
  Page = 'page',
  Floating = 'floating',
}

export interface ChatViewModel {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao: string
  contatoId: string | null
  remoteJid: string
  nome: string | null
  fotoUrl: string | null
  ultimaMensagemPreview: string | null
  ultimaMensagemEm: string | null
  quantidadeMensagensNaoLidas: number
  contatoNome: string | null
  contatoTelefone: string | null
  contatoEmail: string | null
}

export interface PerfilWhatsAppViewModel {
  nome: string
  fotoUrl?: string
}

export interface MidiaMensagemChatViewModel {
  id: string
  base64: string | null
  dataDeCadastro: string
  dataDeAtualizacao: string | null
  url: string | null
  nomeArquivo: string | null
  mimeType: string | null
  tamanhoBytes: number | null
  duracaoSegundos: number | null
}

export interface MensagemChatViewModel {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao: string | null
  chatId: string
  evolutionMensagemId: string
  direcao: DirecaoMensagemEnum
  tipo: TipoMensagemEnum
  status: StatusMensagemEnum
  texto: string | null
  enviadaEm: string | null
  recebidaEm: string | null
  lidaEm: string | null
  editadaEm: string | null
  excluidaEm: string | null
  midias: MidiaMensagemChatViewModel[]
  mensagemResposta?: MensagemRespostaChatViewModel | null
}

export interface MensagemRespostaChatViewModel {
  id: string
  direcao: DirecaoMensagemEnum
  tipo: TipoMensagemEnum
  texto: string | null
  nomeRemetente?: string | null
}

export interface EnviarMensagemChatRequest {
  mensagem: string
  midia?: EnviarMensagemMidiaRequest
  MensagemRespostaId?: string
}

export interface EditarMensagemChatRequest {
  mensagem: string
}

export interface EnviarMensagemMidiaRequest {
  base64: string
  contentType: string
  nomeArquivo?: string
  tamanhoBytes?: number
}

export interface AtualizacaoChatMensagemResponse {
  id: string
  ultimaMensagemPreview: string | null
  ultimaMensagemEm: string | null
  quantidadeMensagensNaoLidas: number
  dataDeAtualizacao: string | null
}

export interface EnviarMensagemChatResponse {
  mensagem: MensagemChatViewModel
  chat: AtualizacaoChatMensagemResponse
}
