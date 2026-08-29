import { Link } from '@mui/material'
import type { LinkAppProps } from './linkAppTypes'

export function LinkApp({ children, href = '#', onClick, underline = 'hover' }: LinkAppProps) {
  return (
    <Link href={href} onClick={onClick} underline={underline} sx={{ fontWeight: 600 }}>
      {children}
    </Link>
  )
}
