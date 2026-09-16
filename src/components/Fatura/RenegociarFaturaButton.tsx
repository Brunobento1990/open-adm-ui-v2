import { useNavigationApp } from '../../hook/useNavigationApp'
import { useThemeApp } from '../../hook/useThemeApp'
import { PrivateRoutePath } from '../../routes/appRoutes'
import { IconApp } from '../Icon/IconApp'
import { IconButtonComTolltip } from '../IconButtonComTolltip/IconButtonComTolltip'

type Props = { faturaId: string }

export function RenegociarFaturaButton({ faturaId }: Props) {
  const { navigate } = useNavigationApp()
  const { cores } = useThemeApp()

  return (
    <IconButtonComTolltip
      aria-label="Renegociar fatura"
      disabled={!faturaId}
      onClick={(event) => {
        event.stopPropagation()
        navigate(`${PrivateRoutePath.FaturaRenegociar}/${faturaId}`)
      }}
      tooltip="Renegociar fatura"
    >
      <IconApp color={cores.primary} icon="solar:hand-money-linear" />
    </IconButtonComTolltip>
  )
}
