import { useNavigationApp } from '../../hook/useNavigationApp'
import { getPagarParcelaPath } from '../../routes/appRoutes'
import { IconApp } from '../Icon/IconApp'
import { IconButtonComTolltip } from '../IconButtonComTolltip/IconButtonComTolltip'

type PagarParcelaButtonProps = { parcelaId: string }

export function PagarParcelaButton({ parcelaId }: PagarParcelaButtonProps) {
  const { navigate } = useNavigationApp()

  return (
    <IconButtonComTolltip
      aria-label="baixar parcela"
      onClick={(event) => {
        event.stopPropagation()
        navigate(getPagarParcelaPath(parcelaId))
      }}
      tooltip="Baixar"
    >
      <IconApp icon="fe:app-menu" />
    </IconButtonComTolltip>
  )
}
