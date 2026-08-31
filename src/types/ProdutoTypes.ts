import type { Categoria } from './CategoriaTypes'
import type { Peso } from './PesoTypes'
import type { Tamanho } from './TamanhoTypes'

export enum ProdutoFormField {
  CategoriaId = 'categoriaId',
  Descricao = 'descricao',
  EspecificacaoTecnica = 'especificacaoTecnica',
  NovaFoto = 'novaFoto',
  Peso = 'peso',
  Pesos = 'pesos',
  Referencia = 'referencia',
  Tamanhos = 'tamanhos',
  VendaSomenteComEstoqueDisponivel = 'vendaSomenteComEstoqueDisponivel',
}

export interface Produto {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao?: string
  numero: number
  descricao: string
  especificacaoTecnica?: string
  foto?: string
  novaFoto?: string
  tamanhos: Tamanho[]
  pesos: Peso[]
  referencia?: string
  peso?: number
  categoriaId: string
  categoria: Categoria
  ativo: boolean
  inativoEcommerce: boolean
  vendaSomenteComEstoqueDisponivel: boolean
}

export interface ProdutoTabelaDePrecoItem {
  id?: string
  produtoId?: string
  pesoId?: string
  tamanhoId?: string
  valorUnitarioAtacado: number
  valorUnitarioVarejo: number
}

export interface ProdutoTabelaDePreco {
  id: string
  descricao: string
  itensTabelaDePreco: ProdutoTabelaDePrecoItem[]
}

export interface ProdutoPayload {
  id?: string
  descricao?: string
  novaFoto?: string
  especificacaoTecnica?: string
  referencia?: string
  categoriaId?: string
  tabelaDePrecoId?: string
  tamanhosIds: string[]
  pesosIds: string[]
  vendaSomenteComEstoqueDisponivel: boolean
  itensTabelaDePreco: ProdutoTabelaDePrecoItem[]
}
