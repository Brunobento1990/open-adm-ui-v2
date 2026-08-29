import type { PedidoStatus } from './PedidoTypes'

export interface ClienteUltimoPedido {
  usuarioId: string
  nome: string
  cpfCnpj: string
  telefone: string
  pedidoId?: string
  dataDoUltimoPedido?: string
  total?: number
  numeroDoPedido?: number
  statusPedido?: PedidoStatus
}

export interface ClienteUltimoPedidoPaginacao {
  dados: ClienteUltimoPedido[]
  totalPagina: number
}
