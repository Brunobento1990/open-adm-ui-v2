export enum TipoFatura {
  APagar = 1,
  AReceber = 2,
}

export enum StatusParcela {
  Pendente = 1,
  PagoParcial = 2,
  Pago = 3,
  Vencida = 4,
}

export enum StatusParcelaFiltro {
  Todos = '',
}

export const FaturaColumnField = {
  Acoes: 'acoes',
  NumeroFatura: 'numeroFatura',
  NumeroDaParcela: 'numeroDaParcela',
  NumeroPedido: 'numeroPedido',
  NomeUsuario: 'nomeUsuario',
  Valor: 'valor',
  ValorPagoRecebidoLiquido: 'valorPagoRecebidoLiquido',
  DescontoConcedido: 'descontoConcedido',
  ValorAPagarAReceber: 'valorAPagarAReceber',
  Vencimento: 'vencimento',
  Status: 'status',
} as const

export type ParcelaPaginacao = {
  id: string
  numeroFatura: number
  numeroDaParcela: number
  numeroPedido?: number | null
  nomeUsuario?: string | null
  valor: number
  status: StatusParcela
  valorPagoRecebido: number
  valorPagoRecebidoLiquido: number
  descontoConcedido: number
  valorAPagarAReceber: number
  vencimento: string
  quitada: boolean
}

export type FaturaFiltros = {
  dataVencimentoInicial?: string
  dataVencimentoFinal?: string
  status: StatusParcela | StatusParcelaFiltro.Todos
}
