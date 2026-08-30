import type { Produto } from './ProdutoTypes'
import type { Peso } from './PesoTypes'
import type { Tamanho } from './TamanhoTypes'

export enum TipoMovimentacaoProdutoEnum {
  Entrada = 0,
  Saida = 1,
}

export const TipoMovimentacaoProdutoLabel: Record<TipoMovimentacaoProdutoEnum, string> = {
  [TipoMovimentacaoProdutoEnum.Entrada]: 'Entrada',
  [TipoMovimentacaoProdutoEnum.Saida]: 'Saída',
}

export const TipoMovimentacaoProdutoOptions = [
  {
    label: TipoMovimentacaoProdutoLabel[TipoMovimentacaoProdutoEnum.Entrada],
    value: TipoMovimentacaoProdutoEnum.Entrada,
  },
  {
    label: TipoMovimentacaoProdutoLabel[TipoMovimentacaoProdutoEnum.Saida],
    value: TipoMovimentacaoProdutoEnum.Saida,
  },
]

export enum MovimentoProdutoFormField {
  Observacao = 'observacao',
  PesoId = 'pesoId',
  ProdutoId = 'produtoId',
  Quantidade = 'quantidade',
  TamanhoId = 'tamanhoId',
  TipoMovimentacaoDeProduto = 'tipoMovimentacaoDeProduto',
}

export interface MovimentoProdutoFormValues {
  produtoId: string
  produto?: Produto
  tamanhoId?: string
  tamanho?: Tamanho
  pesoId?: string
  peso?: Peso
  quantidade: number
  observacao?: string
  tipoMovimentacaoDeProduto: TipoMovimentacaoProdutoEnum
}

export interface MovimentoProduto {
  id: string
  numero: number
  dataDeCriacao: string
  dataDeAtualizacao?: string
  produto?: string
  tamanho?: string
  peso?: string
  quantidadeMovimentada: number
  tipoMovimentacaoDeProduto: TipoMovimentacaoProdutoEnum
}

export enum EstoqueFormField {
  Peso = 'peso',
  PesoId = 'pesoId',
  Produto = 'produto',
  ProdutoId = 'produtoId',
  Quantidade = 'quantidade',
  Tamanho = 'tamanho',
  TamanhoId = 'tamanhoId',
}

export interface Estoque {
  id: string
  numero: number
  dataDeCriacao: string
  dataDeAtualizacao?: string
  produtoId: string
  produto?: string
  categoria?: string
  foto?: string
  pesoId?: string
  peso?: string
  tamanhoId?: string
  tamanho?: string
  quantidade: number
  quantidadeDisponivel: number
  quantidadeReservada: number
}

export interface EstoqueFiltro {
  produtoId?: string
  produto?: Produto
  pesoId?: string
  peso?: Peso
  tamanhoId?: string
  tamanho?: Tamanho
}
