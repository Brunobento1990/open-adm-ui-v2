import { TipoPaletaCorEnum } from './TipoPaletaCorEnum'

export enum PedidoStatus {
  EmAberto = 0,
  Faturado = 1,
  EmEntrega = 2,
  Entregue = 3,
  Cancelado = 4,
}

export const PedidoStatusColorMap: Record<PedidoStatus, TipoPaletaCorEnum> = {
  [PedidoStatus.EmAberto]: TipoPaletaCorEnum.Warning,
  [PedidoStatus.Faturado]: TipoPaletaCorEnum.Primary,
  [PedidoStatus.EmEntrega]: TipoPaletaCorEnum.Info,
  [PedidoStatus.Entregue]: TipoPaletaCorEnum.Success,
  [PedidoStatus.Cancelado]: TipoPaletaCorEnum.Error,
}

export const PedidoStatusLabel: Record<PedidoStatus, string> = {
  [PedidoStatus.EmAberto]: 'Em aberto',
  [PedidoStatus.Faturado]: 'Faturado',
  [PedidoStatus.EmEntrega]: 'Em entrega',
  [PedidoStatus.Entregue]: 'Entregue',
  [PedidoStatus.Cancelado]: 'Cancelado',
}
