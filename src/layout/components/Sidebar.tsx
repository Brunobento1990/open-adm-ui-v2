import { Box, Divider, Drawer, List, Skeleton, Stack } from '@mui/material'
import { useState } from 'react'
import {
  BoxApp
} from '../../components/BoxApp/BoxApp'
import { BoxAppComponent } from '../../components/BoxApp/boxAppTypes'
import {
  TextApp,
  TextAppColor,
  TextAppVariant,
  TextAppWeight,
} from '../../components/TextApp/TextApp'
import { useAuth } from '../../hook/useAuth'
import { useNavigationApp } from '../../hook/useNavigationApp'
import { useMenus } from '../../hook/useMenus'
import { useThemeApp } from '../../hook/useThemeApp'
import { SidebarMenuItemNode } from './SidebarMenuItemNode'
import { getInitialOpenMenuIds } from './sidebarMenuUtils'

type SidebarProps = {
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const { pathName } = useNavigationApp()
  const { empresa } = useAuth()
  const { loading, menus } = useMenus()
  const { borderRadius, isCelular, navigation } = useThemeApp()
  const [openIds, setOpenIds] = useState<string[]>(() =>
    getInitialOpenMenuIds(menus, pathName),
  )

  const toggleMenu = (id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const sidebarContent = (
    <BoxApp
      component={BoxAppComponent.Aside}
      width={navigation.width}
      minHeight="100vh"
      p={2.5}
      borderRight="1px solid"
      borderColor={navigation.sidebar.border}
      backgroundColor={navigation.sidebar.background}
      color={navigation.sidebar.foreground}
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            minHeight: 42,
            minWidth: 0,
            px: 1,
            '& .sidebar-company-name': {
              lineHeight: 1.15,
            },
            '& .sidebar-company-user': {
              lineHeight: 1.2,
              mt: 0.25,
            },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <TextApp
              variant={TextAppVariant.Subtitle}
              color={TextAppColor.Inherit}
              fontSize="0.9375rem"
              weight={TextAppWeight.Bold}
              noWrap
              className="sidebar-company-name"
            >
              {empresa?.nomeFantasia || 'Micro ERP'}
            </TextApp>
          </Box>
        </Box>

        <Divider sx={{ borderColor: navigation.sidebar.border }} />

        <List disablePadding component="nav" sx={{ mx: -0.5 }}>
          {loading && menus.length === 0 && Array.from({ length: 4 }, (_, index) => (
            <Skeleton
              key={index}
              height={42}
              sx={{ borderRadius, mb: 0.5 }}
              variant="rounded"
            />
          ))}
          {menus.map((menu) => (
            <SidebarMenuItemNode
              key={menu.id}
              menu={menu}
              pathname={pathName}
              menuBorderRadius={borderRadius}
              menuBackgroundDefault={navigation.sidebar.hover}
              menuActiveBackground={navigation.sidebar.active}
              menuPrimaryColor={navigation.sidebar.activeText}
              menuMutedColor={navigation.sidebar.muted}
              openIds={openIds}
              onToggle={toggleMenu}
              onNavigate={isCelular ? onMobileClose : undefined}
            />
          ))}
        </List>
      </Stack>
    </BoxApp>
  )

  if (!isCelular) {
    return sidebarContent
  }

  return (
    <Drawer
      open={isMobileOpen}
      onClose={onMobileClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        paper: {
          sx: {
            width: navigation.width,
            maxWidth: '85vw',
          },
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  )
}
