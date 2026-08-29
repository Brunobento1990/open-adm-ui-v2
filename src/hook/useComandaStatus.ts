import { ComandaStatus, ComandaStatusLabel } from '../types/ComandaTypes'
import { useThemeApp } from './useThemeApp'

export function useComandaStatus() {
  const { cores } = useThemeApp()
  const statusConfig: Record<ComandaStatus, { color: string; icon: string; label: string }> = {
    [ComandaStatus.Aberta]: {
      color: cores.success,
      icon: 'solar:clock-circle-linear',
      label: ComandaStatusLabel[ComandaStatus.Aberta],
    },
    [ComandaStatus.AguardandoPagamento]: {
      color: cores.warning,
      icon: 'solar:wallet-money-linear',
      label: ComandaStatusLabel[ComandaStatus.AguardandoPagamento],
    },
    [ComandaStatus.Fechada]: {
      color: cores.info,
      icon: 'solar:check-circle-linear',
      label: ComandaStatusLabel[ComandaStatus.Fechada],
    },
    [ComandaStatus.Cancelada]: {
      color: cores.error,
      icon: 'solar:close-circle-linear',
      label: ComandaStatusLabel[ComandaStatus.Cancelada],
    },
  }

  return (status: ComandaStatus) => statusConfig[status]
}
