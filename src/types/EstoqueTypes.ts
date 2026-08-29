import type { Produto } from './ProdutoTypes'

export enum TipoMovimentacaoEstoqueEnum {
  Entrada = 1,
  Saida = 2,
}

export const TipoMovimentacaoEstoqueLabel: Record<TipoMovimentacaoEstoqueEnum, string> = {
  [TipoMovimentacaoEstoqueEnum.Entrada]: 'Entrada',
  [TipoMovimentacaoEstoqueEnum.Saida]: 'Saída',
}

export const TipoMovimentacaoEstoqueOptions = [
  {
    label: TipoMovimentacaoEstoqueLabel[TipoMovimentacaoEstoqueEnum.Entrada],
    value: TipoMovimentacaoEstoqueEnum.Entrada,
  },
  {
    label: TipoMovimentacaoEstoqueLabel[TipoMovimentacaoEstoqueEnum.Saida],
    value: TipoMovimentacaoEstoqueEnum.Saida,
  },
]

export enum TipoMovimentacaoEstoqueIconeEnum {
  Entrada = 'solar:arrow-up-linear',
  Saida = 'solar:arrow-down-linear',
}

export enum TipoMovimentacaoEstoqueCorEnum {
  Entrada = 'success',
  Saida = 'error',
}

export enum EstoqueFormField {
  ProdutoId = 'produtoId',
  Quantidade = 'quantidade',
}

export enum MovimentacaoEstoqueManualFormField {
  ProdutoId = 'produtoId',
  Quantidade = 'quantidade',
  TipoMovimentacaoEstoque = 'tipoMovimentacaoEstoque',
}

export interface MovimentacaoEstoqueManualFormValues {
  produtoId: string
  produto?: Produto
  quantidade: number
  tipoMovimentacaoEstoque: TipoMovimentacaoEstoqueEnum
}

export interface Estoque {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao?: string
  produtoId: string
  produto: Produto
  quantidade: number
}

export interface MovimentacaoEstoque {
  id: string
  dataDeCadastro: string
  estoqueId: string
  estoque: Estoque
  quantidade: number
  tipoMovimentacao: TipoMovimentacaoEstoqueEnum
}
