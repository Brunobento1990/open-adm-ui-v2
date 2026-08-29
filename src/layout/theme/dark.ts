import { createTheme } from '@mui/material'
import { componentsOverrides } from './overrides'

export const darkTheme = createTheme({
  components: {
    ...componentsOverrides,
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Public Sans", "Inter", sans-serif',
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  palette: {
    primary: {
      main: '#4F8EF7',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22c55e',
    },
    warning: {
      main: '#ffab00',
      light: '#4a3515',
    },
    error: {
      main: '#ff5630',
    },
    info: {
      main: '#00b8d9',
    },
    text: {
      primary: '#ffffff',
      secondary: '#919eab',
    },
    mode: 'dark',
    background: {
      default: '#161c24',
      paper: '#212b36',
    },
    divider: 'rgba(145, 158, 171, 0.16)',
    grey: {
      50: '#fcfcfd',
      100: '#f9fafb',
      200: '#f4f6f8',
      300: '#dfe3e8',
      400: '#c4cdd5',
      500: '#919eab',
      600: '#637381',
      700: '#454f5b',
      800: '#212b36',
      900: '#161c24',
    },
  },
})
