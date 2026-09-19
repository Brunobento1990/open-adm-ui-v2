import { useMediaQuery, useTheme } from '@mui/material'

export function useMediaQueryApp() {
  const theme = useTheme()
  const isCelular = !useMediaQuery(theme.breakpoints.up('sm'))
  const isTablet = !useMediaQuery('(min-width:1300px)')
  const isNotbook = !useMediaQuery('(min-width:1750px)')

  return {
    isCelular,
    isTablet,
    isNotbook,
  }
}
