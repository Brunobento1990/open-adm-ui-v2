import { Icon } from '@iconify/react'
import { Avatar, IconButton, Stack, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useApiUsuarioLogout } from '../../api/useApiUsuario'
import {
  BoxApp
} from '../../components/BoxApp/BoxApp'
import { BoxAppComponent, BoxAppDisplay, BoxAppFlexDirection } from '../../components/BoxApp/boxAppTypes'
import { MenuApp, type MenuAppItem } from '../../components/MenuApp/MenuApp'
import {
  TextApp,
  TextAppVariant,
  TextAppWeight
} from '../../components/TextApp/TextApp'
import { useAppThemeMode } from '../../hook/useAppThemeMode'
import { useAuth } from '../../hook/useAuth'
import { useNavigationApp } from '../../hook/useNavigationApp'
import { useThemeApp } from '../../hook/useThemeApp'
import { ThemeModeValue } from '../theme/themeMode'
import { PrivateRoutePath } from '../../routes/appRoutes'
import { TrocarSenhaModal } from './TrocarSenhaModal'

type HeaderProps = {
  title: string
  onOpenMobileSidebar: () => void
}

const HeaderIcon = {
  Account: 'solar:user-rounded-bold',
  Logout: 'solar:logout-2-bold',
  Password: 'solar:lock-password-bold',
  Menu: 'mynaui:menu',
  Moon: 'solar:moon-bold',
  Sun: 'solar:sun-bold',
} as const

const HeaderMenu = {
  Id: 'header-user-menu',
} as const

function getInitials(name?: string) {
  if (!name) {
    return 'ME'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function Header({ title, onOpenMobileSidebar }: HeaderProps) {
  const [trocarSenhaOpen, setTrocarSenhaOpen] = useState(false)
  const { backgroundColor, borderRadius, cores, isCelular } = useThemeApp()
  const { logout, usuario } = useAuth()
  const apiLogout = useApiUsuarioLogout()
  const { navigate } = useNavigationApp()
  const { mode, toggleMode } = useAppThemeMode()
  const themeIcon = mode === ThemeModeValue.Dark ? HeaderIcon.Sun : HeaderIcon.Moon

  async function sair() {
    if (apiLogout.loading) return

    const response = await apiLogout.action()
    if (response?.resultado) logout()
  }

  const userMenuItems: MenuAppItem[] = [
    {
      label: 'Trocar senha',
      icon: HeaderIcon.Password,
      onClick: () => setTrocarSenhaOpen(true),
    },
    {
      label: 'Minha conta',
      icon: HeaderIcon.Account,
      onClick: () => navigate(PrivateRoutePath.MinhaConta),
    },
    {
      disabled: apiLogout.loading,
      label: 'Sair',
      icon: HeaderIcon.Logout,
      onClick: sair,
    },
  ]

  return (
    <BoxApp
      component={BoxAppComponent.Header}
      display={BoxAppDisplay.Block}
      px={isCelular ? 2 : 4}
      py={1}
      borderBottom="1px solid"
      borderColor="divider"
      backgroundColor={backgroundColor.card}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 42,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
          {isCelular && (
            <IconButton
              onClick={onOpenMobileSidebar}
              aria-label="abrir menu de navegação"
              sx={{
                flexShrink: 0,
                height: 34,
                width: 34,
                borderRadius,
                color: cores.text.primary,
              }}
            >
              <Icon icon={HeaderIcon.Menu} fontSize={21} />
            </IconButton>
          )}
          <BoxApp
            display={BoxAppDisplay.Flex}
            flexDirection={BoxAppFlexDirection.Column}
            minWidth={0}
          >
            <TextApp
              variant={TextAppVariant.Subtitle}
              weight={TextAppWeight.Bold}
              noWrap
            >
              {title}
            </TextApp>
          </BoxApp>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {/* <Tooltip title="Abrir chat">
            <IconButton
              onClick={() => abrirChatSuspenso()}
              aria-label="abrir chat"
              sx={{
                height: 34,
                width: 34,
                borderRadius,
                color: cores.text.primary,
                backgroundColor: backgroundColor.default,
                '&:hover': {
                  backgroundColor: alpha(cores.primary, 0.08),
                  color: 'primary.main',
                },
              }}
            >
              <Icon icon={ChatIcon.Conversations} fontSize={19} />
            </IconButton>
          </Tooltip> */}

          <Tooltip title={mode === ThemeModeValue.Dark ? 'Tema claro' : 'Tema escuro'}>
            <IconButton
              onClick={toggleMode}
              aria-label="alterar tema"
              sx={{
                height: 34,
                width: 34,
                borderRadius,
                color: cores.text.primary,
              }}
            >
              <Icon icon={themeIcon} fontSize={19} />
            </IconButton>
          </Tooltip>

          <MenuApp
            id={HeaderMenu.Id}
            ariaLabel="abrir menu do usuário"
            items={userMenuItems}
            tooltip="Menu do usuário"
            buttonSx={{ height: 34, p: 0, width: 34 }}
            buttonContent={
              <Avatar
                alt={usuario?.nome || 'Usuário'}
                sx={{
                  width: 34,
                  height: 34,
                  color: cores.text.primary,
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                }}
              >
                {getInitials(usuario?.nome)}
              </Avatar>
            }
          />
        </Stack>
      </Stack>
      {trocarSenhaOpen && (
        <TrocarSenhaModal
          onClose={() => setTrocarSenhaOpen(false)}
          open
        />
      )}
    </BoxApp>
  )
}
