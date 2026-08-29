import type { ReactNode } from 'react'
import type { PaperProps } from '@mui/material'

export type PaperAppProps = {
  children?: ReactNode
  elevation?: number
  fullHeight?: boolean
  padding?: number | string | { xs?: number | string; sm?: number | string }
  sx?: PaperProps['sx']
  variant?: PaperProps['variant']
}
