import { Avatar } from '@mui/material'
import type { ICellRendererParams } from 'ag-grid-community'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import type { Produto } from '../../../types/ProdutoTypes'

const ProdutoTable = {
  Name: 'produtos',
} as const

const ProdutoColumnField = {
  Categoria: 'categoria.descricao',
  Descricao: 'descricao',
  Foto: 'urlFoto',
  Referencia: 'referencia',
} as const

export function ProdutoPage() {
  const columns: TypeColumns[] = [
    {
      field: ProdutoColumnField.Foto,
      headerName: 'Foto',
      width: 80,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<Produto>) => data?.urlFoto && (
        <Avatar alt={data.descricao} src={data.urlFoto} sx={{ height: 30, width: 30 }} />
      ),
    },
    {
      field: ProdutoColumnField.Descricao,
      headerName: 'Descrição',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: ProdutoColumnField.Referencia,
      headerName: 'Referência',
      minWidth: 140,
      sortable: true,
    },
    {
      field: ProdutoColumnField.Categoria,
      headerName: 'Categoria',
      minWidth: 180,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={ProdutoTable.Name}
      orderBy={ProdutoColumnField.Descricao}
      url={ApiRoutePath.Produto}
      urlAdd={PrivateRoutePath.ProdutoAdicionar}
      urlEdit={PrivateRoutePath.ProdutoEditar}
      urlView={PrivateRoutePath.ProdutoVisualizar}
    />
  )
}
