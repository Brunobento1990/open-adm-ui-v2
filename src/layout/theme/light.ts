import { createTheme } from '@mui/material'
import { componentsOverrides } from './overrides'

export const lightTheme = createTheme({
  components: {
    ...componentsOverrides,
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(145, 158, 171, 0.16)',
    '0 8px 16px 0 rgba(145, 158, 171, 0.16)',
    '0 12px 24px -4px rgba(145, 158, 171, 0.16)',
    '0 16px 32px -4px rgba(145, 158, 171, 0.16)',
    '0 20px 40px -4px rgba(145, 158, 171, 0.16)',
    '0 24px 48px 0 rgba(145, 158, 171, 0.16)',
    '0 28px 56px 0 rgba(145, 158, 171, 0.16)',
    '0 32px 64px 0 rgba(145, 158, 171, 0.16)',
    '0 36px 72px 0 rgba(145, 158, 171, 0.16)',
    '0 40px 80px 0 rgba(145, 158, 171, 0.16)',
    '0 44px 88px 0 rgba(145, 158, 171, 0.16)',
    '0 48px 96px 0 rgba(145, 158, 171, 0.16)',
    '0 52px 104px 0 rgba(145, 158, 171, 0.16)',
    '0 56px 112px 0 rgba(145, 158, 171, 0.16)',
    '0 60px 120px 0 rgba(145, 158, 171, 0.16)',
    '0 64px 128px 0 rgba(145, 158, 171, 0.16)',
    '0 68px 136px 0 rgba(145, 158, 171, 0.16)',
    '0 72px 144px 0 rgba(145, 158, 171, 0.16)',
    '0 76px 152px 0 rgba(145, 158, 171, 0.16)',
    '0 80px 160px 0 rgba(145, 158, 171, 0.16)',
    '0 84px 168px 0 rgba(145, 158, 171, 0.16)',
    '0 88px 176px 0 rgba(145, 158, 171, 0.16)',
    '0 92px 184px 0 rgba(145, 158, 171, 0.16)',
    '0 96px 192px 0 rgba(145, 158, 171, 0.16)',
  ],
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
      light: '#fff5cc',
    },
    error: {
      main: '#ff5630',
    },
    info: {
      main: '#00b8d9',
    },
    text: {
      primary: '#212b36',
      secondary: '#637381',
    },
    mode: 'light',
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    divider: 'rgba(145, 158, 171, 0.12)',
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
