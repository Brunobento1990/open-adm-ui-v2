export enum MensalidadeColumnField {
  DataDeVencimento = 'dataDeVencimento',
  Referente = 'referente',
  Status = 'status',
  Valor = 'valor',
  ValorPago = 'valorPago',
}

export const MensalidadeStatus = {
  Pago: 'Pago',
  Pendente: 'Pendente',
  Vencido: 'Vencido',
} as const

export interface MensalidadePix {
  qrCode?: string
  copiaECola?: string
}

export interface Mensalidade {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao?: string
  numero: number
  dataDeVencimento: string
  dataDePagamento?: string
  mesCobranca: number
  anoCobranca: number
  valor: number
  valorPago: number
  pago: boolean
  vencido: boolean
  pix?: MensalidadePix
}
