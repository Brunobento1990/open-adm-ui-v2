import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { ClienteFormField } from '../../../types/ClienteTypes'

const ClienteTable = {
  Name: 'clientes',
} as const

export function ClientePage() {
  const columns: TypeColumns[] = [
    {
      field: ClienteFormField.Nome,
      headerName: 'Nome',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: ClienteFormField.Cpf,
      headerName: 'CPF',
      minWidth: 150,
      sortable: true,
    },
    {
      field: ClienteFormField.Telefone,
      headerName: 'Telefone',
      minWidth: 160,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={ClienteTable.Name}
      orderBy={ClienteFormField.Nome}
      url={ApiRoutePath.Cliente}
      urlAdd={PrivateRoutePath.ClienteAdicionar}
      urlEdit={PrivateRoutePath.ClienteEditar}
      urlView={PrivateRoutePath.ClienteVisualizar}
    />
  )
}
