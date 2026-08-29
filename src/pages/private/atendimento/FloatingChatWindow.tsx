import { Icon } from '@iconify/react'
import { Avatar, Box, Divider, IconButton, Portal, Stack, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Rnd, type Position } from 'react-rnd'
import { TextApp, TextAppColor, TextAppSize, TextAppWeight } from '../../../components/TextApp/TextApp'
import { useAtendimentoChat } from '../../../context/useAtendimentoChat'
import { useThemeApp } from '../../../hook/useThemeApp'
import { ChatIcon, SidebarChatVariant, type ChatViewModel } from '../../../types/AtendimentoChatTypes'
import { EnviarMensagemChat } from './EnviarMensagemChat'
import { HeaderChat } from './HeaderChat'
import { MensagensChat } from './MensagensChat'
import { SidebarChat } from './SidebarChat'
import { getChatName, getInitials } from './atendimentoChatUtils'
import { useAtendimentoChatController } from './useAtendimentoChatController'

const floatingChatDefaultPosition = {
  x: 96,
  y: 88,
} as const

const floatingChatDefaultSize = {
  width: 760,
  height: 620,
}

const floatingChatMinimizedSize = {
  width: 340,
  height: 56,
}

const floatingChatMinSize = {
  width: 340,
  height: 420,
} as const

type DragState = {
  pointerId: number
  startX: number
  startY: number
  windowX: number
  windowY: number
}

function getFloatingChatTitle(selectedChat?: ChatViewModel) {
  if (!selectedChat) {
    return 'Chat'
  }

  return getChatName(selectedChat)
}

export function FloatingChatWindow() {
  const {
    chatInicialSuspenso,
    fecharChatSuspenso,
    floatingChatAberto,
  } = useAtendimentoChat()
  const {
    atualizarChatMensagem,
    apagarMensagem,
    cancelarMensagemResposta,
    cancelarEdicaoMensagem,
    chats,
    mensagens,
    mensagemEdicao,
    mensagemResposta,
    obterChatsLoading,
    obterMensagensLoading,
    perfilWhatsApp,
    selectedChat,
    selecionarChat,
    editarMensagemLoading,
    iniciarEdicaoMensagem,
    responderMensagem,
    salvarEdicaoMensagem,
  } = useAtendimentoChatController({
    ativo: floatingChatAberto,
    chatInicial: chatInicialSuspenso,
  })
  const { backgroundColor, borderRadius, cores, isCelular, shadow } = useThemeApp()
  const [minimizado, setMinimizado] = useState(false)
  const [mostrarConversas, setMostrarConversas] = useState(false)
  const [position, setPosition] = useState<Position>(floatingChatDefaultPosition)
  const [size, setSize] = useState(floatingChatDefaultSize)
  const abriuChatSuspensoRef = useRef(false)
  const dragStateRef = useRef<DragState | null>(null)
  const bodyOverflowRef = useRef<string | undefined>(undefined)
  const titulo = getFloatingChatTitle(selectedChat)
  const exibirConversas = mostrarConversas || !selectedChat
  const tamanhoAtual = minimizado ? floatingChatMinimizedSize : size

  useEffect(() => {
    return () => {
      if (bodyOverflowRef.current !== undefined) {
        document.body.style.overflow = bodyOverflowRef.current
      }
    }
  }, [])

  useEffect(() => {
    if (!floatingChatAberto || abriuChatSuspensoRef.current) {
      return
    }

    abriuChatSuspensoRef.current = true
    setMostrarConversas(true)
  }, [floatingChatAberto])

  if (!floatingChatAberto) {
    return null
  }

  function selecionarChatSuspenso(chat: ChatViewModel) {
    selecionarChat(chat)
    setMostrarConversas(false)
    setMinimizado(false)
  }

  function limitarPosicao(nextPosition: Position) {
    const margem = isCelular ? 12 : 16
    const larguraJanela = typeof tamanhoAtual.width === 'number' ? tamanhoAtual.width : floatingChatMinSize.width
    const alturaJanela = typeof tamanhoAtual.height === 'number' ? tamanhoAtual.height : floatingChatMinSize.height
    const maxX = Math.max(margem, window.innerWidth - larguraJanela - margem)
    const maxY = Math.max(margem, window.innerHeight - alturaJanela - margem)

    return {
      x: Math.min(Math.max(nextPosition.x, margem), maxX),
      y: Math.min(Math.max(nextPosition.y, margem), maxY),
    }
  }

  function iniciarDrag(event: PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('button')) {
      return
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      windowX: position.x,
      windowY: position.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moverDrag(event: PointerEvent<HTMLElement>) {
    const dragState = dragStateRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    setPosition(limitarPosicao({
      x: dragState.windowX + event.clientX - dragState.startX,
      y: dragState.windowY + event.clientY - dragState.startY,
    }))
  }

  function finalizarDrag(event: PointerEvent<HTMLElement>) {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function bloquearScrollPagina() {
    bodyOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  function restaurarScrollPagina() {
    if (bodyOverflowRef.current !== undefined) {
      document.body.style.overflow = bodyOverflowRef.current
      bodyOverflowRef.current = undefined
    }
  }

  return (
    <Portal>
      <Rnd
        bounds="window"
        disableDragging
        enableResizing={!minimizado}
        minHeight={floatingChatMinSize.height}
        minWidth={floatingChatMinSize.width}
        position={position}
        size={tamanhoAtual}
        onResizeStart={bloquearScrollPagina}
        onResizeStop={(_, __, elementRef, ___, nextPosition) => {
          setSize({
            width: elementRef.offsetWidth,
            height: elementRef.offsetHeight,
          })
          setPosition(limitarPosicao(nextPosition))
          restaurarScrollPagina()
        }}
        resizeHandleStyles={{
          bottom: { touchAction: 'none' },
          bottomLeft: { touchAction: 'none' },
          bottomRight: { touchAction: 'none' },
          left: { touchAction: 'none' },
          right: { touchAction: 'none' },
          top: { touchAction: 'none' },
          topLeft: { touchAction: 'none' },
          topRight: { touchAction: 'none' },
        }}
        style={{
          display: 'flex',
          maxHeight: isCelular ? 'calc(100vh - 24px)' : 'calc(100vh - 32px)',
          maxWidth: isCelular ? 'calc(100vw - 24px)' : 'calc(100vw - 32px)',
          touchAction: 'none',
          zIndex: 1400,
        }}
      >
        <Box
          sx={{
            backgroundColor: backgroundColor.card,
            border: `1px solid ${cores.dividerSoft}`,
            borderRadius: borderRadius,
            boxShadow: shadow,
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            minHeight: 0,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <Stack
            direction="row"
            onPointerCancel={finalizarDrag}
            onPointerDown={iniciarDrag}
            onPointerMove={moverDrag}
            onPointerUp={finalizarDrag}
            sx={{
              alignItems: 'center',
              backgroundColor: alpha(backgroundColor.card, 0.96),
              cursor: 'move',
              flex: '0 0 auto',
              gap: 1,
              justifyContent: 'space-between',
              minHeight: 56,
              px: 1.25,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
              <Tooltip title="Conversas">
                <IconButton
                  onClick={() => {
                    setMostrarConversas((mostrarConversasAtual) => !mostrarConversasAtual)
                    setMinimizado(false)
                  }}
                  sx={{
                    borderRadius,
                    color: exibirConversas ? 'primary.main' : cores.text.secondary,
                    height: 36,
                    width: 36,
                    '&:hover': {
                      backgroundColor: alpha(cores.primary, 0.08),
                    },
                  }}
                >
                  <Icon icon={ChatIcon.Conversations} fontSize={19} />
                </IconButton>
              </Tooltip>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
                {!minimizado && (
                  <Avatar
                    src={perfilWhatsApp?.fotoUrl}
                    alt={perfilWhatsApp?.nome}
                    sx={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      height: 28,
                      width: 28,
                    }}
                  >
                    {perfilWhatsApp?.nome ? getInitials(perfilWhatsApp.nome) : undefined}
                  </Avatar>
                )}

                <Box sx={{ minWidth: 0 }}>
                  <TextApp weight={TextAppWeight.Bold} fontSize="0.875rem" noWrap>
                    {titulo}
                  </TextApp>
                  {!minimizado && (
                    <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small} noWrap>
                      {perfilWhatsApp?.nome ?? 'Perfil WhatsApp'}
                    </TextApp>
                  )}
                </Box>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
              <Tooltip title="Fechar">
                <IconButton
                  onClick={() => {
                    setMinimizado(false)
                    fecharChatSuspenso()
                  }}
                  sx={{
                    borderRadius,
                    height: 36,
                    width: 36,
                    '&:hover': {
                      backgroundColor: alpha(cores.error, 0.08),
                      color: cores.error,
                    },
                  }}
                >
                  <Icon icon={ChatIcon.Close} fontSize={18} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {!minimizado && (
            <>
              <Divider sx={{ borderColor: cores.dividerSoft }} />

              <Box
                sx={{
                  display: 'grid',
                  flex: 1,
                  gridTemplateColumns: exibirConversas ? 'minmax(0, 1fr)' : 'minmax(0, 1fr)',
                  minHeight: 0,
                }}
              >
                {exibirConversas ? (
                  <SidebarChat
                    chats={chats}
                    loading={obterChatsLoading}
                    perfilWhatsApp={perfilWhatsApp}
                    selectedChat={selectedChat}
                    variant={SidebarChatVariant.Floating}
                    onSelectChat={selecionarChatSuspenso}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 0,
                      minWidth: 0,
                    }}
                  >
                    <HeaderChat selectedChat={selectedChat} />
                    <MensagensChat
                      loading={obterMensagensLoading}
                      mensagens={mensagens}
                      onApagarMensagem={apagarMensagem}
                      onEditarMensagem={iniciarEdicaoMensagem}
                      onResponderMensagem={responderMensagem}
                      selectedChat={selectedChat}
                    />
                    <EnviarMensagemChat
                      chatId={selectedChat?.id}
                      chatSelecionado={selectedChat}
                      atualizarChatMensagem={atualizarChatMensagem}
                      editarMensagemLoading={editarMensagemLoading}
                      mensagemEdicao={mensagemEdicao}
                      mensagemResposta={mensagemResposta}
                      onCancelarEdicaoMensagem={cancelarEdicaoMensagem}
                      onCancelarMensagemResposta={cancelarMensagemResposta}
                      onSalvarEdicaoMensagem={salvarEdicaoMensagem}
                    />
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Rnd>
    </Portal>
  )
}
