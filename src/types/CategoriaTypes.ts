export enum CategoriaFormField {
  Descricao = 'descricao',
}

export enum CategoriaFiltroField {
  Descricao = 'descricao',
  Ativo = 'ativo',
  Pagina = 'pagina',
  QuantidadePorPagina = 'quantidadePorPagina',
}

export interface Categoria {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao?: string
  descricao: string
  ativo: boolean
}
