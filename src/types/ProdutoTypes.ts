import type { Categoria } from './CategoriaTypes'

export enum ProdutoFormField {
  CategoriaId = 'categoriaId',
  Descricao = 'descricao',
  PosicaoDeEstoque = 'posicaoDeEstoque',
  Referencia = 'referencia',
  UrlFoto = 'urlFoto',
}

export interface Produto {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao?: string
  descricao: string
  posicaoDeEstoque?: number
  referencia?: string
  urlFoto?: string
  categoriaId: string
  categoria: Categoria
  ativo: boolean
}
