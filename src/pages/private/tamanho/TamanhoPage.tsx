import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { TamanhoFormField } from '../../../types/TamanhoTypes'

const TamanhoTable = { Name: 'tamanhos' } as const

export function TamanhoPage() {
  const columns: TypeColumns[] = [
    {
      field: TamanhoFormField.Numero,
      headerName: 'N.',
      minWidth: 10,
      sortable: true,
    },
    {
      field: TamanhoFormField.Descricao,
      headerName: 'Descrição',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: TamanhoFormField.PesoReal,
      headerName: 'Peso real (kg)',
      minWidth: 150,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={TamanhoTable.Name}
      orderBy={TamanhoFormField.Numero}
      url={ApiRoutePath.Tamanho}
      urlAdd={PrivateRoutePath.TamanhoAdicionar}
      urlEdit={PrivateRoutePath.TamanhoEditar}
      urlView={PrivateRoutePath.TamanhoVisualizar}
    />
  )
}
