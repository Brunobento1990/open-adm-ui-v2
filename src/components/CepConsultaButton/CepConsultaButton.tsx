import { IconApp } from '../Icon/IconApp'
import { IconButtonComTolltip } from '../IconButtonComTolltip/IconButtonComTolltip'
import { useThemeApp } from '../../hook/useThemeApp'

type CepConsultaButtonProps = {
  loading?: boolean
  onClick: () => void | Promise<void>
}

export function CepConsultaButton({ loading, onClick }: CepConsultaButtonProps) {
  const { cores } = useThemeApp()

  return (
    <IconButtonComTolltip
      aria-label="Consultar CEP"
      disabled={loading}
      onClick={onClick}
      tooltip="Consultar CEP"
    >
      <IconApp
        color={cores.primary}
        icon={loading ? 'svg-spinners:ring-resize' : 'ant-design:search-outlined'}
      />
    </IconButtonComTolltip>
  )
}
