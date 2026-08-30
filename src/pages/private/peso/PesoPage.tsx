import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { PesoFormField } from '../../../types/PesoTypes'

const PesoTable = {
  Name: 'pesos',
} as const

export function PesoPage() {
  const columns: TypeColumns[] = [
    {
      field: PesoFormField.Numero,
      headerName: 'N.',
      minWidth: 10,
      sortable: true,
    },
    {
      field: PesoFormField.Descricao,
      headerName: 'Descrição',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: PesoFormField.PesoReal,
      headerName: 'Peso real (kg)',
      minWidth: 150,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={PesoTable.Name}
      orderBy={PesoFormField.Numero}
      url={ApiRoutePath.Peso}
      urlAdd={PrivateRoutePath.PesoAdicionar}
      urlEdit={PrivateRoutePath.PesoEditar}
      urlView={PrivateRoutePath.PesoVisualizar}
    />
  )
}
