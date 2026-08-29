import { IconButton, Tooltip, type IconButtonProps, type TooltipProps } from '@mui/material'

type IconButtonComTolltipProps = IconButtonProps & {
  tooltip: TooltipProps['title']
}

export function IconButtonComTolltip({
  tooltip,
  ...iconButtonProps
}: IconButtonComTolltipProps) {
  return (
    <Tooltip title={tooltip}>
      <IconButton {...iconButtonProps} />
    </Tooltip>
  )
}
