import type { Produto } from './ProdutoTypes'

export enum TabelaDePrecoFormField {
  Descricao = 'descricao',
  Itens = 'itens',
}

export enum TabelaDePrecoItemFormField {
  Preco = 'preco',
  Produto = 'produto',
  ProdutoId = 'produtoId',
}

export interface EntidadeEmpresaBase {
  id: string
  empresaId: string
  dataDeCadastro: string
  dataDeAtualizacao?: string
  ativo: boolean
}

export interface TabelaDePrecoItem {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao?: string
  tabelaDePrecoId: string
  produtoId: string
  produto: Produto
  preco: number
}

export interface TabelaDePrecoItemPedido {
  id: string
  tabelaDePrecoId: string
  produtoId: string
  produto?: Produto
  pesoId?: string | null
  tamanhoId?: string | null
  valorUnitarioAtacado: number
  valorUnitarioVarejo: number
}

export interface TabelaDePreco extends EntidadeEmpresaBase {
  descricao: string
  itens: TabelaDePrecoItem[]
  itensTabelaDePreco?: TabelaDePrecoItemPedido[]
}
