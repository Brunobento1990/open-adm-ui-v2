import { useThemeApp } from '../../hook/useThemeApp'
import { StatusParcela } from '../../types/FaturaTypes'
import { TipoPaletaCorEnum } from '../../types/TipoPaletaCorEnum'
import { BadgeApp } from '../BadegApp/BadgeApp'

type StatusParcelaBadgeProps = {
  status: StatusParcela
}

const statusTexto: Record<StatusParcela, string> = {
  [StatusParcela.Pendente]: 'Pendente',
  [StatusParcela.PagoParcial]: 'Pago parcial',
  [StatusParcela.Pago]: 'Pago',
  [StatusParcela.Vencida]: 'Vencida',
}

export function StatusParcelaBadge({ status }: StatusParcelaBadgeProps) {
  const { getPaletteColor } = useThemeApp()
  const statusCor: Record<StatusParcela, TipoPaletaCorEnum> = {
    [StatusParcela.Pendente]: TipoPaletaCorEnum.Warning,
    [StatusParcela.PagoParcial]: TipoPaletaCorEnum.Info,
    [StatusParcela.Pago]: TipoPaletaCorEnum.Success,
    [StatusParcela.Vencida]: TipoPaletaCorEnum.Error,
  }

  return (
    <BadgeApp
      cor={getPaletteColor(statusCor[status])}
      texto={statusTexto[status]}
      width="105px"
    />
  )
}
