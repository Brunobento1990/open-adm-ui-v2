import { Typography } from '@mui/material'
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

const colorMap: Record<TextAppColor, 'text.primary' | 'text.secondary' | 'inherit' | 'primary'> =
  {
    [TextAppColor.Default]: 'text.primary',
    [TextAppColor.Primary]: 'primary',
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
}: TextAppProps) {
  const componentProps = component ? { component } : {}
  const fontSizeValue = fontSize ?? (size ? sizeMap[size] : undefined)
  const fontWeightValue = fontWeight ?? (weight ? weightMap[weight] : undefined)

  return (
    <Typography
      align={align}
      className={className}
      color={colorMap[color]}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      sx={{
        fontSize: fontSizeValue,
        fontWeight: fontWeightValue,
      }}
      variant={variantMap[variant]}
      {...componentProps}
    >
      {children}
    </Typography>
  )
}
