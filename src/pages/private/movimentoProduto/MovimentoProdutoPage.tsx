import type { ICellRendererParams } from 'ag-grid-community'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  TipoMovimentacaoProdutoEnum,
  TipoMovimentacaoProdutoLabel,
  type MovimentoProduto,
} from '../../../types/EstoqueTypes'

const MovimentoProdutoTable = { Name: 'movimentacao-de-produto' } as const

const MovimentoProdutoColumnField = {
  Peso: 'peso',
  Produto: 'produto',
  QuantidadeMovimentada: 'quantidadeMovimentada',
  Tamanho: 'tamanho',
  TipoMovimentacaoDeProduto: 'tipoMovimentacaoDeProduto',
} as const

export function MovimentoProdutoPage() {
  const { cores } = useThemeApp()
  const columns: TypeColumns[] = [
    { field: MovimentoProdutoColumnField.Produto, headerName: 'Produto', flex: 1, minWidth: 220 },
    { field: MovimentoProdutoColumnField.Peso, headerName: 'Peso', minWidth: 160 },
    { field: MovimentoProdutoColumnField.Tamanho, headerName: 'Tamanho', minWidth: 160 },
    {
      field: MovimentoProdutoColumnField.QuantidadeMovimentada,
      headerName: 'Quantidade movimentada',
      minWidth: 210,
      sortable: true,
    },
    {
      field: MovimentoProdutoColumnField.TipoMovimentacaoDeProduto,
      headerName: 'Tipo de movimentação',
      minWidth: 210,
      cellRenderer: ({ data }: ICellRendererParams<MovimentoProduto>) => data && (
        <BadgeApp
          cor={data.tipoMovimentacaoDeProduto === TipoMovimentacaoProdutoEnum.Entrada
            ? cores.success
            : cores.error}
          texto={TipoMovimentacaoProdutoLabel[data.tipoMovimentacaoDeProduto]}
          width="90px"
        />
      ),
    },
  ]

  return (
    <TableIndex
      columns={columns}
      desabilitarColunaAtivo
      orderBy='numero'
      nomeDaTabela={MovimentoProdutoTable.Name}
      url={ApiRoutePath.MovimentoProduto}
      urlAdd={PrivateRoutePath.MovimentoProdutoAdicionar}
    />
  )
}
