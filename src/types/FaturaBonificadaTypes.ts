export enum FaturaBonificadaColumnField {
  DataDeCriacao = 'dataDeCriacao',
  NomeUsuario = 'nomeUsuario',
  NumeroFatura = 'numeroFatura',
  NumeroPedido = 'numeroPedido',
  Total = 'total',
}

export interface FaturaBonificada {
  id: string
  numeroFatura: number
  numeroPedido?: number
  nomeUsuario: string
  total: number
  status: number
  dataDeCriacao: string
  dataDeFechamento?: string
  quitada: boolean
}
