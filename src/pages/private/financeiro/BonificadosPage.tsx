import type { ICellRendererParams } from 'ag-grid-community'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import {
  FaturaBonificadaColumnField,
  type FaturaBonificada,
} from '../../../types/FaturaBonificadaTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney } from '../../../utils/moneyUtils'

const BonificadosTable = {
  Name: 'bonificados',
} as const

export function BonificadosPage() {
  const columns: TypeColumns[] = [
    {
      field: FaturaBonificadaColumnField.NumeroFatura,
      headerName: 'Nº fatura',
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<FaturaBonificada>) =>
        data ? `#${data.numeroFatura}` : '',
    },
    {
      field: FaturaBonificadaColumnField.NumeroPedido,
      headerName: 'Nº pedido',
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<FaturaBonificada>) =>
        data?.numeroPedido ? `#${data.numeroPedido}` : '',
    },
    {
      field: FaturaBonificadaColumnField.NomeUsuario,
      headerName: 'Cliente',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: FaturaBonificadaColumnField.Total,
      headerName: 'Valor',
      minWidth: 150,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<FaturaBonificada>) =>
        data ? formatMoney(data.total) : '',
    },
    {
      field: FaturaBonificadaColumnField.DataDeCriacao,
      headerName: 'Data',
      minWidth: 150,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<FaturaBonificada>) =>
        formatarDataHoraUtcLocal(data?.dataDeCriacao),
    },
  ]

  return (
    <TableIndex
      columns={columns}
      desabilitarColunaAtivo
      nomeDaTabela={BonificadosTable.Name}
      notBtnAdd
      orderBy={FaturaBonificadaColumnField.DataDeCriacao}
      url={ApiRoutePath.Bonificado}
    />
  )
}
