import { createContext } from 'react'
import type { Menu } from '../types/MenuTypes'

export type MenuContextValue = {
  menus: Menu[]
  loading: boolean
}

export const MenuContext = createContext<MenuContextValue | undefined>(undefined)
