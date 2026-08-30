export enum CategoriaFormField {
  Descricao = 'descricao',
  Foto = 'foto',
  InativoEcommerce = 'inativoEcommerce',
  NovaFoto = 'novaFoto',
}

export enum CategoriaFiltroField {
  Descricao = 'descricao',
  Ativo = 'ativo',
  Pagina = 'pagina',
  QuantidadePorPagina = 'quantidadePorPagina',
}

export interface Categoria {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao?: string
  numero: number
  descricao: string
  ativo: boolean
  foto?: string
  novaFoto?: string
  inativoEcommerce: boolean
}

export type CategoriaPayload = Partial<Categoria>
