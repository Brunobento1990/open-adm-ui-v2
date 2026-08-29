import { Container } from '@mui/material'
import { ContainerAppMaxWidth, type ContainerAppProps } from './containerAppTypes'

export { ContainerAppMaxWidth } from './containerAppTypes'

export function ContainerApp({
  children,
  disableGutters,
  fullHeight,
  maxWidth = ContainerAppMaxWidth.Lg,
}: ContainerAppProps) {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        display: fullHeight ? 'flex' : undefined,
        flex: fullHeight ? 1 : undefined,
        flexDirection: fullHeight ? 'column' : undefined,
        height: fullHeight ? '100%' : undefined,
        minHeight: fullHeight ? 0 : undefined,
      }}
    >
      {children}
    </Container>
  )
}
