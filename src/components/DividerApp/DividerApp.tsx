import { Divider } from '@mui/material'
import type { DividerAppProps } from './dividerAppTypes'

export function DividerApp({ children, flexItem, sx }: DividerAppProps) {
  return <Divider flexItem={flexItem} sx={sx}>{children}</Divider>
}
