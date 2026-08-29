import { Button, CircularProgress } from '@mui/material'
import {
  ButtonAppColor,
  ButtonAppSize,
  ButtonAppVariant,
  type ButtonAppProps,
} from './buttonAppTypes'

export { ButtonAppColor, ButtonAppSize, ButtonAppVariant } from './buttonAppTypes'

export function ButtonApp({
  children,
  color = ButtonAppColor.Primary,
  disabled,
  fullWidth,
  loading,
  size = ButtonAppSize.Medium,
  startIcon,
  type = 'button',
  variant = ButtonAppVariant.Contained,
  onClick
}: ButtonAppProps) {
  return (
    <Button
      color={color}
      onClick={onClick}
      disabled={disabled || loading}
      endIcon={
        loading ? (
          <CircularProgress color="inherit" size={16} />
        ) : undefined
      }
      fullWidth={fullWidth}
      size={size}
      startIcon={startIcon}
      type={type}
      variant={variant}
      sx={{ py: size === ButtonAppSize.Large ? 1.2 : undefined, textTransform: 'none' }}
    >
      {loading ? 'Carregando...' : children}
    </Button>
  )
}
