import type { AlertColor } from '@mui/material/Alert'
import { SnackbarApp } from './SnackbarApp'
import { showSnackbar } from './snackbarHandler'

export function useSnackbarApp() {
  return {
    Componet: SnackbarApp,
    show: (message?: string | string[], severity?: AlertColor) =>
      showSnackbar(message, severity),
  }
}
