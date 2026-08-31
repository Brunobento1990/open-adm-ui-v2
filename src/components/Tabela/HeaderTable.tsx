import { Icon } from '@iconify/react'
import { IconButton, Stack, Tooltip } from '@mui/material'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLocalStorageApp } from '../../hook/useLocalStorageApp'
import { useNavigationApp } from '../../hook/useNavigationApp'
import { useThemeApp } from '../../hook/useThemeApp'
import { ButtonApp } from '../ButtonApp/ButtonApp'
import { InputApp } from '../InputApp/InputApp'
import { InputAppType } from '../InputApp/inputAppTypes'
import { MenuApp, type MenuAppItem } from '../MenuApp/MenuApp'

type HeaderTableProps = {
  urlAdd?: string
  notBtnAdd?: boolean
  pesquisar: (search?: string) => void
  setListarInativos: (newValue: boolean) => void
  listarInativos: boolean
  desabilitarColunaAtivo?: boolean
  childrenHeader?: ReactNode
  acoesExtras?: ReactNode
  reiniciarColunas?: () => Promise<unknown> | void
  menuItems?: MenuAppItem[]
}

const HeaderTableIcon = {
  Add: 'ic:round-plus',
  Checked: 'solar:check-square-linear',
  Menu: 'charm:menu-kebab',
  Refresh: 'solar:refresh-linear',
  Unchecked: 'solar:stop-linear',
} as const

const HeaderTableMenu = {
  AriaLabel: 'opções da tabela',
  Id: 'menu-opcoes-tabela',
  Tooltip: 'Opções da tabela',
} as const

const HeaderTableField = {
  ListarInativos: 'listarInativos',
  Pesquisar: 'pesquisar',
} as const

export function HeaderTable({
  acoesExtras,
  childrenHeader,
  desabilitarColunaAtivo,
  listarInativos,
  menuItems: menuItemsProps,
  notBtnAdd,
  pesquisar,
  reiniciarColunas,
  setListarInativos,
  urlAdd,
}: HeaderTableProps) {
  const { navigate } = useNavigationApp()
  const { setItem } = useLocalStorageApp()
  const { cores, isCelular } = useThemeApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  function submitSearch(event?: FormEvent) {
    event?.preventDefault()
    pesquisar(search.trim() || undefined)
  }

  function changeInactiveFilter(value: boolean) {
    const serializedValue = String(value)
    setItem(HeaderTableField.ListarInativos, serializedValue)
    setListarInativos(value)

    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set(HeaderTableField.ListarInativos, serializedValue)
    setSearchParams(updatedParams, { replace: true })
  }

  const searchInput = (
    <Stack component="form" onSubmit={submitSearch} sx={{ flex: 1, minWidth: 0 }}>
      <InputApp
        id={HeaderTableField.Pesquisar}
        label="Pesquisar"
        name={HeaderTableField.Pesquisar}
        onChange={(_, value) => {
          const newSearch = String(value ?? '')
          setSearch(newSearch)
          if (!newSearch) pesquisar(undefined)
        }}
        type={InputAppType.Search}
        value={search}
      />
    </Stack>
  )

  const menuItems: MenuAppItem[] = [...(menuItemsProps ?? [])]

  if (!desabilitarColunaAtivo) {
    menuItems.push({
      icon: listarInativos ? HeaderTableIcon.Checked : HeaderTableIcon.Unchecked,
      iconColor: listarInativos ? cores.primary : cores.text.secondary,
      label: 'Listar inativos',
      onClick: () => changeInactiveFilter(!listarInativos),
    })
  }

  if (reiniciarColunas) {
    menuItems.push({
      icon: HeaderTableIcon.Refresh,
      iconColor: cores.error,
      label: 'Reiniciar colunas',
      onClick: reiniciarColunas,
    })
  }

  const tableOptions = menuItems.length > 0 && (
    <MenuApp
      active={listarInativos}
      ariaLabel={HeaderTableMenu.AriaLabel}
      buttonIcon={HeaderTableIcon.Menu}
      id={HeaderTableMenu.Id}
      items={menuItems}
      tooltip={HeaderTableMenu.Tooltip}
    />
  )

  if (isCelular) {
    return (
      <Stack spacing={1} sx={{ width: '100%' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', width: '100%' }}
        >
          {!notBtnAdd && urlAdd && (
            <Tooltip title="Adicionar">
              <IconButton
                aria-label="adicionar registro"
                color="primary"
                onClick={() => navigate(urlAdd)}
                sx={{
                  bgcolor: cores.primary,
                  color: 'primary.contrastText',
                  flex: '0 0 auto',
                  height: 32,
                  width: 32,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <Icon icon={HeaderTableIcon.Add} fontSize={28} />
              </IconButton>
            </Tooltip>
          )}
          {searchInput}
          {tableOptions}
        </Stack>
        {(acoesExtras || childrenHeader) && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {acoesExtras}
            {childrenHeader}
          </Stack>
        )}
      </Stack>
    )
  }

  return (
    <Stack
      direction={isCelular ? 'column' : 'row'}
      spacing={1}
      sx={{ alignItems: isCelular ? 'stretch' : 'center', width: '100%' }}
    >
      {!notBtnAdd && urlAdd && (
        <ButtonApp onClick={() => navigate(urlAdd)}>Adicionar</ButtonApp>
      )}

      {searchInput}

      {acoesExtras}

      {childrenHeader}

      {tableOptions}
    </Stack>
  )
}
