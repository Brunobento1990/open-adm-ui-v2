import { Icon } from '@iconify/react'
import { Box, CircularProgress, IconButton, Stack, TextField, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import { useApiChat } from '../../../api/useApiChat'
import { TextApp, TextAppColor, TextAppSize, TextAppWeight } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import {
  ChatIcon,
  DirecaoMensagemEnum,
  TipoMensagemEnum,
  type ChatViewModel,
  type EnviarMensagemChatResponse,
  type EnviarMensagemMidiaRequest,
  type MensagemChatViewModel,
} from '../../../types/AtendimentoChatTypes'
import { getChatName } from './atendimentoChatUtils'

const tamanhoMaximoMensagemChat = 4000
const fileReaderResultSeparator = ','
const imageContentTypePrefix = 'image/'
const audioContentTypePrefix = 'audio/'
const acceptMidiaMensagem = 'image/*,audio/*'
const audioMimeTypeOptions = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
const audioArquivoPadrao = 'mensagem-audio.webm'
const audioContentTypePadrao = 'audio/webm'
const remetenteMensagemEnviada = 'Voce'
const remetenteMensagemRecebida = 'Contato'
const recordingWaveBars = [8, 14, 22, 16, 10, 26, 18, 12, 20, 15, 24, 11, 17, 9, 21, 13]

type MidiaSelecionada = EnviarMensagemMidiaRequest & {
  previewUrl: string
}

type EnviarMensagemChatProps = {
  chatId?: string
  chatSelecionado?: ChatViewModel
  atualizarChatMensagem: (response: EnviarMensagemChatResponse) => void
  editarMensagemLoading?: boolean
  mensagemEdicao?: MensagemChatViewModel
  mensagemResposta?: MensagemChatViewModel
  onCancelarEdicaoMensagem?: () => void
  onCancelarMensagemResposta?: () => void
  onSalvarEdicaoMensagem?: (mensagem: MensagemChatViewModel, texto: string) => Promise<void>
}

function getMensagemRespostaPreview(mensagem: MensagemChatViewModel) {
  if (mensagem.texto?.trim()) {
    return mensagem.texto.trim()
  }

  switch (mensagem.tipo) {
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

function getMensagemRespostaRemetente(mensagem: MensagemChatViewModel, chatSelecionado?: ChatViewModel) {
  return mensagem.direcao === DirecaoMensagemEnum.Enviada
    ? remetenteMensagemEnviada
    : chatSelecionado ? getChatName(chatSelecionado) : remetenteMensagemRecebida
}

export function EnviarMensagemChat({
  chatId,
  chatSelecionado,
  atualizarChatMensagem,
  editarMensagemLoading,
  mensagemEdicao,
  mensagemResposta,
  onCancelarEdicaoMensagem,
  onCancelarMensagemResposta,
  onSalvarEdicaoMensagem,
}: EnviarMensagemChatProps) {
  const { backgroundColor, borderRadius, cores } = useThemeApp()
  const { enviarMensagem } = useApiChat()
  const inputArquivoRef = useRef<HTMLInputElement | null>(null)
  const inputMensagemRef = useRef<HTMLInputElement | null>(null)
  const midiaPreviewUrlRef = useRef<string | undefined>(undefined)
  const componentMountedRef = useRef(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<BlobPart[]>([])
  const audioStreamRef = useRef<MediaStream | null>(null)
  const descartarAudioGravacaoRef = useRef(false)
  const [midia, setMidia] = useState<MidiaSelecionada>()
  const [mensagem, setMensagem] = useState('')
  const [gravandoAudio, setGravandoAudio] = useState(false)
  const [audioGravacaoPausada, setAudioGravacaoPausada] = useState(false)
  const [segundosGravacaoAudio, setSegundosGravacaoAudio] = useState(0)
  const editandoMensagem = Boolean(mensagemEdicao)
  const mensagemValida = mensagem.trim().length > 0
  const midiaValida = Boolean(midia)
  const enviandoMensagem = enviarMensagem.loading || Boolean(editarMensagemLoading)
  const desabilitarEnvio = !chatId || (!mensagemValida && !midiaValida) || enviandoMensagem || gravandoAudio
  const midiaSelecionadaAudio = Boolean(midia?.contentType.startsWith(audioContentTypePrefix))
  const midiaSelecionadaImagem = Boolean(midia?.contentType.startsWith(imageContentTypePrefix))

  function selecionarArquivo() {
    inputArquivoRef.current?.click()
  }

  function getTempoGravacaoAudio() {
    const minutos = Math.floor(segundosGravacaoAudio / 60).toString().padStart(2, '0')
    const segundos = (segundosGravacaoAudio % 60).toString().padStart(2, '0')

    return `${minutos}:${segundos}`
  }

  function encerrarAudioStream() {
    audioStreamRef.current?.getTracks().forEach((track) => track.stop())
    audioStreamRef.current = null
  }

  function revogarPreviewMidia() {
    if (midiaPreviewUrlRef.current) {
      URL.revokeObjectURL(midiaPreviewUrlRef.current)
      midiaPreviewUrlRef.current = undefined
    }
  }

  function removerMidia() {
    revogarPreviewMidia()

    setMidia(undefined)

    if (inputArquivoRef.current) {
      inputArquivoRef.current.value = ''
    }
  }

  function getArquivoBase64(result: string) {
    const [, base64] = result.split(fileReaderResultSeparator)

    return base64 ?? result
  }

  function lerMidiaRequest(arquivo: File): Promise<EnviarMensagemMidiaRequest> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onerror = () => reject(reader.error)
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          reject(new Error('Arquivo invalido'))
          return
        }

        resolve({
          base64: getArquivoBase64(reader.result),
          contentType: arquivo.type || audioContentTypePadrao,
          nomeArquivo: arquivo.name,
          tamanhoBytes: arquivo.size,
        })
      }

      reader.readAsDataURL(arquivo)
    })
  }

  async function carregarMidia(arquivo: File) {
    try {
      const midiaRequest = await lerMidiaRequest(arquivo)

      revogarPreviewMidia()
      const previewUrl = URL.createObjectURL(arquivo)
      midiaPreviewUrlRef.current = previewUrl

      setMidia({
        ...midiaRequest,
        previewUrl,
      })
    } catch {
      removerMidia()
    }
  }

  function getAudioMimeType() {
    return audioMimeTypeOptions.find((mimeType) => MediaRecorder.isTypeSupported(mimeType))
  }

  async function enviarAudioGravado(arquivo: File) {
    if (!chatId) {
      return
    }

    const midiaRequest = await lerMidiaRequest(arquivo)
    const resultado = await enviarMensagem.fetch(chatId, {
      mensagem: '',
      midia: midiaRequest,
      MensagemRespostaId: mensagemResposta?.id,
    })

    if (resultado) {
      setMensagem('')
      removerMidia()
      onCancelarMensagemResposta?.()
      atualizarChatMensagem(resultado)
      inputMensagemRef.current?.focus()
    }
  }

  async function iniciarGravacaoAudio() {
    if (
      !chatId ||
      enviarMensagem.loading ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      return
    }

    let stream: MediaStream

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setGravandoAudio(false)
      return
    }

    const mimeType = getAudioMimeType()
    const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    audioChunksRef.current = []
    audioStreamRef.current = stream
    mediaRecorderRef.current = mediaRecorder
    descartarAudioGravacaoRef.current = false

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const descartarAudio = descartarAudioGravacaoRef.current
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorder.mimeType || audioContentTypePadrao,
      })
      const audioFile = new File([audioBlob], audioArquivoPadrao, {
        type: audioBlob.type || audioContentTypePadrao,
      })

      if (componentMountedRef.current) {
        setGravandoAudio(false)
        setAudioGravacaoPausada(false)
        setSegundosGravacaoAudio(0)
      }

      mediaRecorderRef.current = null
      audioChunksRef.current = []
      descartarAudioGravacaoRef.current = false
      encerrarAudioStream()

      if (componentMountedRef.current && !descartarAudio && audioBlob.size > 0) {
        void enviarAudioGravado(audioFile)
      }
    }

    mediaRecorder.start()
    setSegundosGravacaoAudio(0)
    setAudioGravacaoPausada(false)
    setGravandoAudio(true)
  }

  function finalizarGravacaoAudio() {
    const mediaRecorder = mediaRecorderRef.current

    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      return
    }

    try {
      mediaRecorder.requestData()
    } catch {
      // Alguns navegadores nao permitem requestData no estado atual.
    }

    mediaRecorder.stop()
  }

  function descartarGravacaoAudio() {
    descartarAudioGravacaoRef.current = true

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      return
    }

    setGravandoAudio(false)
    setAudioGravacaoPausada(false)
    setSegundosGravacaoAudio(0)
    audioChunksRef.current = []
    encerrarAudioStream()
  }

  function alternarPausaGravacaoAudio() {
    const mediaRecorder = mediaRecorderRef.current

    if (!mediaRecorder) {
      return
    }

    if (mediaRecorder.state === 'recording' && typeof mediaRecorder.pause === 'function') {
      try {
        mediaRecorder.pause()
      } catch {
        return
      }

      setAudioGravacaoPausada(true)
      return
    }

    if (mediaRecorder.state === 'paused' && typeof mediaRecorder.resume === 'function') {
      try {
        mediaRecorder.resume()
      } catch {
        return
      }

      setAudioGravacaoPausada(false)
    }
  }

  async function enviar() {
    if (desabilitarEnvio) {
      return
    }

    if (mensagemEdicao) {
      await onSalvarEdicaoMensagem?.(mensagemEdicao, mensagem)
      setMensagem('')
      removerMidia()
      inputMensagemRef.current?.focus()
      return
    }

    const midiaRequest = midia ? {
      base64: midia.base64,
      contentType: midia.contentType,
      nomeArquivo: midia.nomeArquivo,
      tamanhoBytes: midia.tamanhoBytes,
    } : undefined
    const mensagemRequest = midiaSelecionadaAudio ? '' : mensagem

    const resultado = await enviarMensagem.fetch(chatId, {
      mensagem: mensagemRequest,
      midia: midiaRequest,
      MensagemRespostaId: mensagemResposta?.id,
    })

    if (resultado) {
      setMensagem('')
      removerMidia()
      onCancelarMensagemResposta?.()
      atualizarChatMensagem(resultado)
      inputMensagemRef.current?.focus()
    }
  }

  useEffect(() => {
    componentMountedRef.current = true

    return () => {
      componentMountedRef.current = false

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        descartarAudioGravacaoRef.current = true
        mediaRecorderRef.current.stop()
      }

      encerrarAudioStream()
      revogarPreviewMidia()
    }
  }, [])

  useEffect(() => {
    if (!gravandoAudio || audioGravacaoPausada) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setSegundosGravacaoAudio((segundosAtuais) => segundosAtuais + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [audioGravacaoPausada, gravandoAudio])

  useEffect(() => {
    if (mensagemResposta && !gravandoAudio) {
      inputMensagemRef.current?.focus()
    }
  }, [gravandoAudio, mensagemResposta])

  useEffect(() => {
    if (!mensagemEdicao) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      removerMidia()
      setMensagem(mensagemEdicao.texto ?? '')
      inputMensagemRef.current?.focus()
    })

    return () => window.clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensagemEdicao?.id])

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault()
        enviar()
      }}
      sx={{
        borderTop: `1px solid ${cores.dividerSoft}`,
        backgroundColor: backgroundColor.card,
        p: { xs: 0.875, sm: 1 },
      }}
    >
      <Box
        component="input"
        ref={inputArquivoRef}
        accept={acceptMidiaMensagem}
        type="file"
        onChange={(event) => {
          const arquivo = event.target.files?.[0]

          if (arquivo) {
            carregarMidia(arquivo)
          }
        }}
        sx={{ display: 'none' }}
      />
      {mensagemEdicao && !gravandoAudio && (
        <Box
          sx={{
            borderLeft: `3px solid ${cores.primary}`,
            bgcolor: alpha(cores.text.primary, 0.06),
            borderRadius: 1,
            mb: 0.75,
            px: 1.25,
            py: 0.75,
            position: 'relative',
          }}
        >
          <TextApp color={TextAppColor.Inherit} size={TextAppSize.Small} weight={TextAppWeight.Bold}>
            Editando mensagem
          </TextApp>
          <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small} noWrap>
            {mensagemEdicao.texto}
          </TextApp>
          <IconButton
            type="button"
            aria-label="Cancelar edicao"
            onClick={() => {
              setMensagem('')
              onCancelarEdicaoMensagem?.()
            }}
            size="small"
            sx={{
              color: cores.text.primary,
              height: 30,
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 30,
              '&:hover': {
                bgcolor: alpha(cores.text.primary, 0.08),
              },
            }}
          >
            <Icon icon={ChatIcon.Close} fontSize={18} />
          </IconButton>
        </Box>
      )}
      {mensagemResposta && !mensagemEdicao && !gravandoAudio && (
        <Box
          sx={{
            borderLeft: `3px solid ${cores.primary}`,
            bgcolor: alpha(cores.text.primary, 0.06),
            borderRadius: 1,
            mb: 0.75,
            px: 1.25,
            py: 0.75,
            position: 'relative',
          }}
        >
          <TextApp color={TextAppColor.Inherit} size={TextAppSize.Small} weight={TextAppWeight.Bold}>
            {getMensagemRespostaRemetente(mensagemResposta, chatSelecionado)}
          </TextApp>
          <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small} noWrap>
            {getMensagemRespostaPreview(mensagemResposta)}
          </TextApp>
          <IconButton
            type="button"
            aria-label="Cancelar resposta"
            onClick={onCancelarMensagemResposta}
            size="small"
            sx={{
              color: cores.text.primary,
              height: 30,
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 30,
              '&:hover': {
                bgcolor: alpha(cores.text.primary, 0.08),
              },
            }}
          >
            <Icon icon={ChatIcon.Close} fontSize={18} />
          </IconButton>
        </Box>
      )}
      {midia && (
        <Box
          sx={{
            mb: 1,
            position: 'relative',
            width: midiaSelecionadaAudio ? { xs: '100%', sm: 320 } : 128,
          }}
        >
          {midiaSelecionadaAudio ? (
            <Box
              component="audio"
              src={midia.previewUrl}
              controls
              sx={{
                borderRadius,
                display: 'block',
                maxWidth: '100%',
                width: 320,
              }}
            />
          ) : (
            <Box
              component="img"
              src={midia.previewUrl}
              alt={midia.nomeArquivo ?? 'Midia selecionada'}
              sx={{
                borderRadius,
                border: `1px solid ${cores.dividerSoft}`,
                display: 'block',
                height: 96,
                objectFit: midiaSelecionadaImagem ? 'cover' : 'contain',
                width: 128,
              }}
            />
          )}
          <Tooltip title="Remover midia">
            <IconButton
              onClick={removerMidia}
              sx={{
                bgcolor: backgroundColor.card,
                boxShadow: `0 8px 20px ${alpha(cores.text.primary, 0.14)}`,
                height: 26,
                position: 'absolute',
                right: -8,
                top: -8,
                width: 26,
                '&:hover': {
                  bgcolor: backgroundColor.card,
                  color: cores.error,
                },
              }}
            >
              <Icon icon={ChatIcon.Close} fontSize={16} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          minHeight: 42,
        }}
      >
        {!gravandoAudio && (
          <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
            <Tooltip title="Emoji">
              <IconButton
                type="button"
                sx={{
                  borderRadius,
                  color: 'text.secondary',
                  transition: 'all 160ms ease',
                  '&:hover': {
                    backgroundColor: alpha(cores.primary, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                <Icon icon={ChatIcon.Smile} fontSize={22} />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Anexar">
              <IconButton
                type="button"
                disabled
                sx={{
                  borderRadius,
                  color: 'text.secondary',
                  transition: 'all 160ms ease',
                  '&:hover': {
                    backgroundColor: alpha(cores.primary, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                <Icon icon={ChatIcon.Attach} fontSize={22} />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Imagem">
              <IconButton
                type="button"
                onClick={selecionarArquivo}
                disabled={!chatId || enviandoMensagem || editandoMensagem}
                sx={{
                  borderRadius,
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'inline-flex' },
                  transition: 'all 160ms ease',
                  '&:hover': {
                    backgroundColor: alpha(cores.primary, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                <Icon icon={ChatIcon.Media} fontSize={22} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gravar audio">
              <IconButton
                type="button"
                onClick={iniciarGravacaoAudio}
                disabled={!chatId || enviandoMensagem || gravandoAudio || editandoMensagem}
                sx={{
                  borderRadius,
                  color: 'text.secondary',
                  transition: 'all 160ms ease',
                  '&:hover': {
                    backgroundColor: alpha(cores.primary, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                <Icon icon={ChatIcon.Mic} fontSize={22} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}

        {gravandoAudio ? (
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              borderRadius: 5,
              bgcolor: alpha(cores.text.primary, 0.08),
              border: `1px solid ${alpha(cores.error, 0.34)}`,
              flex: 1,
              gap: { xs: 1, sm: 2 },
              minHeight: 48,
              minWidth: 0,
              px: { xs: 1.25, sm: 1.5 },
            }}
          >
            <Box
              component="span"
              sx={{
                bgcolor: cores.error,
                borderRadius: '50%',
                boxShadow: `0 0 0 0 ${alpha(cores.error, 0.42)}`,
                flex: '0 0 auto',
                height: 8,
                width: 8,
                animation: 'audioRecordingPulse 1.35s ease-out infinite',
                animationPlayState: audioGravacaoPausada ? 'paused' : 'running',
                '@keyframes audioRecordingPulse': {
                  '0%': {
                    boxShadow: `0 0 0 0 ${alpha(cores.error, 0.42)}`,
                  },
                  '70%': {
                    boxShadow: `0 0 0 8px ${alpha(cores.error, 0)}`,
                  },
                  '100%': {
                    boxShadow: `0 0 0 0 ${alpha(cores.error, 0)}`,
                  },
                },
              }}
            />
            <Box
              component="span"
              sx={{
                color: cores.text.primary,
                flex: '0 0 auto',
                fontSize: '0.9375rem',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {getTempoGravacaoAudio()}
            </Box>
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                flex: 1,
                gap: 0.375,
                height: 30,
                justifyContent: 'center',
                minWidth: 88,
                overflow: 'hidden',
              }}
            >
              {recordingWaveBars.map((height, index) => (
                <Box
                  key={`${height}-${index}`}
                  component="span"
                  sx={{
                    bgcolor: index % 5 === 0 ? alpha(cores.error, 0.8) : alpha(cores.text.secondary, 0.56),
                    borderRadius: 1,
                    flex: '0 0 auto',
                    height,
                    width: 3.5,
                    animation: 'audioRecordingWave 820ms ease-in-out infinite',
                    animationDelay: `${index * 42}ms`,
                    animationPlayState: audioGravacaoPausada ? 'paused' : 'running',
                    '@keyframes audioRecordingWave': {
                      '0%, 100%': {
                        transform: 'scaleY(0.48)',
                      },
                      '50%': {
                        transform: 'scaleY(1)',
                      },
                    },
                  }}
                />
              ))}
            </Stack>
            <Tooltip title="Excluir gravacao">
              <IconButton
                type="button"
                onClick={descartarGravacaoAudio}
                sx={{
                  color: alpha(cores.text.secondary, 0.82),
                  flex: '0 0 auto',
                  height: 36,
                  width: 36,
                  '&:hover': {
                    bgcolor: alpha(cores.error, 0.1),
                    color: cores.error,
                  },
                }}
              >
                <Icon icon={ChatIcon.Trash} fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title={audioGravacaoPausada ? 'Continuar gravacao' : 'Pausar gravacao'}>
              <IconButton
                type="button"
                onClick={alternarPausaGravacaoAudio}
                sx={{
                  bgcolor: alpha(cores.primary, 0.18),
                  color: cores.primary,
                  flex: '0 0 auto',
                  height: 38,
                  width: 38,
                  '&:hover': {
                    bgcolor: alpha(cores.primary, 0.24),
                  },
                }}
              >
                <Icon icon={audioGravacaoPausada ? ChatIcon.Play : ChatIcon.Pause} fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Finalizar gravacao">
              <IconButton
                type="button"
                onClick={finalizarGravacaoAudio}
                sx={{
                  bgcolor: alpha(cores.error, 0.16),
                  color: cores.error,
                  flex: '0 0 auto',
                  height: 38,
                  width: 38,
                  '&:hover': {
                    bgcolor: alpha(cores.error, 0.22),
                  },
                }}
              >
                <Icon icon={ChatIcon.Stop} fontSize={21} />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <TextField
            fullWidth
            placeholder="Escreva uma mensagem..."
            disabled={!chatId}
            value={mensagem}
            onChange={(event) => setMensagem(event.target.value)}
            slotProps={{
              htmlInput: {
                maxLength: tamanhoMaximoMensagemChat,
                ref: inputMensagemRef,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                alignItems: 'center',
                backgroundColor: backgroundColor.default,
                borderRadius: '999px !important',
                height: 42,
                minHeight: 42,
                overflow: 'hidden',
                p: '0 14px !important',
                transition: 'all 160ms ease',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '999px !important',
                  borderColor: cores.dividerSoft,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(cores.primary, 0.24),
                },
                '&.Mui-focused': {
                  backgroundColor: backgroundColor.card,
                  boxShadow: `0 0 0 3px ${alpha(cores.primary, 0.08)}`,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(cores.primary, 0.36),
                  },
                },
              },
              '& .MuiOutlinedInput-input': {
                py: '0 !important',
              },
              '& textarea': {
                lineHeight: 1.45,
              },
            }}
          />
        )}

        {!gravandoAudio && (
          <Tooltip title="Enviar">
            <IconButton
              type="submit"
              disabled={desabilitarEnvio}
              sx={{
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                flex: '0 0 auto',
                boxShadow: `0 10px 24px ${alpha(cores.primary, 0.22)}`,
                height: 40,
                width: 40,
                transition: 'all 160ms ease',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-1px)',
                  boxShadow: `0 14px 28px ${alpha(cores.primary, 0.28)}`,
                },
                '&.Mui-disabled': {
                  bgcolor: alpha(cores.text.secondary, 0.16),
                  color: alpha(cores.text.secondary, 0.42),
                  boxShadow: 'none',
                },
              }}
            >
              {enviandoMensagem ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Icon icon={ChatIcon.Send} fontSize={20} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  )
}
