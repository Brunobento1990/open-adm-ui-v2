import { isMenu, type Menu } from '../../types/MenuTypes'

export function normalizeMenuPath(path?: string): string | undefined {
  if (!path) return undefined
  return path.startsWith('/') ? path : `/${path}`
}

export function menuHasActivePath(menu: Menu, pathname: string): boolean {
  const menuPath = normalizeMenuPath(menu.caminho)

  if (menuPath && pathname.startsWith(menuPath)) {
    return true
  }

  return menu.filhos?.some((child) => isMenu(child) && menuHasActivePath(child, pathname)) ?? false
}

export function getInitialOpenMenuIds(
  menus: Menu[],
  pathname: string,
): string[] {
  return menus
    .filter((menu) => menu.filhos?.some(isMenu) && menuHasActivePath(menu, pathname))
    .map((menu) => menu.id.toString())
}
