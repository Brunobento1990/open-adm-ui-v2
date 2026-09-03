import { useThemeApp } from '../../hook/useThemeApp'
import { IconApp } from '../Icon/IconApp'
import { IconButtonComTolltip } from '../IconButtonComTolltip/IconButtonComTolltip'

type CnpjConsultaButtonProps = {
  disabled?: boolean
  loading?: boolean
  onClick: () => void | Promise<void>
}

export function CnpjConsultaButton({ disabled, loading, onClick }: CnpjConsultaButtonProps) {
  const { cores } = useThemeApp()

  return (
    <IconButtonComTolltip
      aria-label="Consultar CNPJ"
      disabled={disabled || loading}
      onClick={onClick}
      tooltip="Consultar CNPJ"
    >
      <IconApp
        color={cores.primary}
        icon={loading ? 'svg-spinners:ring-resize' : 'ant-design:search-outlined'}
      />
    </IconButtonComTolltip>
  )
}
