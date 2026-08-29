import type { AlertColor } from '@mui/material/Alert'

type SnackbarHandler = (
  isLoading: boolean,
  message?: string | string[],
  severity?: AlertColor,
) => void

let snackbarHandler: SnackbarHandler | undefined

export function setSnackbarHandler(handler: SnackbarHandler) {
  snackbarHandler = handler
}

export function clearSnackbarHandler() {
  snackbarHandler = undefined
}

export function showSnackbar(message?: string | string[], severity?: AlertColor) {
  snackbarHandler?.(true, message, severity)
}
