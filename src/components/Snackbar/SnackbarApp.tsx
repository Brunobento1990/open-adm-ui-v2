import { Slide, type SlideProps } from '@mui/material'
import MuiAlert, { type AlertColor } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useEffect, useState } from 'react'
import { clearSnackbarHandler, setSnackbarHandler } from './snackbarHandler'

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" timeout={500} />
}

export function SnackbarApp() {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string | string[]>('')
  const [severity, setSeverity] = useState<AlertColor>('error')

  useEffect(() => {
    setSnackbarHandler((isLoading, nextMessage, severityParams) => {
      setMessage(
        nextMessage || 'Ocorreu um erro interno, tente novamente mais tarde!',
      )
      setOpen(isLoading)
      if (severityParams) setSeverity(severityParams)
    })

    return clearSnackbarHandler
  }, [])

  function closeSnack() {
    setOpen(false)
  }

  if (!open) return null

  return (
    <Snackbar
      open
      autoHideDuration={3000}
      onClose={closeSnack}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      key={Array.isArray(message) ? message.join('-') : message}
      slotProps={{ transition: SlideTransition }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={closeSnack}
      >
        {Array.isArray(message) ? message.join('\n') : message}
      </MuiAlert>
    </Snackbar>
  )
}
