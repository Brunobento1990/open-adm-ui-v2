import { useMediaQuery } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { TipoPaletaCorEnum } from '../types/TipoPaletaCorEnum'

export function useThemeApp() {
  const theme = useTheme()
  const celular = !useMediaQuery((theme) => theme.breakpoints.up('sm'))
  const tablet = !useMediaQuery('(min-width:1300px)')
  const notbook = !useMediaQuery('(min-width:1750px)')
  const sidebarHover = alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.06 : 0.12)
  const sidebarActive = alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.12 : 0.2)
  const chatSentBubbleBackground = theme.palette.mode === 'light' ? '#dcf8c6' : '#1f5d43'
  const chatSentBubbleBorder = theme.palette.mode === 'light' ? '#c8edb1' : '#2c7a57'
  const paletteColors: Record<TipoPaletaCorEnum, string> = {
    [TipoPaletaCorEnum.Default]: theme.palette.text.primary,
    [TipoPaletaCorEnum.Primary]: theme.palette.primary.main,
    [TipoPaletaCorEnum.Secondary]: theme.palette.secondary.main,
    [TipoPaletaCorEnum.Error]: theme.palette.error.main,
    [TipoPaletaCorEnum.Info]: theme.palette.info.main,
    [TipoPaletaCorEnum.Success]: theme.palette.success.main,
    [TipoPaletaCorEnum.Warning]: theme.palette.warning.main,
  }

  return {
    borderRadius: `${theme.shape.borderRadius}px`,
    backgroundColor: {
      default: theme.palette.background.default,
      card: theme.palette.background.paper,
    },
    shadow: theme.shadows[2],
    colorWithOpacity: (color: string, opacity: number) => alpha(color, opacity),
    getPaletteColor: (color: TipoPaletaCorEnum) => paletteColors[color],
    cores: {
      divider: theme.palette.divider,
      dividerSoft: alpha(theme.palette.grey[500], theme.palette.mode === 'light' ? 0.08 : 0.12),
      primary: theme.palette.primary.main,
      text: theme.palette.text,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      success: theme.palette.success.main,
      info: theme.palette.info.main,
      whatsApp: '#25D366',
    },
    navigation: {
      width: 300,
      sidebar: {
        background: theme.palette.background.paper,
        foreground: theme.palette.text.primary,
        muted: theme.palette.text.secondary,
        hover: sidebarHover,
        active: sidebarActive,
        activeText: theme.palette.primary.main,
        border: theme.palette.divider,
        surface: theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : alpha(theme.palette.common.white, 0.04),
      },
    },
    chat: {
      message: {
        sent: {
          background: chatSentBubbleBackground,
          border: chatSentBubbleBorder,
        },
      },
    },
    isCelular: celular,
    isTablet: tablet,
    isNotbook: notbook,
  }
}
