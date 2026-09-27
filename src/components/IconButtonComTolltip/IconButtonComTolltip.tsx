import { IconButton, Tooltip, type IconButtonProps, type TooltipProps } from '@mui/material'
import { IconButtonComTooltipVariant } from './iconButtonComTooltipTypes'

type IconButtonComTolltipProps = IconButtonProps & {
  tooltip: TooltipProps['title']
  variant?: IconButtonComTooltipVariant
}

export function IconButtonComTolltip({
  tooltip,
  variant = IconButtonComTooltipVariant.Standard,
  sx,
  ...iconButtonProps
}: IconButtonComTolltipProps) {
  const containedStyles =
    variant === IconButtonComTooltipVariant.Contained
      ? {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': { backgroundColor: 'primary.dark' },
        }
      : undefined

  return (
    <Tooltip title={tooltip}>
      <IconButton
        {...iconButtonProps}
        sx={[containedStyles, ...(Array.isArray(sx) ? sx : [sx])]}
      />
    </Tooltip>
  )
}
