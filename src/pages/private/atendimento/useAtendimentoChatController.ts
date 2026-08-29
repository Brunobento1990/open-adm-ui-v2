import { useEffect, useRef, useState } from 'react'
import { useApiChat } from '../../../api/useApiChat'
import { useApiConexaoWhatsApp } from '../../../api/useApiConexaoWhatsApp'
import { useSignalR } from '../../../hook/useSignalR'
import { DirecaoMensagemEnum, StatusMensagemEnum } from '../../../types/AtendimentoChatTypes'
import type {
  ChatViewModel,
  EnviarMensagemChatResponse,
  MensagemChatViewModel,
  PerfilWhatsAppViewModel,
} from '../../../types/AtendimentoChatTypes'
import { StatusConexaoWhatsAppEnum, type ConexaoWhatsAppResponse } from '../../../types/ConexaoWhatsAppTypes'

type UseAtendimentoChatControllerProps = {
  ativo?: boolean
  chatInicial?: ChatViewModel
}

const mensagemApagadaPreview = 'Mensagem apagada'

function atualizarMensagemAtual(
  mensagemAtual: MensagemChatViewModel,
  proximaMensagem: MensagemChatViewModel,
) {
  return {
    ...proximaMensagem,
    midias: proximaMensagem.midias?.length > 0
      ? proximaMensagem.midias
      : mensagemAtual.midias,
  }
}

export function useAtendimentoChatController({
  ativo = true,
  chatInicial,
}: UseAtendimentoChatControllerProps = {}) {
  const {
    editarMensagem,
    excluirMensagem,
    obterChats,
    obterMensagens,
    obterPerfilWhatsApp,
    marcarMensagensComoLidas,
  } = useApiChat()
  const { obter } = useApiConexaoWhatsApp()
  const [chats, setChats] = useState<ChatViewModel[]>([])
  const [conexaoWhatsApp, setConexaoWhatsApp] = useState<ConexaoWhatsAppResponse>()
  const [conexaoWhatsAppVerificada, setConexaoWhatsAppVerificada] = useState(false)
  const [mensagens, setMensagens] = useState<MensagemChatViewModel[]>([])
  const [mensagemEdicao, setMensagemEdicao] = useState<MensagemChatViewModel>()
  const [mensagemResposta, setMensagemResposta] = useState<MensagemChatViewModel>()
  const [perfilWhatsApp, setPerfilWhatsApp] = useState<PerfilWhatsAppViewModel>()
  const [selectedChat, setSelectedChat] = useState<ChatViewModel>()
  const selectedChatRef = useRef<ChatViewModel | undefined>(undefined)
  const carregandoChatsRef = useRef(false)
  const carregandoMensagensRef = useRef(false)
  const carregandoPerfilWhatsAppRef = useRef(false)
  const perfilWhatsAppCarregadoRef = useRef(false)

  useEffect(() => {
    selectedChatRef.current = selectedChat
  }, [selectedChat])

  useSignalR({
    ativo,
    updateQrcode: (body) => setConexaoWhatsApp(body),
    atualizacaoStatusConexaoWhatsApp: (atualizacao) => {
      const statusAtualizacao = atualizacao.status ?? StatusConexaoWhatsAppEnum.Desconectado

      setConexaoWhatsAppVerificada(true)
      setConexaoWhatsApp((conexaoAtual) => ({
        ...conexaoAtual,
        fotoPerfil: atualizacao.fotoPerfil,
        status: statusAtualizacao,
      } as ConexaoWhatsAppResponse))

      if (statusAtualizacao !== StatusConexaoWhatsAppEnum.Conectado) {
        perfilWhatsAppCarregadoRef.current = false
        setPerfilWhatsApp(undefined)
      }
    },
    atualizacaoMensagemWhatsApp: atualizarChatMensagem,
  })

  async function carregarMensagens(chatId: string) {
    if (carregandoMensagensRef.current) {
      return
    }

    carregandoMensagensRef.current = true
    const response = await obterMensagens.fetch(chatId)
    carregandoMensagensRef.current = false
    const mensagensResponse = response ?? []

    if (mensagensResponse.length > 0) {
      void marcarMensagensComoLidas.fetch(chatId)
      setChats((chatsAtuais) => chatsAtuais.map((chat) => {
        if (chat.id !== chatId) return chat

        return {
          ...chat,
          quantidadeMensagensNaoLidas: 0,
        }
      }))
      setSelectedChat((chatAtual) => {
        if (!chatAtual || chatAtual.id !== chatId) return chatAtual

        return {
          ...chatAtual,
          quantidadeMensagensNaoLidas: 0,
        }
      })
    }

    setMensagens(mensagensResponse)
  }

  async function carregarChats(selectedChatId?: string) {
    if (
      !conexaoWhatsAppVerificada ||
      conexaoWhatsApp?.status !== StatusConexaoWhatsAppEnum.Conectado ||
      carregandoChatsRef.current
    ) {
      return
    }

    if (!perfilWhatsAppCarregadoRef.current && !carregandoPerfilWhatsAppRef.current) {
      carregandoPerfilWhatsAppRef.current = true
      const perfilResponse = await obterPerfilWhatsApp.fetch()
      carregandoPerfilWhatsAppRef.current = false

      if (perfilResponse) {
        perfilWhatsAppCarregadoRef.current = true
        setPerfilWhatsApp(perfilResponse)
      }
    }

    carregandoChatsRef.current = true
    const response = await obterChats.fetch()
    carregandoChatsRef.current = false
    const chatsResponse = response ?? []
    const chatAtual = chatsResponse.find((chat) => chat.id === (selectedChatId ?? selectedChatRef.current?.id))

    setChats(chatsResponse)
    setSelectedChat(chatAtual)

    if (!chatAtual) {
      setMensagens([])
    }
  }

  function selecionarChat(chat: ChatViewModel) {
    if (chat.id === selectedChatRef.current?.id || carregandoMensagensRef.current) {
      return
    }

    setSelectedChat(chat)
    setMensagemEdicao(undefined)
    setMensagemResposta(undefined)
    selectedChatRef.current = chat
    void carregarMensagens(chat.id)
  }

  function atualizarChatMensagem(response: EnviarMensagemChatResponse) {
    const chatId = response.chat.id
    const mensagemChatId = response.mensagem.chatId ?? chatId
    const mensagemAtualizada = {
      ...response.mensagem,
      chatId: mensagemChatId,
      midias: response.mensagem.midias ?? [],
    }
    const mensagemDoChatSelecionado = mensagemChatId === selectedChatRef.current?.id
    const mensagemRecebida = response.mensagem.direcao === DirecaoMensagemEnum.Recebida
    const quantidadeMensagensNaoLidas = mensagemDoChatSelecionado
      ? 0
      : response.chat.quantidadeMensagensNaoLidas

    if (mensagemDoChatSelecionado) {
      if (mensagemRecebida) {
        void marcarMensagensComoLidas.fetch(chatId)
      }

      setMensagens((mensagensAtuais) => {
        const mensagemJaExiste = mensagensAtuais.some((mensagem) => mensagem.id === mensagemAtualizada.id)

        if (mensagemJaExiste) {
          return mensagensAtuais.map((mensagem) => {
            if (mensagem.id !== mensagemAtualizada.id) return mensagem

            return atualizarMensagemAtual(mensagem, mensagemAtualizada)
          })
        }

        return [...mensagensAtuais, mensagemAtualizada]
      })
    }

    setChats((chatsAtuais) => {
      const chatExiste = chatsAtuais.some((chat) => chat.id === chatId)

      if (!chatExiste) {
        void carregarChats(selectedChatRef.current?.id)
        return chatsAtuais
      }

      return chatsAtuais.map((chat) => {
        if (chat.id !== chatId) return chat

        return {
          ...chat,
          dataDeAtualizacao: response.chat.dataDeAtualizacao ?? chat.dataDeAtualizacao,
          ultimaMensagemPreview: response.chat.ultimaMensagemPreview,
          ultimaMensagemEm: response.chat.ultimaMensagemEm,
          quantidadeMensagensNaoLidas,
        }
      })
    })
    setSelectedChat((chatAtual) => {
      if (!chatAtual || chatAtual.id !== chatId) return chatAtual

      return {
        ...chatAtual,
        dataDeAtualizacao: response.chat.dataDeAtualizacao ?? chatAtual.dataDeAtualizacao,
        ultimaMensagemPreview: response.chat.ultimaMensagemPreview,
        ultimaMensagemEm: response.chat.ultimaMensagemEm,
        quantidadeMensagensNaoLidas,
      }
    })
  }

  async function apagarMensagem(mensagem: MensagemChatViewModel) {
    if (mensagem.direcao !== DirecaoMensagemEnum.Enviada || mensagem.status === StatusMensagemEnum.Excluida) {
      return
    }

    const mensagemEhUltimaDoChat = mensagens[mensagens.length - 1]?.id === mensagem.id

    await excluirMensagem.fetch(mensagem.chatId, mensagem.id)

    setMensagens((mensagensAtuais) => mensagensAtuais.map((mensagemAtual) => {
      if (mensagemAtual.id !== mensagem.id) return mensagemAtual

      return {
        ...mensagemAtual,
        status: StatusMensagemEnum.Excluida,
        texto: null,
        midias: [],
      }
    }))

    if (mensagemEhUltimaDoChat) {
      setChats((chatsAtuais) => chatsAtuais.map((chat) => {
        if (chat.id !== mensagem.chatId) return chat

        return {
          ...chat,
          ultimaMensagemPreview: mensagemApagadaPreview,
        }
      }))

      setSelectedChat((chatAtual) => {
        if (!chatAtual || chatAtual.id !== mensagem.chatId) return chatAtual

        return {
          ...chatAtual,
          ultimaMensagemPreview: mensagemApagadaPreview,
        }
      })
    }
  }

  function responderMensagem(mensagem: MensagemChatViewModel) {
    if (mensagem.status === StatusMensagemEnum.Excluida) {
      return
    }

    setMensagemEdicao(undefined)
    setMensagemResposta(mensagem)
  }

  function iniciarEdicaoMensagem(mensagem: MensagemChatViewModel) {
    if (
      mensagem.direcao !== DirecaoMensagemEnum.Enviada ||
      mensagem.status === StatusMensagemEnum.Excluida ||
      !mensagem.texto?.trim()
    ) {
      return
    }

    setMensagemResposta(undefined)
    setMensagemEdicao(mensagem)
  }

  async function salvarEdicaoMensagem(mensagem: MensagemChatViewModel, texto: string) {
    const textoMensagem = texto.trim()

    if (
      mensagem.direcao !== DirecaoMensagemEnum.Enviada ||
      mensagem.status === StatusMensagemEnum.Excluida ||
      !textoMensagem
    ) {
      return
    }

    const resultado = await editarMensagem.fetch(mensagem.chatId, mensagem.id, {
      mensagem: textoMensagem,
    })

    if (resultado) {
      atualizarChatMensagem(resultado)
    } else {
      setMensagens((mensagensAtuais) => mensagensAtuais.map((mensagemAtual) => {
        if (mensagemAtual.id !== mensagem.id) return mensagemAtual

        return {
          ...mensagemAtual,
          texto: textoMensagem,
          editadaEm: new Date().toISOString(),
        }
      }))
    }

    setMensagemEdicao(undefined)
  }

  useEffect(() => {
    if (ativo && chatInicial) {
      selecionarChat(chatInicial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo, chatInicial?.id])

  useEffect(() => {
    if (!ativo || conexaoWhatsAppVerificada) {
      return
    }

    const verificarConexao = async () => {
      const response = await obter.fetch()
      setConexaoWhatsApp(response)
      setConexaoWhatsAppVerificada(true)

      if (response?.status !== StatusConexaoWhatsAppEnum.Conectado) {
        perfilWhatsAppCarregadoRef.current = false
        setPerfilWhatsApp(undefined)
      }
    }

    void verificarConexao()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo, conexaoWhatsAppVerificada])

  useEffect(() => {
    if (!ativo) {
      return
    }

    void carregarChats(selectedChatRef.current?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo, conexaoWhatsApp?.status, conexaoWhatsAppVerificada])

  return {
    atualizarChatMensagem,
    apagarMensagem,
    carregarChats,
    carregarMensagens,
    chats,
    conexaoWhatsApp,
    fecharModalConexaoWhatsApp: () => {
      setConexaoWhatsApp((conexaoAtual) => {
        if (!conexaoAtual) return undefined

        return {
          ...conexaoAtual,
          base64: undefined,
        }
      })
    },
    mensagens,
    mensagemEdicao,
    mensagemResposta,
    modalConexaoWhatsAppAberto: Boolean(conexaoWhatsApp?.base64),
    obterChatsLoading: obterChats.loading,
    obterMensagensLoading: obterMensagens.loading,
    perfilWhatsApp,
    selectedChat,
    selecionarChat,
    cancelarEdicaoMensagem: () => setMensagemEdicao(undefined),
    cancelarMensagemResposta: () => setMensagemResposta(undefined),
    editarMensagemLoading: editarMensagem.loading,
    iniciarEdicaoMensagem,
    responderMensagem,
    salvarEdicaoMensagem,
  }
}
