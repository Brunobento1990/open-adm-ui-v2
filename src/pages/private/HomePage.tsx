import { BoxApp as Box } from '../../components/BoxApp/BoxApp'
import { IconApp } from '../../components/Icon/IconApp'
import { PaperApp as Paper } from '../../components/PaperApp/PaperApp'
import { StackApp as Stack } from '../../components/StackApp/StackApp'
import { TextApp as Typography } from '../../components/TextApp/TextApp'
import { useAuth } from '../../hook/useAuth'
import { useThemeApp } from '../../hook/useThemeApp'

export function HomePage() {
  const { usuario } = useAuth()
  const { colorWithOpacity, cores } = useThemeApp()

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        minHeight: 0,
        width: '100%',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          background: `linear-gradient(145deg, ${colorWithOpacity(cores.primary, 0.12)}, transparent 55%)`,
          maxWidth: 560,
          overflow: 'hidden',
          p: { xs: 4, sm: 6 },
          position: 'relative',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'center', position: 'relative' }}>
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: colorWithOpacity(cores.primary, 0.14),
              borderRadius: '50%',
              color: 'primary.main',
              display: 'flex',
              height: 72,
              justifyContent: 'center',
              width: 72,
            }}
          >
            <IconApp icon="solar:hand-shake-linear" width="2.25rem" />
          </Box>
          <Typography
            component="h1"
            sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem' }, fontWeight: 750, lineHeight: 1.2 }}
          >
            Olá, {usuario?.nome ?? 'representante'}!
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1rem', maxWidth: 380 }}>
            Seja bem-vindo ao seu painel de representante.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}
