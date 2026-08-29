import type { ReactNode } from 'react'
import { menus } from '../configs/menus'
import { MenuContext } from './MenuContext'

type MenuProviderProps = {
  children: ReactNode
}

export function MenuProvider({ children }: MenuProviderProps) {
  return (
    <MenuContext.Provider
      value={{
        menus,
        loading: false,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}
