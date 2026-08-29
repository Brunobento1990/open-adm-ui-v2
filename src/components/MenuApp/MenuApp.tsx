import { Icon } from '@iconify/react'
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  type IconButtonProps,
  type MenuProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState, type MouseEvent, type ReactNode } from 'react'
import { useThemeApp } from '../../hook/useThemeApp'
import { TextApp } from '../TextApp/TextApp'

export type MenuAppItem = {
  disabled?: boolean
  label?: string
  icon?: string
  iconColor?: string
  onClick?: () => void
}

type MenuAppProps = {
  id: string
  ariaLabel: string
  buttonIcon?: string
  buttonContent?: ReactNode
  items: MenuAppItem[]
  active?: boolean
  buttonColor?: string
  buttonHoverColor?: string
  buttonSize?: IconButtonProps['size']
  buttonSx?: SxProps<Theme>
  itemFontSize?: string
  iconFontSize?: number
  itemMinHeight?: number
  itemPx?: number
  itemPy?: number
  itemSx?: SxProps<Theme>
  menuSx?: SxProps<Theme>
  paperMinWidth?: number
  tooltip?: string
  anchorOrigin?: MenuProps['anchorOrigin']
  transformOrigin?: MenuProps['transformOrigin']
}

export function MenuApp({
  active,
  ariaLabel,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
  buttonColor,
  buttonContent,
  buttonHoverColor,
  buttonIcon,
  buttonSize = 'medium',
  buttonSx,
  id,
  itemFontSize = '0.875rem',
  itemMinHeight = 36,
  itemPx = 1.5,
  itemPy = 0.75,
  itemSx,
  items,
  menuSx,
  paperMinWidth = 160,
  tooltip = 'Opcoes',
  iconFontSize = 14,
  transformOrigin = { vertical: 'top', horizontal: 'right' },
}: MenuAppProps) {
  const { borderRadius, cores } = useThemeApp()
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const menuAberto = Boolean(menuAnchorEl)
  const color = buttonColor ?? cores.text.primary
  const hoverColor = buttonHoverColor ?? 'primary.main'

  function abrirMenu(event: MouseEvent<HTMLButtonElement>) {
    setMenuAnchorEl(event.currentTarget)
  }

  function fecharMenu() {
    setMenuAnchorEl(null)
  }

  function selecionarItem(onClick?: () => void) {
    fecharMenu()
    onClick?.()
  }

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton
          type="button"
          aria-label={ariaLabel}
          aria-controls={menuAberto ? id : undefined}
          aria-expanded={menuAberto ? 'true' : undefined}
          aria-haspopup="menu"
          onClick={abrirMenu}
          size={buttonSize}
          sx={[
            {
              borderRadius,
              color: menuAberto || active ? hoverColor : color,
              height: 38,
              transition: 'all 160ms ease',
              width: 38,
              backgroundColor: menuAberto || active ? alpha(cores.primary, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(cores.primary, 0.08),
                color: hoverColor,
                transform: 'translateY(-1px)',
              },
            },
            ...(Array.isArray(buttonSx) ? buttonSx : [buttonSx]),
          ]}
        >
          {buttonContent ?? (buttonIcon && <Icon icon={buttonIcon} fontSize={18} />)}
        </IconButton>
      </Tooltip>

      <Menu
        id={id}
        anchorEl={menuAnchorEl}
        open={menuAberto}
        onClose={fecharMenu}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        sx={menuSx}
        slotProps={{
          paper: {
            sx: {
              border: `1px solid ${cores.dividerSoft}`,
              boxShadow: `0 12px 32px ${alpha(cores.text.primary, 0.14)}`,
              minWidth: paperMinWidth,
            },
          },
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            disabled={item.disabled}
            onClick={() => selecionarItem(item.onClick)}
            sx={[
              {
                gap: 1,
                minHeight: itemMinHeight,
                px: itemPx,
                py: itemPy,
              },
              ...(Array.isArray(itemSx) ? itemSx : [itemSx]),
            ]}
          >
            {item.icon && <Icon icon={item.icon} color={item.iconColor} fontSize={iconFontSize} />}
            {item.label && <TextApp fontSize={itemFontSize}>{item.label}</TextApp>}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
