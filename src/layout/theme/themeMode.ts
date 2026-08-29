import { createContext } from 'react'

export const ThemeModeValue = {
  Light: 'light',
  Dark: 'dark',
} as const

export type ThemeMode = typeof ThemeModeValue[keyof typeof ThemeModeValue]

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === ThemeModeValue.Light || value === ThemeModeValue.Dark
}

export type AppThemeModeContextValue = {
  mode: ThemeMode
  toggleMode: () => void
}

export const AppThemeModeContext =
  createContext<AppThemeModeContextValue | null>(null)
