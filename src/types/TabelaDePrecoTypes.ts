import type { Peso } from './PesoTypes'
import type { Produto } from './ProdutoTypes'
import type { Tamanho } from './TamanhoTypes'

export enum TabelaDePrecoFormField {
  AtivaEcommerce = 'ativaEcommerce',
  Descricao = 'descricao',
  ItensTabelaDePreco = 'itensTabelaDePreco',
}

export enum TabelaDePrecoItemFormField {
  Peso = 'peso',
  PesoId = 'pesoId',
  Produto = 'produto',
  ProdutoId = 'produtoId',
  Tamanho = 'tamanho',
  TamanhoId = 'tamanhoId',
  ValorUnitarioAtacado = 'valorUnitarioAtacado',
  ValorUnitarioVarejo = 'valorUnitarioVarejo',
}

export interface EntidadeEmpresaBase {
  id: string
  empresaId?: string
  dataDeCriacao?: string
  dataDeAtualizacao?: string
  ativo?: boolean
}

export interface TabelaDePrecoItem {
  id?: string
  tabelaDePrecoId?: string
  produtoId: string
  produto?: Produto
  pesoId?: string | null
  peso?: Peso
  tamanhoId?: string | null
  tamanho?: Tamanho
  valorUnitarioAtacado: number
  valorUnitarioVarejo: number
}

export interface TabelaDePreco extends EntidadeEmpresaBase {
  descricao: string
  ativaEcommerce: boolean
  itensTabelaDePreco: TabelaDePrecoItem[]
}

export type TabelaDePrecoCabecalhoValues = Pick<TabelaDePreco, 'ativaEcommerce' | 'descricao'>

export type CriarTabelaDePrecoPayload = TabelaDePrecoCabecalhoValues & {
  itensTabelaDePreco: Array<
    Omit<TabelaDePrecoItem, 'id' | 'peso' | 'produto' | 'tabelaDePrecoId' | 'tamanho'>
  >
}

export type AtualizarTabelaDePrecoPayload = TabelaDePrecoCabecalhoValues & { id: string }

export type SalvarTabelaDePrecoItemPayload = Omit<
  TabelaDePrecoItem,
  'peso' | 'produto' | 'tamanho'
> & {
  tabelaDePrecoId: string
}

export type TabelaDePrecoItemFormValues = TabelaDePrecoItem

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
