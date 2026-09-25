import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { RepresentanteFormField } from '../../../types/RepresentanteTypes'

const RepresentanteTable = {
  Name: 'representantes',
} as const

function obterUrlParamsAlterarStatus(id: string, ativo: boolean) {
  return `/${encodeURIComponent(id)}/ativo/${ativo}`
}

export function RepresentantePage() {
  const columns: TypeColumns[] = [
    {
      field: RepresentanteFormField.Nome,
      headerName: 'Nome',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: RepresentanteFormField.Cpf,
      headerName: 'CPF',
      minWidth: 150,
      sortable: true,
    },
    {
      field: RepresentanteFormField.Email,
      headerName: 'E-mail',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: RepresentanteFormField.Telefone,
      headerName: 'Telefone',
      minWidth: 160,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={RepresentanteTable.Name}
      obterUrlParamsAlterarStatus={obterUrlParamsAlterarStatus}
      //orderBy={RepresentanteFormField.Nome}
      url={ApiRoutePath.Representante}
      urlAdd={PrivateRoutePath.RepresentanteAdicionar}
      urlEdit={PrivateRoutePath.RepresentanteEditar}
      urlView={PrivateRoutePath.RepresentanteVisualizar}
    />
  )
}
