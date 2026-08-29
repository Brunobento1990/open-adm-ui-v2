import { ApiMethod, useApi } from '../hook/useApi'
import type {
  ChatViewModel,
  EditarMensagemChatRequest,
  EnviarMensagemChatRequest,
  EnviarMensagemChatResponse,
  MensagemChatViewModel,
  PerfilWhatsAppViewModel,
} from '../types/AtendimentoChatTypes'
import { ApiRoutePath } from './apiRoutes'

const mensagemQueryParam = 'id'
const perfilWhatsAppUrl = '/perfil-whatsapp'

export function useApiChat() {
  const apiBuscar = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Chat,
    naoRenderizarResposta: true,
  })

  const apiBuscarMensagens = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Chat,
    naoRenderizarResposta: true,
  })

  const apiBuscarPerfilWhatsApp = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Chat,
    naoRenderizarResposta: true,
  })

  const apiEnviarMensagem = useApi({
    method: ApiMethod.Post,
    url: ApiRoutePath.Chat,
    naoRenderizarResposta: true,
  })

  const apiMarcarMensagensComoLidas = useApi({
    method: ApiMethod.Put,
    url: ApiRoutePath.Chat,
    naoRenderizarResposta: true,
  })

  const apiExcluirMensagem = useApi({
    method: ApiMethod.Delete,
    url: ApiRoutePath.Chat,
    naoRenderizarResposta: true,
  })

  const apiEditarMensagem = useApi({
    method: ApiMethod.Put,
    url: ApiRoutePath.Chat,
    naoRenderizarResposta: true,
  })

  async function buscar() {
    return apiBuscar.action<ChatViewModel[]>()
  }

  async function buscarMensagens(chatId: string) {
    return apiBuscarMensagens.action<MensagemChatViewModel[]>({
      urlParams: `/${encodeURIComponent(chatId)}/mensagens`,
    })
  }

  async function buscarPerfilWhatsApp() {
    return apiBuscarPerfilWhatsApp.action<PerfilWhatsAppViewModel>({
      urlParams: perfilWhatsAppUrl,
    })
  }

  async function enviarMensagem(chatId: string, values: EnviarMensagemChatRequest) {
    return apiEnviarMensagem.action<EnviarMensagemChatResponse>({
      body: values,
      urlParams: `/${encodeURIComponent(chatId)}/mensagens`,
    })
  }

  async function marcarMensagensComoLidas(chatId: string) {
    return apiMarcarMensagensComoLidas.action({
      urlParams: `/${encodeURIComponent(chatId)}/mensagens/lidas`,
    })
  }

  async function excluirMensagem(chatId: string, mensagemId: string) {
    const queryParams = new URLSearchParams({
      [mensagemQueryParam]: mensagemId,
    })

    return apiExcluirMensagem.action({
      urlParams: `/${encodeURIComponent(chatId)}/mensagens?${queryParams.toString()}`,
    })
  }

  async function editarMensagem(chatId: string, mensagemId: string, values: EditarMensagemChatRequest) {
    const queryParams = new URLSearchParams({
      [mensagemQueryParam]: mensagemId,
    })

    return apiEditarMensagem.action<EnviarMensagemChatResponse>({
      body: values,
      urlParams: `/${encodeURIComponent(chatId)}/mensagens?${queryParams.toString()}`,
    })
  }

  return {
    obterChats: {
      fetch: buscar,
      loading: apiBuscar.loading,
    },
    obterMensagens: {
      fetch: buscarMensagens,
      loading: apiBuscarMensagens.loading,
    },
    obterPerfilWhatsApp: {
      fetch: buscarPerfilWhatsApp,
      loading: apiBuscarPerfilWhatsApp.loading,
    },
    enviarMensagem: {
      fetch: enviarMensagem,
      loading: apiEnviarMensagem.loading,
    },
    marcarMensagensComoLidas: {
      fetch: marcarMensagensComoLidas,
      loading: apiMarcarMensagensComoLidas.loading,
    },
    excluirMensagem: {
      fetch: excluirMensagem,
      loading: apiExcluirMensagem.loading,
    },
    editarMensagem: {
      fetch: editarMensagem,
      loading: apiEditarMensagem.loading,
    },
  }
}
