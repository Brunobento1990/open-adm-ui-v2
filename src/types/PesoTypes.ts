export enum PesoFormField {
  Numero = 'numero',
  AlturaReal = 'alturaReal',
  ComprimentoReal = 'comprimentoReal',
  Descricao = 'descricao',
  LarguraReal = 'larguraReal',
  PesoReal = 'pesoReal',
}

export interface Peso {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao?: string
  numero: number
  descricao: string
  pesoReal?: number
  alturaReal?: number
  larguraReal?: number
  comprimentoReal?: number
  ativo: boolean
}

export type PesoPayload = Partial<Peso>
