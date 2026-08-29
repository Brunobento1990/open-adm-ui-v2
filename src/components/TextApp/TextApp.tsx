import { Typography } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import {
  TextAppAlign,
  TextAppColor,
  TextAppSize,
  TextAppVariant,
  TextAppWeight,
  type TextAppProps,
} from './textAppTypes'

const variantMap: Record<TextAppVariant, 'h1' | 'h4' | 'h6' | 'body2'> = {
  [TextAppVariant.Display]: 'h1',
  [TextAppVariant.Title]: 'h4',
  [TextAppVariant.Subtitle]: 'h6',
  [TextAppVariant.Body]: 'body2',
  [TextAppVariant.Label]: 'body2',
}

const colorMap: Record<TextAppColor, 'text.primary' | 'text.secondary' | 'inherit' | 'primary.main'> =
  {
    [TextAppColor.Default]: 'text.primary',
    [TextAppColor.Primary]: 'primary.main',
    [TextAppColor.Secondary]: 'text.secondary',
    [TextAppColor.Inherit]: 'inherit',
  }

const sizeMap: Record<TextAppSize, string> = {
  [TextAppSize.Small]: '0.875rem',
  [TextAppSize.Medium]: '1rem',
  [TextAppSize.Large]: '1.125rem',
  [TextAppSize.XLarge]: '1.25rem',
}

const weightMap: Record<TextAppWeight, number> = {
  [TextAppWeight.Regular]: 400,
  [TextAppWeight.Medium]: 500,
  [TextAppWeight.SemiBold]: 600,
  [TextAppWeight.Bold]: 700,
}

function resolveColor(color: NonNullable<TextAppProps['color']>) {
  if (color in colorMap) return colorMap[color as TextAppColor]

  return typeof color === 'string'
    ? color.replace(/\s+%/g, '%')
    : color
}

export {
  TextAppAlign,
  TextAppColor,
  TextAppSize,
  TextAppVariant,
  TextAppWeight,
} from './textAppTypes'

export function TextApp({
  children,
  variant = TextAppVariant.Body,
  color = TextAppColor.Default,
  size,
  fontSize,
  weight,
  fontWeight,
  align = TextAppAlign.Inherit,
  component,
  noWrap,
  gutterBottom,
  className,
  sx,
}: TextAppProps) {
  const componentProps = component ? { component } : {}
  const fontSizeValue = fontSize ?? (size ? sizeMap[size] : undefined)
  const fontWeightValue = fontWeight ?? (weight ? weightMap[weight] : undefined)
  const typographyVariant: TypographyProps['variant'] =
    variant in variantMap
      ? variantMap[variant as TextAppVariant]
      : variant as TypographyProps['variant']

  return (
    <Typography
      align={align}
      className={className}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      sx={[{
        color: resolveColor(color),
        fontSize: fontSizeValue,
        fontWeight: fontWeightValue,
      }, ...(Array.isArray(sx) ? sx : [sx])]}
      variant={typographyVariant}
      {...componentProps}
    >
      {children}
    </Typography>
  )
}
