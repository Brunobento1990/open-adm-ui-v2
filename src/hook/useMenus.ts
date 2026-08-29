import { useContext } from 'react'
import { MenuContext } from '../context/MenuContext'

export function useMenus() {
  const context = useContext(MenuContext)

  if (!context) {
    throw new Error('useMenus deve ser usado dentro de MenuProvider')
  }

  return context
}
