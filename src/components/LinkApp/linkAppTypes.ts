import type { MouseEventHandler, ReactNode } from 'react'
import type { LinkProps } from '@mui/material'

export type LinkAppProps = {
  children?: ReactNode
  href?: string
  underline?: LinkProps['underline']
  onClick?: MouseEventHandler<HTMLAnchorElement>
}
