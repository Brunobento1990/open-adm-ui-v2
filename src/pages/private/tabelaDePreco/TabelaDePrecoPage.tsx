import { ApiRoutePath } from '../../../api/apiRoutes'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type {
  TableCellRendererParams,
  TypeColumns,
} from '../../../components/Tabela/tabelaComDragTypes'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { TabelaDePrecoFormField, type TabelaDePreco } from '../../../types/TabelaDePrecoTypes'

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
    {
      field: TabelaDePrecoFormField.AtivaEcommerce,
      headerName: 'Ativa ecommerce',
      width: 160,
      sortable: true,
      cellRenderer: ({ data }: TableCellRendererParams<TabelaDePreco>) => (
        <InputApp
          checked={Boolean(data?.ativaEcommerce)}
          disabled
          id={`ativa-${data?.id}`}
          label=""
          type={InputAppType.Checkbox}
        />
      ),
    },
  ]

  return (
    <TableIndex
      columns={columns}
      desabilitarColunaAtivo
      nomeDaTabela={TabelaDePrecoTable.Name}
      orderBy={TabelaDePrecoFormField.Descricao}
      url={ApiRoutePath.TabelaDePreco}
      urlAdd={PrivateRoutePath.TabelaDePrecoAdicionar}
      urlEdit={PrivateRoutePath.TabelaDePrecoEditar}
      urlView={PrivateRoutePath.TabelaDePrecoVisualizar}
    />
  )
}
