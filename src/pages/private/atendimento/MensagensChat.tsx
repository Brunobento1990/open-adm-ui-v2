import { Icon } from '@iconify/react'
import { Box, Fade, IconButton, Skeleton, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useLayoutEffect, useRef, useState } from 'react'
import {
  TextApp,
  TextAppColor,
  TextAppSize,
  TextAppWeight,
} from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import {
  ChatIcon,
  DirecaoMensagemEnum,
  type ChatViewModel,
  type MensagemChatViewModel,
} from '../../../types/AtendimentoChatTypes'
import { MensagemChatItem } from './MensagemChatItem'

type MensagensChatProps = {
  loading?: boolean
  mensagens: MensagemChatViewModel[]
  selectedChat?: ChatViewModel
  onApagarMensagem?: (mensagem: MensagemChatViewModel) => void
  onEditarMensagem?: (mensagem: MensagemChatViewModel) => void
  onResponderMensagem?: (mensagem: MensagemChatViewModel) => void
}

const messageSkeletonItems = [1, 2, 3, 4]
const scrollBottomThreshold = 48
const whatsappChatBackgroundUrl = '/whatsapp-chat-background.svg'

export function MensagensChat({
  loading,
  mensagens,
  onApagarMensagem,
  onEditarMensagem,
  onResponderMensagem,
  selectedChat,
}: MensagensChatProps) {
  const { backgroundColor, cores } = useThemeApp()
  const mensagensContainerRef = useRef<HTMLDivElement | null>(null)
  const mensagensRefs = useRef(new Map<string, HTMLDivElement>())
  const mensagensLengthAnteriorRef = useRef(0)
  const selectedChatIdAnteriorRef = useRef<string | undefined>(undefined)
  const timeoutDestaqueMensagemRef = useRef<number | undefined>(undefined)
  const [exibirBotaoFim, setExibirBotaoFim] = useState(false)
  const [mensagemDestacadaId, setMensagemDestacadaId] = useState<string>()
  const selectedChatId = selectedChat?.id

  function estaNoFimDoChat(container: HTMLDivElement) {
    return container.scrollHeight - container.scrollTop - container.clientHeight <= scrollBottomThreshold
  }

  function atualizarBotaoFim() {
    const container = mensagensContainerRef.current

    if (!container) {
      return
    }

    setExibirBotaoFim(!estaNoFimDoChat(container))
  }

  function scrollParaFim(behavior: ScrollBehavior = 'smooth') {
    const container = mensagensContainerRef.current

    if (!container) {
      return
    }

    if (behavior === 'auto') {
      container.scrollTop = container.scrollHeight
      setExibirBotaoFim(false)
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    })
    setExibirBotaoFim(false)
  }

  function registrarMensagemRef(mensagemId: string, element: HTMLDivElement | null) {
    if (!element) {
      mensagensRefs.current.delete(mensagemId)
      return
    }

    mensagensRefs.current.set(mensagemId, element)
  }

  function focarMensagem(mensagemId: string) {
    const mensagemElement = mensagensRefs.current.get(mensagemId)

    if (!mensagemElement) {
      return
    }

    mensagemElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    setMensagemDestacadaId(mensagemId)

    if (timeoutDestaqueMensagemRef.current !== undefined) {
      window.clearTimeout(timeoutDestaqueMensagemRef.current)
    }

    timeoutDestaqueMensagemRef.current = window.setTimeout(() => {
      setMensagemDestacadaId(undefined)
      timeoutDestaqueMensagemRef.current = undefined
    }, 2200)
  }

  useLayoutEffect(() => {
    if (loading) {
      return
    }

    const container = mensagensContainerRef.current
    const chatAlterado = selectedChatIdAnteriorRef.current !== selectedChatId
    const quantidadeMensagensAnterior = mensagensLengthAnteriorRef.current
    const mensagemAdicionada = mensagens.length > quantidadeMensagensAnterior
    const estavaNoFim = container ? estaNoFimDoChat(container) : true

    selectedChatIdAnteriorRef.current = selectedChatId
    mensagensLengthAnteriorRef.current = mensagens.length

    if (!chatAlterado && (!mensagemAdicionada || !estavaNoFim)) {
      setExibirBotaoFim(container ? !estaNoFimDoChat(container) : false)
      return
    }

    const scrollBehavior: ScrollBehavior = chatAlterado ? 'auto' : 'smooth'
    let segundoFrameId: number | undefined
    const primeiroFrameId = window.requestAnimationFrame(() => {
      scrollParaFim(scrollBehavior)
      segundoFrameId = window.requestAnimationFrame(() => scrollParaFim(scrollBehavior))
    })
    const timeoutId = window.setTimeout(() => scrollParaFim(scrollBehavior), 120)

    return () => {
      window.cancelAnimationFrame(primeiroFrameId)

      if (segundoFrameId !== undefined) {
        window.cancelAnimationFrame(segundoFrameId)
      }

      window.clearTimeout(timeoutId)
    }
  }, [loading, mensagens.length, selectedChatId])

  useLayoutEffect(() => {
    return () => {
      if (timeoutDestaqueMensagemRef.current !== undefined) {
        window.clearTimeout(timeoutDestaqueMensagemRef.current)
      }
    }
  }, [])

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        position: 'relative',
      }}
    >
      <Stack
        ref={mensagensContainerRef}
        onScroll={atualizarBotaoFim}
        sx={{
          height: '100%',
          minHeight: 0,
          overflow: 'auto',
          px: { xs: 1.25, sm: 2.25, lg: 3.5 },
          py: 1.25,
          backgroundColor: backgroundColor.default,
          backgroundImage: `url(${whatsappChatBackgroundUrl})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '412.5px 749.25px',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(cores.text.secondary, 0.2),
            borderRadius: 8,
          },
        }}
      >
        <Box
          sx={{
            alignSelf: 'center',
            px: 1.75,
            py: 0.5,
            borderRadius: 20,
            backgroundColor: backgroundColor.card,
            border: `1px solid ${cores.dividerSoft}`,
            mb: 1.5,
          }}
        >
          <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small}>
            Hoje
          </TextApp>
        </Box>

        {loading && messageSkeletonItems.map((item) => {
          const alignRight = item % 2 === 0

          return (
            <Stack
              key={item}
              direction="row"
              sx={{
                justifyContent: alignRight ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Skeleton
                variant="rounded"
                width={alignRight ? '46%' : '54%'}
                height={64}
                sx={{ borderRadius: 2 }}
              />
            </Stack>
          )
        })}

        {!loading && mensagens.length === 0 && (
          <Box
            sx={{
              alignSelf: 'center',
              maxWidth: 340,
              mt: 6,
              p: 2,
              borderRadius: 2,
              backgroundColor: backgroundColor.card,
              border: `1px solid ${cores.dividerSoft}`,
              textAlign: 'center',
            }}
          >
            <TextApp weight={TextAppWeight.SemiBold}>
              Nenhuma mensagem
            </TextApp>
            <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small}>
              A conversa selecionada ainda nao tem historico.
            </TextApp>
          </Box>
        )}

        {!loading && mensagens.map((message, index) => {
          const mensagemAnterior = mensagens[index - 1]
          const proximaMensagem = mensagens[index + 1]
          const mensagemEnviada = message.direcao === DirecaoMensagemEnum.Enviada
          const mensagemAnteriorEnviada = mensagemAnterior?.direcao === DirecaoMensagemEnum.Enviada
          const proximaMensagemEnviada = proximaMensagem?.direcao === DirecaoMensagemEnum.Enviada
          const iniciaGrupo = !mensagemAnterior || mensagemAnteriorEnviada !== mensagemEnviada
          const finalizaGrupo = !proximaMensagem || proximaMensagemEnviada !== mensagemEnviada

          return (
            <Box
              key={message.id}
              ref={(element: HTMLDivElement | null) => registrarMensagemRef(message.id, element)}
            >
              <MensagemChatItem
                chatSelecionado={selectedChat}
                destacada={mensagemDestacadaId === message.id}
                finalizaGrupo={finalizaGrupo}
                iniciaGrupo={iniciaGrupo}
                mensagem={message}
                onApagarMensagem={onApagarMensagem}
                onEditarMensagem={onEditarMensagem}
                onFocarMensagem={focarMensagem}
                onResponderMensagem={onResponderMensagem}
              />
            </Box>
          )
        })}

        <Box />
      </Stack>
      <Fade in={exibirBotaoFim}>
        <IconButton
          type="button"
          aria-label="Rolar para a ultima mensagem"
          onClick={() => scrollParaFim()}
          sx={{
            position: 'absolute',
            right: { xs: 12, sm: 20 },
            bottom: { xs: 12, sm: 18 },
            zIndex: 2,
            width: 44,
            height: 44,
            bgcolor: backgroundColor.card,
            border: `1px solid ${cores.dividerSoft}`,
            boxShadow: `0 10px 24px ${alpha(cores.text.primary, 0.18)}`,
            color: cores.text.primary,
            '&:hover': {
              bgcolor: backgroundColor.card,
              boxShadow: `0 14px 30px ${alpha(cores.text.primary, 0.22)}`,
            },
          }}
        >
          <Icon icon={ChatIcon.ArrowDown} fontSize={24} />
        </IconButton>
      </Fade>
    </Box>
  )
}
