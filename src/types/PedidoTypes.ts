import { TipoPaletaCorEnum } from './TipoPaletaCorEnum'
import type { ClienteVenda, EnderecoClienteVenda } from './ClienteVendaTypes'
import type { Peso } from './PesoTypes'
import type { Produto } from './ProdutoTypes'
import type { TabelaDePreco } from './TabelaDePrecoTypes'
import type { Tamanho } from './TamanhoTypes'

export enum PedidoFormField {
  EnderecoEntrega = 'enderecoEntrega',
  ItensPedido = 'itensPedido',
  TabelaDePrecoId = 'tabelaDePrecoId',
  UsuarioId = 'usuarioId',
}

export enum PedidoItemFormField {
  PesoId = 'pesoId',
  ProdutoId = 'produtoId',
  Quantidade = 'quantidade',
  TamanhoId = 'tamanhoId',
  ValorUnitario = 'valorUnitario',
}

export interface PedidoItemForm {
  produtoId?: string
  produto?: Produto
  pesoId?: string
  peso?: Peso
  tamanhoId?: string
  tamanho?: Tamanho
  quantidade?: number
  valorUnitario?: number
}

export interface PedidoFormValues {
  usuarioId?: string
  usuario?: ClienteVenda
  tabelaDePrecoId?: string
  tabelaDePreco?: TabelaDePreco
  itensPedido: PedidoItemForm[]
  enderecoEntrega?: EnderecoClienteVenda
}

export interface PedidoCriarPayload {
  usuarioId: string
  itensPedido: Array<{
    produtoId: string
    pesoId?: string
    tamanhoId?: string
    quantidade: number
    valorUnitario: number
  }>
  enderecoEntrega?: EnderecoClienteVenda
}

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

export enum PedidoItemColumnField {
  Estoque = 'estoqueDisponivel',
  PesoTamanho = 'pesoTamanho',
  Produto = 'produto',
  Quantidade = 'quantidade',
  ValorUnitario = 'valorUnitario',
}

type PedidoItemDescricao = {
  descricao?: string
}

export interface PedidoItem {
  id: string
  produtoId: string
  produto?: PedidoItemDescricao
  pesoId?: string
  peso?: PedidoItemDescricao
  tamanhoId?: string
  tamanho?: PedidoItemDescricao
  pedidoId: string
  valorUnitario: number
  quantidade: number
  valorTotal: number
  estoqueDisponivel: number
  temEstoqueDisponivel: boolean
}

export interface Pedido extends PedidoPaginacao {
  itensPedido: PedidoItem[]
}

export type PedidoAtualizarStatusPayload = Pick<Pedido, 'id' | 'statusPedido'>

export type PedidoCobranca = {
  id: string
  numero: number
  pedidoId: string
  total: number
  status: number
}

export type PedidoFiltros = {
  statusPedido: PedidoStatus | PedidoStatusFiltro
}

export enum RelatorioPedidoFormField {
  DataFinal = 'dataFinal',
  DataInicial = 'dataInicial',
  UsuarioId = 'usuarioId',
}

export type RelatorioPedidoFormValues = {
  dataInicial?: string
  dataFinal?: string
  usuarioId?: string
  usuario?: Pick<ClienteVenda, 'id' | 'nome'>
}

export type RelatorioPedidoPayload = {
  dataInicial?: string
  dataFinal?: string
  usuarioId?: string
}

export type RelatorioPedidoItem = {
  pedidoId: string
  numero: number
  usuarioId: string
  usuario: string
  quantidadeItens: number
  valorTotal: number
  dataDeCriacao: string
}

export type RelatorioPedidoTotais = {
  quantidadePedidos: number
  quantidadeItens: number
  valorTotal: number
}

export type RelatorioPedidoTotaisUsuario = RelatorioPedidoTotais & {
  usuarioId: string
  usuario: string
}

export type RelatorioPedidoListagem = {
  values: RelatorioPedidoItem[]
  totalDeRegistros: number
  totais: RelatorioPedidoTotais
  totaisPorUsuario: RelatorioPedidoTotaisUsuario[]
}
