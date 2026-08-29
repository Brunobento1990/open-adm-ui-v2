import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { TabelaDePrecoFormField } from '../../../types/TabelaDePrecoTypes'

const TabelaDePrecoTable = {
  Name: 'tabelas-de-preco',
} as const

export function TabelaDePrecoPage() {
  const columns: TypeColumns[] = [
    {
      field: TabelaDePrecoFormField.Descricao,
      headerName: 'Descrição',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={TabelaDePrecoTable.Name}
      orderBy={TabelaDePrecoFormField.Descricao}
      url={ApiRoutePath.TabelaDePreco}
      urlAdd={PrivateRoutePath.TabelaDePrecoAdicionar}
      urlEdit={PrivateRoutePath.TabelaDePrecoEditar}
      urlView={PrivateRoutePath.TabelaDePrecoVisualizar}
    />
  )
}
