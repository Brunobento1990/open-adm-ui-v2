import { Paper } from '@mui/material'
import type { PaperAppProps } from './paperAppTypes'

export function PaperApp({
  children,
  elevation = 0,
  fullHeight,
  padding = { xs: 2, sm: 2.5 },
  sx,
  variant,
}: PaperAppProps) {
  return (
    <Paper
      elevation={elevation}
      variant={variant}
      sx={[{
        display: fullHeight ? 'flex' : undefined,
        flexDirection: fullHeight ? 'column' : undefined,
        height: fullHeight ? '100%' : undefined,
        minHeight: fullHeight ? 0 : undefined,
        boxSizing: fullHeight ? 'border-box' : undefined,
        overflow: fullHeight ? 'hidden' : undefined,
        p: padding,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: ({ palette }) =>
          palette.mode === 'dark'
            ? '0 24px 80px rgba(0, 0, 0, 0.35)'
            : '0 24px 80px rgba(15, 23, 42, 0.10)',
      }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </Paper>
  )
}
