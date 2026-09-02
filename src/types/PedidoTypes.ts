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

export const PedidoStatusOptions = Object.values(PedidoStatus)
  .filter((status): status is PedidoStatus => typeof status === 'number')
  .map((status) => ({ label: PedidoStatusLabel[status], value: status }))

export enum PedidoStatusFiltro {
  Todos = -1,
}

export enum PedidoColumnField {
  Acoes = 'acoes',
  Baixar = 'baixar',
  Cadastro = 'dataDeCriacao',
  Cliente = 'usuario',
  Estoque = 'temEstoqueDisponivel',
  Financeiro = 'financeiro',
  Numero = 'numero',
  Status = 'statusPedido',
}

export interface PedidoPaginacao {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao: string
  numero: number
  statusPedido: PedidoStatus
  valorTotal: number
  totalItens: number
  totalAReceber: number
  porcentagemEstoqueAtendido: number
  usuario?: string
  temEstoqueDisponivel: boolean
}

export type PedidoFiltros = {
  statusPedido: PedidoStatus | PedidoStatusFiltro
}
