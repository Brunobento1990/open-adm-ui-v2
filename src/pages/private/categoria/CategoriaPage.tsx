import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'

const CategoriaTable = {
  Name: 'categorias',
} as const

export function CategoriaPage() {
  const columns: TypeColumns[] = [
    {
      field: 'descricao',
      headerName: 'Descrição',
      flex: 1,
      minWidth: 180,
      sortable: true,
    },
  ]

  return (
      <TableIndex
        columns={columns}
        nomeDaTabela={CategoriaTable.Name}
        orderBy="descricao"
        url={ApiRoutePath.Categoria}
        urlAdd={PrivateRoutePath.CategoriaAdicionar}
        urlEdit={PrivateRoutePath.CategoriaEditar}
        urlView={PrivateRoutePath.CategoriaVisualizar}
      />
  )
}
