import { Icon } from '@iconify/react'
import { Collapse, ListItemButton, ListItemIcon } from '@mui/material'
import { NavLink } from 'react-router-dom'
import {
  BoxApp
} from '../../components/BoxApp/BoxApp'
import { BoxAppAlignItems, BoxAppComponent, BoxAppDisplay, BoxAppJustifyContent } from '../../components/BoxApp/boxAppTypes'
import {
  TextApp,
  TextAppColor,
  TextAppSize,
  TextAppVariant,
  TextAppWeight,
} from '../../components/TextApp/TextApp'
import { isMenu, type Menu } from '../../types/MenuTypes'
import { normalizeMenuPath } from './sidebarMenuUtils'

type SidebarMenuItemNodeProps = {
  menu: Menu
  pathname: string
  menuBorderRadius: string
  menuBackgroundDefault: string
  menuActiveBackground: string
  menuPrimaryColor: string
  menuMutedColor: string
  depth?: number
  openIds: string[]
  onToggle: (id: string) => void
  onNavigate?: () => void
}

function MenuIcon({ icon }: { icon?: string }) {
  if (!icon) {
    return null
  }

  return <Icon icon={icon} fontSize={20} />
}

export function SidebarMenuItemNode({
  menu,
  pathname,
  menuBorderRadius,
  menuBackgroundDefault,
  menuActiveBackground,
  menuPrimaryColor,
  menuMutedColor,
  depth = 0,
  openIds,
  onToggle,
  onNavigate,
}: SidebarMenuItemNodeProps) {
  const menuId = menu.id.toString()
  const children = menu.filhos?.filter(isMenu) ?? []
  const hasChildren = Boolean(children.length)
  const isOpen = openIds.includes(menuId)
  const menuPath = normalizeMenuPath(menu.caminho)
  const isActive = menuPath ? pathname === menuPath : false
  const paddingLeft = 1.5 + depth * 2

  if (hasChildren) {
    return (
      <BoxApp component={BoxAppComponent.Div}>
        <ListItemButton
          onClick={() => onToggle(menuId)}
          sx={{
            minHeight: 42,
            px: 1.25,
            py: 0.75,
            pl: paddingLeft,
            pr: 1.25,
            borderRadius: menuBorderRadius,
            mb: 0.5,
            color: menuMutedColor,
            backgroundColor: 'transparent',
            transition: 'background-color 160ms ease, color 160ms ease',
            '&:hover': {
              backgroundColor: menuBackgroundDefault,
              color: 'inherit',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
            <MenuIcon icon={menu.icone} />
          </ListItemIcon>
          <BoxApp
            component={BoxAppComponent.Div}
            display={BoxAppDisplay.Flex}
            flex={1}
            alignItems={BoxAppAlignItems.Center}
            justifyContent={BoxAppJustifyContent.SpaceBetween}
            minWidth={0}
          >
            <TextApp
              variant={TextAppVariant.Body}
              color={TextAppColor.Inherit}
              size={TextAppSize.Small}
              weight={TextAppWeight.SemiBold}
              noWrap
            >
              {menu.nome}
            </TextApp>
            <BoxApp
              component={BoxAppComponent.Div}
              display={BoxAppDisplay.InlineFlex}
              alignItems={BoxAppAlignItems.Center}
              transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
              transition="transform 160ms ease"
            >
              <Icon icon="solar:alt-arrow-right-linear" fontSize={14} />
            </BoxApp>
          </BoxApp>
        </ListItemButton>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <BoxApp component={BoxAppComponent.Div}>
            {children.map((child) => (
              <SidebarMenuItemNode
                key={child.id}
                menu={child}
                pathname={pathname}
                menuBorderRadius={menuBorderRadius}
                menuBackgroundDefault={menuBackgroundDefault}
                menuActiveBackground={menuActiveBackground}
                menuPrimaryColor={menuPrimaryColor}
                menuMutedColor={menuMutedColor}
                depth={depth + 1}
                openIds={openIds}
                onToggle={onToggle}
                onNavigate={onNavigate}
              />
            ))}
          </BoxApp>
        </Collapse>
      </BoxApp>
    )
  }

  if (!menuPath) {
    return (
      <ListItemButton
        disabled
        sx={{
          minHeight: 42,
          px: 1.25,
          py: 0.75,
          pl: paddingLeft,
          borderRadius: menuBorderRadius,
          mb: 0.5,
          color: menuMutedColor,
          opacity: 0.55,
        }}
      >
        <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
          <MenuIcon icon={menu.icone} />
        </ListItemIcon>
        <TextApp variant={TextAppVariant.Body} color={TextAppColor.Inherit} size={TextAppSize.Small} noWrap>
          {menu.nome}
        </TextApp>
      </ListItemButton>
    )
  }

  return (
    <ListItemButton
      component={NavLink}
      to={menuPath}
      onClick={onNavigate}
      sx={{
        minHeight: 42,
        px: 1.25,
        py: 0.75,
        pl: paddingLeft,
        borderRadius: menuBorderRadius,
        mb: 0.5,
        textDecoration: 'none',
        color: isActive ? menuPrimaryColor : menuMutedColor,
        transition: 'background-color 160ms ease, color 160ms ease',
        '&.active': {
          backgroundColor: menuActiveBackground,
          color: menuPrimaryColor,
          fontWeight: 700,
        },
        '&:hover': {
          backgroundColor: isActive ? menuActiveBackground : menuBackgroundDefault,
        },
        ...(isActive
          ? {
            backgroundColor: menuActiveBackground,
            color: menuPrimaryColor,
            fontWeight: 700,
          }
          : {}),
      }}
    >
      <ListItemIcon sx={{ minWidth: 34, color: isActive ? menuPrimaryColor : 'inherit' }}>
        <MenuIcon icon={menu.icone} />
      </ListItemIcon>
      <TextApp
        variant={TextAppVariant.Body}
        color={TextAppColor.Inherit}
        size={TextAppSize.Small}
        weight={isActive ? TextAppWeight.Bold : TextAppWeight.SemiBold}
        noWrap
      >
        {menu.nome}
      </TextApp>
    </ListItemButton>
  )
}
