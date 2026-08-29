import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { BoxProps } from '@mui/material'

export enum BoxAppComponent {
  Div = 'div',
  Main = 'main',
  Section = 'section',
  Aside = 'aside',
  Header = 'header',
  Form = 'form',
  Span = 'span',
}

export enum BoxAppDisplay {
  Block = 'block',
  Flex = 'flex',
  Grid = 'grid',
  InlineFlex = 'inline-flex',
}

export enum BoxAppFlexDirection {
  Row = 'row',
  Column = 'column',
}

export enum BoxAppAlignItems {
  Stretch = 'stretch',
  Center = 'center',
  Start = 'flex-start',
  End = 'flex-end',
}

export enum BoxAppJustifyContent {
  Start = 'flex-start',
  Center = 'center',
  End = 'flex-end',
  SpaceBetween = 'space-between',
  SpaceAround = 'space-around',
  SpaceEvenly = 'space-evenly',
}

export enum BoxAppTextAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right',
  Justify = 'justify',
}

export enum BoxAppOverflow {
  Hidden = 'hidden',
  Auto = 'auto',
  Scroll = 'scroll',
  Visible = 'visible',
}

export enum BoxAppPlaceItems {
  Center = 'center',
  Start = 'start',
  End = 'end',
  Stretch = 'stretch',
}

export type BoxAppProps = {
  children?: ReactNode
  component?: BoxAppComponent | BoxProps['component']
  sx?: BoxProps['sx']
  title?: string
  role?: string
  display?: BoxAppDisplay
  flexDirection?: BoxAppFlexDirection
  alignItems?: BoxAppAlignItems
  justifyContent?: BoxAppJustifyContent
  textAlign?: BoxAppTextAlign
  placeItems?: BoxAppPlaceItems
  flex?: number | string
  gap?: number | string
  width?: number | string
  maxWidth?: number | string
  height?: number | string
  minWidth?: number | string
  minHeight?: number | string
  p?: number | string
  padding?: number | string
  px?: number | string
  py?: number | string
  pl?: number | string
  pr?: number | string
  pt?: number | string
  pb?: number | string
  m?: number | string
  mx?: number | string
  my?: number | string
  ml?: number | string
  mr?: number | string
  mt?: number | string
  mb?: number | string
  border?: string
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
  borderColor?: string
  borderRadius?: number | string
  background?: string
  backgroundColor?: string
  color?: string
  boxShadow?: string
  boxSizing?: 'border-box' | 'content-box'
  overflow?: BoxAppOverflow
  textDecoration?: string
  transform?: string
  transition?: string
  className?: string
  noValidate?: boolean
  onSubmit?: ComponentPropsWithoutRef<'form'>['onSubmit']
}
