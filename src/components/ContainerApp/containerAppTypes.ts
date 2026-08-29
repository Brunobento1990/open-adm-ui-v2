import type { ReactNode } from 'react'

export enum ContainerAppMaxWidth {
  Xs = 'xs',
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',
}

export type ContainerAppProps = {
  children?: ReactNode
  disableGutters?: boolean
  fullHeight?: boolean
  maxWidth?: ContainerAppMaxWidth
}
