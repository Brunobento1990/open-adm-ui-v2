import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

type PublicAppWrapperProps = {
  children?: ReactNode
}

export function PublicAppWrapper({ children }: PublicAppWrapperProps) {
  return children ?? <Outlet />
}
