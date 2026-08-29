import {
  Avatar,
  Badge,
  Box,
  Divider,
  Stack,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
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
  type ChatViewModel,
} from '../../../types/AtendimentoChatTypes'
import { getChatName, getInitials } from './atendimentoChatUtils'

type HeaderChatProps = {
  detalhesContatoAberto?: boolean
  selectedChat?: ChatViewModel
  onToggleDetalhesContato?: () => void
}

const headerChatMenuId = 'header-chat-menu'

export function HeaderChat({
  detalhesContatoAberto,
  selectedChat,
  onToggleDetalhesContato,
}: HeaderChatProps) {
  const { backgroundColor, cores } = useThemeApp()
  const name = selectedChat ? getChatName(selectedChat) : undefined
  const menuItems: MenuAppItem[] = [
    {
      icon: ChatIcon.ContactDetails,
      label: detalhesContatoAberto ? 'Fechar detalhes do contato' : 'Detalhes do contato',
      onClick: onToggleDetalhesContato,
    },
  ]

  return (
    <>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: backgroundColor.card,
          minHeight: 58,
          px: { xs: 1.5, sm: 2.25 },
          py: 0.75,
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0 }}>
          <Badge
            color="success"
            overlap="circular"
            variant="dot"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar
              src={selectedChat?.fotoUrl ?? undefined}
              alt={name}
              sx={{
                width: 40,
                height: 40,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {name ? getInitials(name) : undefined}
            </Avatar>
          </Badge>

          <Box sx={{ minWidth: 0 }}>
            <TextApp
              variant={TextAppVariant.Body}
              weight={TextAppWeight.Bold}
              fontSize="0.9375rem"
              noWrap
            >
              {name ?? 'Nenhuma conversa'}
            </TextApp>
            <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small} noWrap>
              {selectedChat ? '' : 'Atendimento em espera'}
            </TextApp>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          {/* <Tooltip title="Chamada">
            <IconButton
              sx={{
                borderRadius,
                width: 34,
                height: 34,
                transition: 'all 160ms ease',
                '&:hover': {
                  backgroundColor: alpha(cores.primary, 0.08),
                  color: 'primary.main',
                },
              }}
            >
              <Icon icon={ChatIcon.Phone} fontSize={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video">
            <IconButton
              sx={{
                borderRadius,
                width: 38,
                height: 38,
                transition: 'all 160ms ease',
                '&:hover': {
                  backgroundColor: alpha(cores.primary, 0.08),
                  color: 'primary.main',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Icon icon={ChatIcon.Video} fontSize={18} />
            </IconButton>
          </Tooltip> */}
          {selectedChat && (
            <MenuApp
              active={detalhesContatoAberto}
              ariaLabel="Opcoes da conversa"
              buttonIcon={ChatIcon.More}
              id={headerChatMenuId}
              items={menuItems}
              paperMinWidth={176}
              buttonSx={{
                display: { xs: 'none', xl: 'inline-flex' },
              }}
            />
          )}
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: alpha(cores.text.secondary, 0.08) }} />
    </>
  )
}
