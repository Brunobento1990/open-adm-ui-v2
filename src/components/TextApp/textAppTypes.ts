import type { ReactNode } from 'react'
import type { ElementType } from 'react'

export enum TextAppVariant {
  Display = 'display',
  Title = 'title',
  Subtitle = 'subtitle',
  Body = 'body',
  Label = 'label',
}

export enum TextAppColor {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
  Inherit = 'inherit',
}

export enum TextAppSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  XLarge = 'xlarge',
}

export enum TextAppWeight {
  Regular = 'regular',
  Medium = 'medium',
  SemiBold = 'semibold',
  Bold = 'bold',
}

export enum TextAppAlign {
  Inherit = 'inherit',
  Left = 'left',
  Center = 'center',
  Right = 'right',
  Justify = 'justify',
}

export type TextAppProps = {
  children?: ReactNode
  variant?: TextAppVariant
  color?: TextAppColor
  size?: TextAppSize
  fontSize?: string | number
  weight?: TextAppWeight
  fontWeight?: string | number
  align?: TextAppAlign
  component?: ElementType
  noWrap?: boolean
  gutterBottom?: boolean
  className?: string
}
