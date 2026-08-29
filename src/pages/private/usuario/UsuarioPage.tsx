import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { UsuarioFormField } from '../../../types/UsuarioTypes'

const UsuarioTable = {
  Name: 'usuarios',
} as const

export function UsuarioPage() {
  const columns: TypeColumns[] = [
    {
      field: UsuarioFormField.Nome,
      headerName: 'Nome',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: UsuarioFormField.Email,
      headerName: 'E-mail',
      flex: 1,
      minWidth: 240,
      sortable: true,
    },
    {
      field: UsuarioFormField.Cpf,
      headerName: 'CPF',
      minWidth: 150,
      sortable: true,
    },
    {
      field: UsuarioFormField.Telefone,
      headerName: 'Telefone',
      minWidth: 160,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={UsuarioTable.Name}
      orderBy={UsuarioFormField.Nome}
      url={ApiRoutePath.Usuario}
      urlAdd={PrivateRoutePath.UsuarioAdicionar}
      urlEdit={PrivateRoutePath.UsuarioEditar}
      urlView={PrivateRoutePath.UsuarioVisualizar}
    />
  )
}
