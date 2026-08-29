import { useEffect, useEffectEvent, useState, type ReactNode } from 'react'
import { useApiMenu } from '../api/useApiMenu'
import type { Menu } from '../types/MenuTypes'
import { MenuContext } from './MenuContext'

type MenuProviderProps = {
  children: ReactNode
}

export function MenuProvider({ children }: MenuProviderProps) {
  const apiMenu = useApiMenu()
  const [menus, setMenus] = useState<Menu[]>([])

  const buscarMenus = useEffectEvent(() => apiMenu.obter.fetch())

  useEffect(() => {
    let ativo = true

    void buscarMenus().then((response) => {
      if (!ativo) return

      if (response) {
        setMenus(response)
      }
    })

    return () => {
      ativo = false
    }
  }, [])

  return (
    <MenuContext.Provider
      value={{
        menus,
        loading: apiMenu.obter.loading,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}
