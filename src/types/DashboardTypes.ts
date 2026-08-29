import type { ComandaStatus } from './ComandaTypes'

export interface DashboardComandaAberta {
  id: string
  numero: number
  identificacao: string
  quantidadeClientes: number
  valorTotal: number
  status: ComandaStatus
  dataDeCadastro: string
}

export interface DashboardComandaPorStatus {
  status: ComandaStatus | number | string
  quantidade: number
}

export interface DashboardProdutoConsumido {
  produtoId: string
  descricao: string
  urlFoto?: string | null
  quantidade: number
  valorTotal: number
}

export interface DashboardEstoqueBaixo {
  produtoId: string
  nome: string
  quantidadeAtual: number
  estoqueMinimo?: number | null
}

export interface Dashboard {
  comandasAbertas: number
  valorEmAberto: number
  finalizadasHoje: number
  vendasNoMes: number
  comandasRecentes: DashboardComandaAberta[]
  comandasPorStatus: DashboardComandaPorStatus[]
  produtosMaisConsumidos: DashboardProdutoConsumido[]
  estoqueBaixo?: DashboardEstoqueBaixo[] | null
}
