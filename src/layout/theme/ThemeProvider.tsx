import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { keysLocalStorage } from '../../configs/keysLocalStorage'
import { useLocalStorageApp } from '../../hook/useLocalStorageApp'
import { darkTheme } from './dark'
import { lightTheme } from './light'
import {
  AppThemeModeContext,
  isThemeMode,
  ThemeModeValue,
  type ThemeMode,
} from './themeMode'

type AppThemeProviderProps = {
  children: ReactNode
  mode?: ThemeMode
}

export function AppThemeProvider({
  children,
  mode = ThemeModeValue.Dark,
}: AppThemeProviderProps) {
  const storage = useLocalStorageApp()
  const [currentMode, setCurrentMode] = useState<ThemeMode>(() => {
    const savedMode = storage.getItem<ThemeMode>(keysLocalStorage.tema)
    return isThemeMode(savedMode) ? savedMode : mode
  })
  const theme = currentMode === ThemeModeValue.Light ? lightTheme : darkTheme

  const toggleMode = () => {
    setCurrentMode((current) => {
      const nextMode = current === ThemeModeValue.Light
        ? ThemeModeValue.Dark
        : ThemeModeValue.Light
      storage.setItem(keysLocalStorage.tema, nextMode)
      return nextMode
    })
  }

  return (
    <AppThemeModeContext.Provider value={{ mode: currentMode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppThemeModeContext.Provider>
  )
}
