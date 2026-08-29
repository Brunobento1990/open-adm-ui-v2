import { Divider } from '@mui/material'
import type { DividerAppProps } from './dividerAppTypes'

export function DividerApp({ children }: DividerAppProps) {
  return <Divider>{children}</Divider>
}

