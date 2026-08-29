import { Icon } from '@iconify/react'
import {
  Avatar,
  Badge,
  Box,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import { MenuApp, type MenuAppItem } from '../../../components/MenuApp/MenuApp'
import {
  TextApp,
  TextAppColor,
  TextAppSize,
  TextAppVariant,
  TextAppWeight,
} from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import {
  ChatIcon,
  SidebarChatVariant,
  type ChatViewModel,
  type PerfilWhatsAppViewModel,
} from '../../../types/AtendimentoChatTypes'
import type { ConexaoWhatsAppResponse } from '../../../types/ConexaoWhatsAppTypes'
import { getChatName, getChatTime, getInitials } from './atendimentoChatUtils'
import { ModalContato } from './ModalContato'

type SidebarChatProps = {
  chats: ChatViewModel[]
  loading?: boolean
  selectedChat?: ChatViewModel
  conexaoWhatsApp?: ConexaoWhatsAppResponse
  perfilWhatsApp?: PerfilWhatsAppViewModel
  onSelectChat?: (chat: ChatViewModel) => void
  variant?: SidebarChatVariant
}

const sidebarSkeletonItems = [1, 2, 3, 4, 5]
const sidebarChatMenuId = 'sidebar-chat-menu'
const ultimaMensagemPreviewToken = {
  Audio: '[Audio]',
  Deleted: '[Deleted]',
  Excluida: '[Excluida]',
  Image: '[Image]',
  Imagem: '[Imagem]',
  MensagemApagada: 'Mensagem apagada',
  MensagemExcluida: 'Mensagem excluida',
} as const

export function SidebarChat({
  chats,
  loading,
  perfilWhatsApp,
  selectedChat,
  onSelectChat,
  variant = SidebarChatVariant.Page,
}: SidebarChatProps) {
  const { backgroundColor, cores } = useThemeApp()
  const [modalContatoAberto, setModalContatoAberto] = useState(false)
  const floating = variant === SidebarChatVariant.Floating
  const sidebarChatMenuItems: MenuAppItem[] = [
    {
      icon: ChatIcon.Add,
      label: 'Nova conversa',
    },
    {
      icon: ChatIcon.ContactDetails,
      label: 'Novo contato',
      onClick: () => setModalContatoAberto(true),
    },
  ]

  function renderizarUltimaMensagemPreview(preview: string | null) {
    switch (preview) {
      case ultimaMensagemPreviewToken.Image:
      case ultimaMensagemPreviewToken.Imagem:
        return (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              display: 'inline-flex',
              gap: 0.5,
              minWidth: 0,
            }}
          >
            <Icon icon={ChatIcon.Media} fontSize={15} />
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Imagem
            </Box>
          </Box>
        )
      case ultimaMensagemPreviewToken.Audio:
        return (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              display: 'inline-flex',
              gap: 0.5,
              minWidth: 0,
            }}
          >
            <Icon icon={ChatIcon.Mic} fontSize={15} />
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Audio
            </Box>
          </Box>
        )
      case ultimaMensagemPreviewToken.Deleted:
      case ultimaMensagemPreviewToken.Excluida:
      case ultimaMensagemPreviewToken.MensagemApagada:
      case ultimaMensagemPreviewToken.MensagemExcluida:
        return (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              display: 'inline-flex',
              gap: 0.5,
              minWidth: 0,
            }}
          >
            <Icon icon={ChatIcon.Trash} fontSize={15} />
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Mensagem apagada
            </Box>
          </Box>
        )
      default:
        return preview ?? ''
    }
  }

  return (
    <>
      <Box
        sx={{
          borderRight: floating ? 'none' : { xs: 'none', lg: `1px solid ${alpha(cores.text.secondary, 0.08)}` },
          display: floating ? 'flex' : { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          minHeight: 0,
          backgroundColor: backgroundColor.card,
          height: floating ? '100%' : undefined,
        }}
      >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: floating ? 52 : 60,
          px: floating ? 1.25 : 1.5,
          py: floating ? 1 : 1.25,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
          {!floating && (
            <Avatar
              src={perfilWhatsApp?.fotoUrl}
              alt={perfilWhatsApp?.nome}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                height: 34,
                width: 34,
              }}
            >
              {perfilWhatsApp?.nome ? getInitials(perfilWhatsApp.nome) : undefined}
            </Avatar>
          )}

          <Box sx={{ minWidth: 0 }}>
            <TextApp
              variant={TextAppVariant.Subtitle}
              fontSize={floating ? '0.9375rem' : '1rem'}
              weight={TextAppWeight.Bold}
              noWrap
            >
              Conversas
            </TextApp>
            {!floating && (
              <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small} noWrap>
                {perfilWhatsApp?.nome ?? 'Perfil WhatsApp'}
              </TextApp>
            )}
          </Box>
        </Stack>

        {!floating && (
          <MenuApp
            ariaLabel="Abrir opcoes de conversas"
            buttonIcon={ChatIcon.More}
            buttonSx={{
              borderRadius: 1.75,
              height: 34,
              width: 34,
            }}
            iconFontSize={16}
            id={sidebarChatMenuId}
            items={sidebarChatMenuItems}
            paperMinWidth={168}
            tooltip="Opcoes"
          />
        )}
      </Stack>

      <Box sx={{ px: floating ? 1.25 : 1.5, pb: 1.25 }}>
        <TextField
          fullWidth
          placeholder="Pesquisar conversas"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: cores.text.secondary, mr: 0.75 }}>
                  <Icon icon={ChatIcon.Search} fontSize={15} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: backgroundColor.default,
              borderRadius: '999px !important',
              p: '0 12px !important',
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
          }}
        />
      </Box>

      <List
        disablePadding
        sx={{
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: floating ? 0.5 : 0.75,
          pb: 0.75,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(cores.text.secondary, 0.2),
            borderRadius: 8,
          },
        }}
      >
        {loading && sidebarSkeletonItems.map((item) => (
          <Stack
            key={item}
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', px: 0.75, py: 1 }}
          >
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="58%" />
              <Skeleton width="82%" />
            </Box>
          </Stack>
        ))}

        {!loading && chats.length === 0 && (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <TextApp weight={TextAppWeight.SemiBold}>
              Nenhuma conversa
            </TextApp>
            <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small}>
              Novos atendimentos aparecerao aqui.
            </TextApp>
          </Box>
        )}

        {!loading && chats.map((chat) => {
          const selected = chat.id === selectedChat?.id
          const name = getChatName(chat)
          const initials = getInitials(name)

          return (
            <ListItemButton
              key={chat.id}
              selected={selected}
              onClick={() => onSelectChat?.(chat)}
              sx={{
                position: 'relative',
                borderRadius: floating ? 1.5 : 2,
                boxSizing: 'border-box',
                mb: 0.25,
                px: floating ? 1.25 : 1.5,
                py: floating ? 0.875 : 1,
                border: 'none',
                transition: 'all 160ms ease',
                '&:hover': {
                  backgroundColor: alpha(cores.primary, 0.05),
                  boxShadow: `inset 2px 0 0 ${alpha(cores.primary, 0.18)}`,
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(cores.primary, 0.08),
                  borderLeft: `2px solid ${cores.primary}`,
                  pl: floating ? 1.125 : 1.375,
                },
                '&.Mui-selected:hover': {
                  backgroundColor: alpha(cores.primary, 0.1),
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="success"
                  overlap="circular"
                  variant="standard"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Avatar
                    src={chat.fotoUrl ?? undefined}
                    alt={name}
                    sx={{
                      bgcolor: backgroundColor.default,
                      color: cores.text.primary,
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      width: floating ? 40 : 42,
                      height: floating ? 40 : 42,
                    }}
                  >
                    {initials}
                  </Avatar>
                </Badge>
              </ListItemAvatar>

              <ListItemText
                primary={name}
                secondary={renderizarUltimaMensagemPreview(chat.ultimaMensagemPreview)}
                slotProps={{
                  primary: {
                    noWrap: true,
                    sx: {
                      fontSize: '0.9375rem',
                      fontWeight: selected ? 700 : 600,
                      letterSpacing: 0,
                    },
                  },
                  secondary: {
                    noWrap: true,
                    sx: {
                      fontSize: '0.8125rem',
                      color: 'text.secondary',
                      mt: 0.25,
                    },
                  },
                }}
              />

              <Stack spacing={0.5} sx={{ alignItems: 'flex-end', ml: 1 }}>
                <Box
                  component="span"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.6875rem',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getChatTime(chat.ultimaMensagemEm)}
                </Box>
                {chat.quantidadeMensagensNaoLidas > 0 && (
                  <Box
                    sx={{
                      minWidth: 20,
                      height: 18,
                      px: 0.75,
                      borderRadius: 10,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                    }}
                  >
                    {chat.quantidadeMensagensNaoLidas}
                  </Box>
                )}
              </Stack>
            </ListItemButton>
          )
        })}
      </List>
      </Box>

      <ModalContato
        onClose={() => setModalContatoAberto(false)}
        open={modalContatoAberto}
      />
    </>
  )
}
