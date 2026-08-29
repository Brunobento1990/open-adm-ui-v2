import type { ReactNode } from 'react'

export type PaperAppProps = {
  children?: ReactNode
  elevation?: number
  fullHeight?: boolean
  padding?: number | string | { xs?: number | string; sm?: number | string }
}
