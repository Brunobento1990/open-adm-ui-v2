import { Icon } from '@iconify/react'
import { Avatar, Box, Fade, IconButton, Slider, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useRef, useState } from 'react'
import { MenuApp, type MenuAppItem } from '../../../components/MenuApp/MenuApp'
import { TextApp, TextAppColor } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import {
  ChatIcon,
  DirecaoMensagemEnum,
  StatusMensagemEnum,
  TipoMensagemEnum,
  type ChatViewModel,
  type MensagemChatViewModel,
  type MensagemRespostaChatViewModel,
  type MidiaMensagemChatViewModel,
} from '../../../types/AtendimentoChatTypes'
import { getChatName, getInitials, getMensagemChatTime } from './atendimentoChatUtils'

type MensagemChatItemProps = {
  mensagem: MensagemChatViewModel
  chatSelecionado?: ChatViewModel
  destacada?: boolean
  iniciaGrupo?: boolean
  finalizaGrupo?: boolean
  onApagarMensagem?: (mensagem: MensagemChatViewModel) => void
  onEditarMensagem?: (mensagem: MensagemChatViewModel) => void
  onFocarMensagem?: (mensagemId: string) => void
  onResponderMensagem?: (mensagem: MensagemChatViewModel) => void
}

const imageContentTypePrefix = 'image/'
const audioContentTypePrefix = 'audio/'
const mensagemChatMenuId = 'mensagem-chat-menu'
const mensagemTextoUrlPattern = /((?:https?:\/\/|www\.)[^\s<>"']+)/gi
const remetenteMensagemEnviada = 'Voce'
const remetenteMensagemRecebida = 'Contato'

function isMidiaImagem(midia: MidiaMensagemChatViewModel) {
  return Boolean(midia.mimeType?.startsWith(imageContentTypePrefix) && getMidiaSrc(midia))
}

function isMidiaAudio(midia: MidiaMensagemChatViewModel) {
  return Boolean(midia.mimeType?.startsWith(audioContentTypePrefix) && getMidiaSrc(midia))
}

function getMidiaSrc(midia: MidiaMensagemChatViewModel) {
  if (midia.url) {
    return midia.url
  }

  if (midia.base64 && midia.mimeType) {
    return `data:${midia.mimeType};base64,${midia.base64}`
  }

  return undefined
}

function getConfiguracaoStatusMensagem(
  status: StatusMensagemEnum,
  corSecundaria: string,
  corSucesso: string,
  corErro: string,
) {
  switch (status) {
    case StatusMensagemEnum.Pendente:
      return {
        cor: corSecundaria,
        icone: ChatIcon.Clock,
      }
    case StatusMensagemEnum.Enviada:
      return {
        cor: corSecundaria,
        icone: ChatIcon.Check,
      }
    case StatusMensagemEnum.Entregue:
      return {
        cor: corSecundaria,
        icone: ChatIcon.CheckDouble,
      }
    case StatusMensagemEnum.Lida:
      return {
        cor: corSucesso,
        icone: ChatIcon.CheckDouble,
      }
    case StatusMensagemEnum.Erro:
      return {
        cor: corErro,
        icone: ChatIcon.Error,
      }
    default:
      return undefined
  }
}

function getAudioTime(segundos: number) {
  if (!Number.isFinite(segundos)) {
    return '0:00'
  }

  const minutos = Math.floor(segundos / 60)
  const segundosRestantes = Math.floor(segundos % 60).toString().padStart(2, '0')

  return `${minutos}:${segundosRestantes}`
}

function getMensagemRespostaPreview(resposta: MensagemRespostaChatViewModel) {
  if (resposta.texto?.trim()) {
    return resposta.texto.trim()
  }

  switch (resposta.tipo) {
    case TipoMensagemEnum.Audio:
      return 'Audio'
    case TipoMensagemEnum.Imagem:
      return 'Imagem'
    case TipoMensagemEnum.Video:
      return 'Video'
    case TipoMensagemEnum.Documento:
      return 'Documento'
    default:
      return 'Mensagem'
  }
}

function getMensagemRespostaRemetente(
  resposta: MensagemRespostaChatViewModel,
  nomeChatSelecionado?: string,
) {
  if (resposta.nomeRemetente) {
    return resposta.nomeRemetente
  }

  return resposta.direcao === DirecaoMensagemEnum.Enviada
    ? remetenteMensagemEnviada
    : nomeChatSelecionado ?? remetenteMensagemRecebida
}

function getMensagemUrlDestino(texto: string) {
  const destino = texto.startsWith('www.') ? `https://${texto}` : texto

  try {
    return new URL(destino).toString()
  } catch {
    return undefined
  }
}

type AudioMensagemChatProps = {
  src: string
}

function AudioMensagemChat({ src }: AudioMensagemChatProps) {
  const { cores } = useThemeApp()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [duracao, setDuracao] = useState(0)
  const [executando, setExecutando] = useState(false)
  const [tempoAtual, setTempoAtual] = useState(0)

  function alternarExecucao() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (executando) {
      audio.pause()
      return
    }

    void audio.play()
  }

  function alterarTempo(_: Event, value: number | number[]) {
    const audio = audioRef.current
    const proximoTempo = Array.isArray(value) ? value[0] : value

    if (!audio) {
      return
    }

    audio.currentTime = proximoTempo
    setTempoAtual(proximoTempo)
  }

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        bgcolor: alpha(cores.text.primary, 0.05),
        border: `1px solid ${alpha(cores.text.secondary, 0.14)}`,
        borderRadius: 8,
        gap: 1,
        minWidth: { xs: 230, sm: 300 },
        px: 1,
        py: 0.625,
      }}
    >
      <Box
        component="audio"
        ref={audioRef}
        src={src}
        preload="metadata"
        onEnded={() => setExecutando(false)}
        onLoadedMetadata={(event) => setDuracao(event.currentTarget.duration)}
        onPause={() => setExecutando(false)}
        onPlay={() => setExecutando(true)}
        onTimeUpdate={(event) => setTempoAtual(event.currentTarget.currentTime)}
        sx={{ display: 'none' }}
      />
      <IconButton
        type="button"
        onClick={alternarExecucao}
        sx={{
          bgcolor: alpha(cores.primary, 0.14),
          color: cores.primary,
          flex: '0 0 auto',
          height: 34,
          width: 34,
          '&:hover': {
            bgcolor: alpha(cores.primary, 0.2),
          },
        }}
      >
        <Icon icon={executando ? ChatIcon.Pause : ChatIcon.Play} fontSize={18} />
      </IconButton>
      <Box
        component="span"
        sx={{
          color: cores.text.primary,
          flex: '0 0 auto',
          fontSize: '0.8125rem',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          minWidth: 34,
        }}
      >
        {getAudioTime(tempoAtual)}
      </Box>
      <Slider
        min={0}
        max={duracao || 0}
        value={Math.min(tempoAtual, duracao || tempoAtual)}
        onChange={alterarTempo}
        size="small"
        sx={{
          color: cores.primary,
          flex: 1,
          minWidth: 80,
          '& .MuiSlider-rail': {
            opacity: 0.22,
          },
          '& .MuiSlider-thumb': {
            height: 12,
            width: 12,
          },
          '& .MuiSlider-track': {
            border: 'none',
          },
        }}
      />
      <Box
        component="span"
        sx={{
          color: cores.text.secondary,
          flex: '0 0 auto',
          fontSize: '0.75rem',
          fontVariantNumeric: 'tabular-nums',
          minWidth: 34,
          textAlign: 'right',
        }}
      >
        {getAudioTime(duracao)}
      </Box>
    </Stack>
  )
}

export function MensagemChatItem({
  chatSelecionado,
  destacada,
  finalizaGrupo,
  iniciaGrupo,
  mensagem,
  onApagarMensagem,
  onEditarMensagem,
  onFocarMensagem,
  onResponderMensagem,
}: MensagemChatItemProps) {
  const { backgroundColor, chat, cores } = useThemeApp()
  const nomeChatSelecionado = chatSelecionado ? getChatName(chatSelecionado) : undefined
  const iniciaisChatSelecionado = nomeChatSelecionado ? getInitials(nomeChatSelecionado) : undefined
  const mensagemEnviada = mensagem.direcao === DirecaoMensagemEnum.Enviada
  const mensagemExcluida = mensagem.status === StatusMensagemEnum.Excluida
  const corBalaoEnviado = chat.message.sent.background
  const corBalaoRecebido = backgroundColor.card
  const sombraMensagem = `0 4px 14px ${alpha(cores.text.primary, 0.04)}`
  const midiasVisiveis = mensagemExcluida ? [] : mensagem.midias
  const respostaMensagem = mensagemExcluida ? undefined : mensagem.mensagemResposta
  const textoMensagem = mensagem.texto?.trim()
  const configuracaoStatusMensagem = getConfiguracaoStatusMensagem(
    mensagem.status,
    'inherit',
    cores.success,
    cores.error,
  )
  const podeAbrirMenuMensagem = !mensagemExcluida
  const podeApagarMensagem = mensagemEnviada && !mensagemExcluida
  const podeEditarMensagem = mensagemEnviada && !mensagemExcluida && Boolean(textoMensagem)

  function apagarMensagem() {
    if (!podeApagarMensagem) {
      return
    }

    onApagarMensagem?.(mensagem)
  }

  function responderMensagem() {
    onResponderMensagem?.(mensagem)
  }

  function editarMensagem() {
    if (!podeEditarMensagem) {
      return
    }

    onEditarMensagem?.(mensagem)
  }

  function focarMensagemResposta() {
    if (respostaMensagem?.id) {
      onFocarMensagem?.(respostaMensagem.id)
    }
  }

  const menuItems: MenuAppItem[] = [
    {
      icon: ChatIcon.Reply,
      label: 'Responder',
      onClick: responderMensagem,
    },
  ]

  if (podeEditarMensagem) {
    menuItems.push({
      icon: ChatIcon.Edit,
      label: 'Editar',
      onClick: editarMensagem,
    })
  }

  if (podeApagarMensagem) {
    menuItems.push({
      icon: ChatIcon.Trash,
      iconColor: cores.error,
      label: 'Apagar',
      onClick: apagarMensagem,
    })
  }

  function focarMensagemRespostaPorTeclado(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    focarMensagemResposta()
  }

  function renderizarTextoMensagem(texto: string) {
    const partes = texto.split(mensagemTextoUrlPattern)

    return partes.map((parte, index) => {
      const urlDestino = getMensagemUrlDestino(parte)

      if (!urlDestino) {
        return parte
      }

      return (
        <Box
          key={`${urlDestino}-${index}`}
          component="a"
          href={urlDestino}
          rel="noreferrer"
          target="_blank"
          sx={{
            color: cores.primary,
            cursor: 'pointer',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: 2,
            overflowWrap: 'anywhere',
            '&:hover': {
              color: cores.primary,
              textDecorationThickness: 2,
            },
          }}
        >
          {parte}
        </Box>
      )
    })
  }

  return (
    <Fade in timeout={180}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'flex-end',
          justifyContent: mensagemEnviada ? 'flex-end' : 'flex-start',
          mb: finalizaGrupo ? 1.5 : 0.375,
        }}
      >
        {!mensagemEnviada && (
          <Box sx={{ width: 36, display: 'flex', justifyContent: 'center' }}>
            {finalizaGrupo && (
              <Avatar
                src={chatSelecionado?.fotoUrl ?? undefined}
                alt={nomeChatSelecionado}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {iniciaisChatSelecionado}
              </Avatar>
            )}
          </Box>
        )}

        <Box
          sx={{
            position: 'relative',
            maxWidth: { xs: '88%', sm: '76%', md: '64%' },
            minWidth: 96,
            width: midiasVisiveis.length > 0 ? 'fit-content' : undefined,
            pl: midiasVisiveis.length > 0 ? 0.5 : 1.25,
            pr: midiasVisiveis.length > 0 ? 0.5 : 3.25,
            py: midiasVisiveis.length > 0 ? 0.5 : 0.875,
            borderRadius: 2,
            borderTopLeftRadius: !mensagemEnviada && iniciaGrupo ? 0.75 : 2,
            borderTopRightRadius: mensagemEnviada && iniciaGrupo ? 0.75 : 2,
            bgcolor: mensagemEnviada ? corBalaoEnviado : corBalaoRecebido,
            border: `1px solid ${mensagemEnviada ? chat.message.sent.border : cores.dividerSoft}`,
            color: cores.text.primary,
            boxShadow: sombraMensagem,
            overflowWrap: 'anywhere',
            transition: 'transform 160ms ease, box-shadow 160ms ease, outline-color 160ms ease',
            fontStyle: mensagemExcluida ? 'italic' : 'normal',
            opacity: mensagemExcluida ? 0.72 : 1,
            outline: `2px solid ${destacada ? alpha(cores.primary, 0.72) : 'transparent'}`,
            outlineOffset: 2,
          }}
        >
          {podeAbrirMenuMensagem && (
            <MenuApp
              ariaLabel="Opcoes da mensagem"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              buttonColor="inherit"
              buttonHoverColor="inherit"
              buttonIcon={ChatIcon.MessageOptions}
              buttonSize="small"
              buttonSx={{
                position: 'absolute',
                right: 3,
                top: 3,
                zIndex: 1,
                width: 24,
                height: 24,
                opacity: 0.68,
                '&:hover': {
                  bgcolor: alpha(cores.text.primary, 0.08),
                  opacity: 1,
                  transform: 'none',
                },
              }}
              id={mensagemChatMenuId}
              itemFontSize="0.8125rem"
              itemMinHeight={32}
              itemPx={1.25}
              itemPy={0.5}
              items={menuItems}
              menuSx={{
                zIndex: 1500,
              }}
              paperMinWidth={144}
              tooltip="Opcoes da mensagem"
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            />
          )}
          {mensagemExcluida ? (
            <TextApp color={TextAppColor.Inherit}>
              Mensagem excluida
            </TextApp>
          ) : (
            <Stack spacing={1}>
              {respostaMensagem && (
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={focarMensagemResposta}
                  onKeyDown={focarMensagemRespostaPorTeclado}
                  sx={{
                    bgcolor: alpha(cores.text.primary, 0.06),
                    borderLeft: `3px solid ${cores.primary}`,
                    borderRadius: 1.25,
                    cursor: 'pointer',
                    maxWidth: '100%',
                    minWidth: midiasVisiveis.length > 0 ? { xs: 220, sm: 300 } : undefined,
                    px: 1,
                    py: 0.75,
                    '&:hover': {
                      bgcolor: alpha(cores.text.primary, 0.09),
                    },
                  }}
                >
                  <TextApp color={TextAppColor.Inherit} fontSize="0.75rem" fontWeight={700} noWrap>
                    {getMensagemRespostaRemetente(respostaMensagem, nomeChatSelecionado)}
                  </TextApp>
                  <TextApp color={TextAppColor.Secondary} fontSize="0.75rem" noWrap>
                    {getMensagemRespostaPreview(respostaMensagem)}
                  </TextApp>
                </Box>
              )}
              {midiasVisiveis.length > 0 && (
                <Stack spacing={0.75}>
                  {midiasVisiveis.map((midia) => {
                    if (isMidiaImagem(midia)) {
                      const midiaSrc = getMidiaSrc(midia)

                      return (
                        <Box
                          key={midia.id}
                          component="img"
                          src={midiaSrc}
                          alt={midia.nomeArquivo ?? 'Imagem da mensagem'}
                          sx={{
                            borderRadius: 1.5,
                            display: 'block',
                            maxHeight: 320,
                            maxWidth: '100%',
                            objectFit: 'cover',
                            width: { xs: 'min(320px, 100%)', sm: 360 },
                          }}
                        />
                      )
                    }

                    if (isMidiaAudio(midia)) {
                      const midiaSrc = getMidiaSrc(midia)

                      return (
                        <AudioMensagemChat key={midia.id} src={midiaSrc ?? ''} />
                      )
                    }

                    return (
                      <Box
                        key={midia.id}
                        sx={{
                          alignItems: 'center',
                          border: `1px solid ${alpha(cores.text.secondary, 0.18)}`,
                          borderRadius: 1.5,
                          display: 'flex',
                          gap: 1,
                          minWidth: 220,
                          px: 1.25,
                          py: 1,
                        }}
                      >
                        <Icon icon={ChatIcon.Media} fontSize={20} />
                        <TextApp color={TextAppColor.Inherit} fontSize="0.8125rem" noWrap>
                          {midia.nomeArquivo ?? 'Midia da mensagem'}
                        </TextApp>
                      </Box>
                    )
                  })}
                </Stack>
              )}

              {textoMensagem && (
                <Box sx={{ px: midiasVisiveis.length > 0 ? 0.75 : 0 }}>
                  <TextApp color={TextAppColor.Inherit} component="span">
                    {renderizarTextoMensagem(textoMensagem)}
                  </TextApp>
                </Box>
              )}
            </Stack>
          )}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              mt: 0.75,
              opacity: 0.66,
            }}
          >
            <TextApp color={TextAppColor.Inherit} fontSize="0.6875rem">
              {getMensagemChatTime(mensagem)}
            </TextApp>
            {mensagemEnviada && configuracaoStatusMensagem && (
              <Box
                component="span"
                sx={{
                  color: configuracaoStatusMensagem.cor,
                  display: 'inline-flex',
                  lineHeight: 0,
                }}
              >
                <Icon icon={configuracaoStatusMensagem.icone} fontSize={14} />
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Fade>
  )
}
