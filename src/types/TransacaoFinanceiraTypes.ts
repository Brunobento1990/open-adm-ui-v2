export enum TipoTransacaoFinanceira {
  Entrada = 1,
  Saida = 2,
}

export const TipoTransacaoFinanceiraLabel: Record<TipoTransacaoFinanceira, string> = {
  [TipoTransacaoFinanceira.Entrada]: 'Entrada',
  [TipoTransacaoFinanceira.Saida]: 'Saída',
}

export enum TransacaoFinanceiraFiltroField {
  DataFinal = 'dataFinal',
  DataInicial = 'dataInicial',
}

export interface TransacaoFinanceiraFiltro {
  dataInicial: string
  dataFinal: string
  clienteId?: string
  pedidoId?: string
}

interface TransacaoUsuario {
  nome?: string
}

interface TransacaoFatura {
  usuario?: TransacaoUsuario
}

interface TransacaoParcela {
  fatura?: TransacaoFatura
}

export interface TransacaoFinanceira {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao?: string
  numero: number
  parcelaId?: string
  parcela?: TransacaoParcela
  dataDeEfetivacao: string
  valor: number
  tipoTransacaoFinanceira: TipoTransacaoFinanceira
  meioDePagamento?: number
  observacao?: string
  ehEstorno: boolean
}

export interface ExtratoFinanceiroDia {
  transacoes: TransacaoFinanceira[]
  total: number
}

export type ExtratoFinanceiro = Record<string, ExtratoFinanceiroDia>
