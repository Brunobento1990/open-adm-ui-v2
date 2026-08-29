import type { Cliente } from './ClienteTypes'
import type { Empresa } from './EmpresaTypes'
import type { Produto } from './ProdutoTypes'
import type { TabelaDePreco } from './TabelaDePrecoTypes'
import type { Usuario } from './UsuarioTypes'

export enum ComandaStatus {
  Aberta = 1,
  AguardandoPagamento = 2,
  Fechada = 3,
  Cancelada = 4,
}

export const ComandaStatusLabel: Record<ComandaStatus, string> = {
  [ComandaStatus.Aberta]: 'Aberta',
  [ComandaStatus.AguardandoPagamento]: 'Aguardando pagamento',
  [ComandaStatus.Fechada]: 'Fechada',
  [ComandaStatus.Cancelada]: 'Cancelada',
}

export enum ComandaFormField {
  Identificacao = 'identificacao',
  TabelaDePrecoId = 'tabelaDePrecoId',
  TabelaDePreco = 'tabelaDePreco',
  Observacao = 'observacao',
  Desconto = 'desconto',
  Clientes = 'clientes',
  Itens = 'itens',
}

export interface ComandaItem {
  id?: string
  produtoId: string
  produto: Produto
  quantidade: number
  valorUnitario: number
  desconto: number
  valorTotal: number
}

export interface ComandaHistorico {
  id: string
  usuarioId: string
  usuario?: Usuario
  dataDeCadastro: string
  mensagem: string
}

export interface Comanda {
  id: string
  idPublico?: string | null
  dataDeCadastro: string
  dataDeAtualizacao?: string | null
  numero: number
  identificacao: string
  tabelaDePrecoId: string
  tabelaDePreco: TabelaDePreco
  status: ComandaStatus
  dataDeFechamento?: string | null
  dataDeCancelamento?: string | null
  observacao?: string | null
  desconto?: number
  valorTotal: number
  valorLiquido: number
  clientes: Cliente[]
  itens?: ComandaItem[]
  historicos?: ComandaHistorico[]
}

export interface ComandaCreateRequest {
  identificacao: string
  tabelaDePrecoId: string
  observacao?: string
  desconto?: number
  clientesIds: string[]
  itens: Array<Pick<ComandaItem, 'produtoId' | 'quantidade' | 'desconto'>>
}

export type ComandaUpdateRequest = Omit<ComandaCreateRequest, 'itens'>

export interface ComandaPublicaCliente {
  nome: string
  total: number
}

export interface ComandaPublicaConsumoGeral {
  total: number
  itens: ComandaItem[]
}

export interface ComandaPublica {
  empresa: Empresa
  comanda: Comanda
  divisaoClientes: ComandaPublicaCliente[]
  consumoGeral: ComandaPublicaConsumoGeral | null
}
