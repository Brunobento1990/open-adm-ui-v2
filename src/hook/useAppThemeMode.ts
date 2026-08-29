import { useContext } from 'react'
import { AppThemeModeContext } from '../layout/theme/themeMode'

export function useAppThemeMode() {
  const context = useContext(AppThemeModeContext)

  if (!context) {
    throw new Error('useAppThemeMode must be used within AppThemeProvider')
  }

  return context
}
