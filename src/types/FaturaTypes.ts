export enum TipoFatura {
  APagar = 1,
  AReceber = 2,
}

export enum MeioDePagamento {
  Dinheiro = 1,
  Pix = 2,
  CartaoDeDebito = 3,
  CartaoDeCredito = 4,
  Boleto = 5,
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

export const PagarParcelaFormField = {
  Valor: 'valor',
  Desconto: 'desconto',
  Juros: 'juros',
  MeioDePagamento: 'meioDePagamento',
  DataDePagamento: 'dataDePagamento',
  Observacao: 'observacao',
} as const

export type Parcela = {
  id: string
  dataDeVencimento: string
  numeroDaParcela: number
  valorPagoRecebido: number
  valorAPagarAReceber: number
  fatura: {
    numero: number
    tipo: TipoFatura
    usuario?: { nome?: string | null } | null
    pedido?: { numero?: number | null } | null
  }
}

export type PagarParcelaForm = {
  valor: number
  desconto?: number
  juros?: number
  meioDePagamento?: MeioDePagamento | string
  dataDePagamento?: string
  observacao?: string
}

export type PagarParcelaPayload = PagarParcelaForm & { id: string }

export type ParcelaCriar = {
  aVista: boolean
  dataDeVencimento: string
  numeroDaParcela: number
  meioDePagamento?: MeioDePagamento | string
  valor: number
  desconto?: number
  observacao?: string
}
export type FaturaCriarForm = {
  usuarioId: string
  usuario?: { id: string; nome: string }
  quantidadeDeParcelas: number
  total: number
  parcelas: ParcelaCriar[]
}
export type FaturaCriarPayload = { usuarioId: string; tipo: TipoFatura; parcelas: ParcelaCriar[] }
export const FaturaFormField = {
  Parcelas: 'parcelas',
  QuantidadeDeParcelas: 'quantidadeDeParcelas',
  Total: 'total',
  UsuarioId: 'usuarioId',
} as const
