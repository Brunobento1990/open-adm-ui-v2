import { Avatar, Stack } from '@mui/material'
import type { ICellRendererParams } from 'ag-grid-community'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp } from '../../../components/TextApp/TextApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import type { Estoque } from '../../../types/EstoqueTypes'

const EstoqueTable = {
  Name: 'estoque',
} as const

const EstoqueColumnField = {
  Categoria: 'produto.categoria.descricao',
  Produto: 'produto.descricao',
  Referencia: 'produto.referencia',
  Quantidade: 'quantidade',
} as const

export function EstoquePage() {
  const columns: TypeColumns[] = [
    {
      field: EstoqueColumnField.Produto,
      headerName: 'Produto',
      flex: 1,
      minWidth: 220,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<Estoque>) => data?.produto && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar
            alt={data.produto.descricao}
            src={data.produto.urlFoto}
            sx={{ height: 30, width: 30 }}
          />
          <TextApp>{data.produto.descricao}</TextApp>
        </Stack>
      ),
    },
    {
      field: EstoqueColumnField.Categoria,
      headerName: 'Categoria',
      minWidth: 180,
      sortable: true,
    },
    {
      field: EstoqueColumnField.Referencia,
      headerName: 'Referência',
      minWidth: 160,
      sortable: true,
    },
    {
      field: EstoqueColumnField.Quantidade,
      headerName: 'Quantidade',
      minWidth: 140,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      desabilitarColunaAtivo
      nomeDaTabela={EstoqueTable.Name}
      url={ApiRoutePath.Estoque}
      urlEdit={PrivateRoutePath.EstoqueMovimentacao}
    />
  )
}
