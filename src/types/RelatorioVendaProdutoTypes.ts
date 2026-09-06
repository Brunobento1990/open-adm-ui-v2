export enum TipoRelatorioVendaProduto {
  UltimosSeteDias = 1,
  UltimosTrintaDias = 2,
  UltimosNoventaDias = 3,
}

export enum RelatorioVendaProdutoFormField {
  Asc = 'asc',
  DataFinal = 'dataFinal',
  DataInicial = 'dataInicial',
  Tipo = 'tipo',
}

export type RelatorioVendaProdutoFormValues = {
  asc: boolean
  dataFinal?: string
  dataInicial?: string
  skip: number
  tipo?: TipoRelatorioVendaProduto
}

export type RelatorioVendaProdutoPayload = Omit<
  RelatorioVendaProdutoFormValues,
  'dataFinal' | 'dataInicial'
> & {
  dataFinal: string | null
  dataInicial: string | null
}

export type RelatorioVendaProdutoItem = {
  id: string
  descricao: string
  foto?: string
  peso?: string
  tamanho?: string
  quantidade: number
  valorTotal: number
}

export type RelatorioVendaProdutoResponse = {
  dados: RelatorioVendaProdutoItem[]
  totalPagina: number
  totais: {
    quantidadeTotal: number
    valorTotal: number
  }
}
