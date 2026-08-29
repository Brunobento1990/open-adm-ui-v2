import { Icon } from '@iconify/react'
import { Avatar, Box, IconButton, Skeleton, Stack, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useApiContato } from '../../../api/useApiContato'
import { ButtonApp, ButtonAppSize, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import {
  TextApp,
  TextAppColor,
  TextAppSize,
  TextAppWeight,
} from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import { ChatIcon, type ChatViewModel } from '../../../types/AtendimentoChatTypes'
import type { IContato } from '../../../types/ContatoTypes'
import { getChatName, getInitials } from './atendimentoChatUtils'
import { ModalContato } from './ModalContato'

type ContatoContextSidebarProps = {
  selectedChat?: ChatViewModel
  onClose?: () => void
}

type ContatoCarregado = {
  contato: IContato
  contatoId: string
}

const contatoContextIcon = {
  Mail: 'solar:letter-bold-duotone',
  User: 'solar:user-rounded-bold-duotone',
} as const

function getContatoNome(chat: ChatViewModel, contato?: IContato) {
  return contato?.nome || getChatName(chat)
}

function getContatoTelefone(chat: ChatViewModel, contato?: IContato) {
  return contato?.telefone || chat.contatoTelefone || chat.remoteJid
}

function getContatoEmail(chat: ChatViewModel, contato?: IContato) {
  return contato?.email || chat.contatoEmail
}

function formatarTelefone(telefone?: string) {
  const digitos = telefone?.replace(/\D/g, '')

  if (!digitos) return telefone

  if (digitos.length === 13 && digitos.startsWith('55')) {
    return `+${digitos.slice(0, 2)} (${digitos.slice(2, 4)}) ${digitos.slice(4, 9)}-${digitos.slice(9)}`
  }

  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`
  }

  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`
  }

  return telefone
}

function formatarCpf(cpf?: string | null) {
  const digitos = cpf?.replace(/\D/g, '')

  if (!digitos) return cpf

  if (digitos.length === 11) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`
  }

  return cpf
}

export function ContatoContextSidebar({ selectedChat, onClose }: ContatoContextSidebarProps) {
  const { backgroundColor, cores } = useThemeApp()
  const { obter } = useApiContato()
  const [contatoCarregado, setContatoCarregado] = useState<ContatoCarregado>()
  const [modalContatoAberto, setModalContatoAberto] = useState(false)
  const selectedContatoId = selectedChat?.contatoId
  const contatoAtual = contatoCarregado && contatoCarregado.contatoId === selectedContatoId
    ? contatoCarregado.contato
    : undefined
  const nomeContato = selectedChat ? getContatoNome(selectedChat, contatoAtual) : undefined
  const telefoneContato = selectedChat ? getContatoTelefone(selectedChat, contatoAtual) : undefined
  const telefoneContatoFormatado = formatarTelefone(telefoneContato)
  const emailContato = selectedChat ? getContatoEmail(selectedChat, contatoAtual) : undefined
  const cpfContatoFormatado = formatarCpf(contatoAtual?.cpf)

  useEffect(() => {
    if (!selectedContatoId) {
      return
    }

    async function buscarContatoAtualizado(contatoId: string) {
      const response = await obter.fetch(contatoId)

      if (response) {
        setContatoCarregado({
          contato: response,
          contatoId,
        })
      }
    }

    void buscarContatoAtualizado(selectedContatoId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContatoId])

  function atualizarContatoCarregado(contato: IContato) {
    if (!selectedContatoId) return

    setContatoCarregado({
      contato,
      contatoId: selectedContatoId,
    })
  }

  function renderizarDetalheContato(label: string, value: string | undefined | null, icon: string, loading?: boolean) {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          borderRadius: 1.5,
          minHeight: 38,
          minWidth: 0,
        }}
      >
        <Icon icon={icon} color={cores.text.secondary} fontSize={18} />
        <Box sx={{ minWidth: 0 }}>
          <TextApp color={TextAppColor.Secondary} fontSize="0.6875rem" noWrap>
            {label}
          </TextApp>
          <TextApp size={TextAppSize.Small} weight={TextAppWeight.SemiBold} noWrap>
            {loading ? <Skeleton width={128} /> : value ?? ''}
          </TextApp>
        </Box>
      </Stack>
    )
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: backgroundColor.card,
          borderLeft: `1px solid ${alpha(cores.text.secondary, 0.08)}`,
          display: { xs: 'none', xl: 'flex' },
          flexDirection: 'column',
          minHeight: 0,
          px: 2.25,
          py: 2.5,
        }}
      >
        {selectedChat ? (
          <Stack spacing={2.5} sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <TextApp fontSize="0.8125rem" weight={TextAppWeight.Bold}>
              Detalhes do contato
            </TextApp>
            <Tooltip title="Fechar detalhes do contato">
              <IconButton
                onClick={onClose}
                sx={{
                  borderRadius: 1.5,
                  color: cores.text.secondary,
                  height: 32,
                  transition: 'all 160ms ease',
                  width: 32,
                  '&:hover': {
                    bgcolor: alpha(cores.primary, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                <Icon icon={ChatIcon.Close} fontSize={18} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack spacing={1.25} sx={{ alignItems: 'center', minWidth: 0, textAlign: 'center' }}>
            <Avatar
              src={selectedChat.fotoUrl ?? undefined}
              alt={nomeContato}
              sx={{
                bgcolor: alpha(cores.primary, 0.1),
                color: cores.primary,
                fontSize: '1.25rem',
                fontWeight: 800,
                height: 72,
                width: 72,
              }}
            >
              {nomeContato ? getInitials(nomeContato) : undefined}
            </Avatar>

            <Box sx={{ minWidth: 0, width: '100%' }}>
              <TextApp fontSize="1rem" weight={TextAppWeight.Bold} noWrap>
                {obter.loading ? <Skeleton width="70%" sx={{ mx: 'auto' }} /> : nomeContato}
              </TextApp>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <TextApp color={TextAppColor.Secondary} fontSize="0.6875rem" weight={TextAppWeight.Bold}>
              CONTATO
            </TextApp>

            <Stack spacing={1.25}>
              {renderizarDetalheContato('Nome', nomeContato, contatoContextIcon.User, obter.loading)}
              {renderizarDetalheContato('CPF', cpfContatoFormatado, contatoContextIcon.User)}
              {renderizarDetalheContato('Telefone', telefoneContatoFormatado, ChatIcon.Phone, obter.loading)}
              {renderizarDetalheContato('E-mail', emailContato, contatoContextIcon.Mail)}
            </Stack>
          </Stack>

          {selectedContatoId && (
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <ButtonApp
                fullWidth
                size={ButtonAppSize.Small}
                startIcon={<Icon icon={ChatIcon.Edit} fontSize={16} />}
                variant={ButtonAppVariant.Outlined}
                onClick={() => setModalContatoAberto(true)}
              >
                Editar
              </ButtonApp>
            </Box>
          )}
          </Stack>
        ) : (
          <Stack spacing={1} sx={{ pt: 2 }}>
            <TextApp weight={TextAppWeight.Bold}>
              Detalhes do contato
            </TextApp>
            <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small}>
              Selecione uma conversa para ver os dados do contato.
            </TextApp>
          </Stack>
        )}
      </Box>

      <ModalContato
        contatoId={selectedContatoId ?? undefined}
        onClose={() => setModalContatoAberto(false)}
        onSaved={atualizarContatoCarregado}
        open={modalContatoAberto}
      />
    </>
  )
}
