import type { ButtonHTMLAttributes, ReactNode } from 'react'

export enum ButtonAppVariant {
  Contained = 'contained',
  Outlined = 'outlined',
  Text = 'text',
}

export enum ButtonAppSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum ButtonAppColor {
  Error = 'error',
  Primary = 'primary',
}

export type ButtonAppProps = {
  children?: ReactNode
  color?: ButtonAppColor
  disabled?: boolean
  fullWidth?: boolean
  loading?: boolean
  size?: ButtonAppSize
  startIcon?: ReactNode
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  variant?: ButtonAppVariant
  onClick?: (e?: any) => void
}
