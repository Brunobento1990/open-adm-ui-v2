import type { ICellRendererParams } from 'ag-grid-community'
import { TabelaComDrag } from '../../../components/Tabela/TabelaComDrag'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import type { RelatorioPedidoItem } from '../../../types/PedidoTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney, formatNumber } from '../../../utils/moneyUtils'

const RelatorioPedidoColumn = {
  Data: 'dataDeCriacao',
  Numero: 'numero',
  QuantidadeItens: 'quantidadeItens',
  Usuario: 'usuario',
  ValorTotal: 'valorTotal',
} as const

export function RelatorioPedidoItensTable({ itens }: { itens: RelatorioPedidoItem[] }) {
  const columns: TypeColumns[] = [
    { field: RelatorioPedidoColumn.Numero, headerName: 'Pedido', width: 110 },
    {
      field: RelatorioPedidoColumn.Data,
      headerName: 'Data',
      width: 180,
      cellRenderer: ({ data }: ICellRendererParams<RelatorioPedidoItem>) =>
        formatarDataHoraUtcLocal(data?.dataDeCriacao),
    },
    { field: RelatorioPedidoColumn.Usuario, headerName: 'Cliente', flex: 1, minWidth: 220 },
    {
      field: RelatorioPedidoColumn.QuantidadeItens,
      headerName: 'Itens',
      width: 110,
      cellRenderer: ({ data }: ICellRendererParams<RelatorioPedidoItem>) =>
        formatNumber(data?.quantidadeItens ?? 0),
    },
    {
      field: RelatorioPedidoColumn.ValorTotal,
      headerName: 'Total',
      width: 150,
      cellRenderer: ({ data }: ICellRendererParams<RelatorioPedidoItem>) => (
        <TextApp color="success.main" weight={TextAppWeight.SemiBold}>
          {formatMoney(data?.valorTotal ?? 0)}
        </TextApp>
      ),
    },
  ]

  return <TabelaComDrag columns={columns} height={'100%'} rows={itens} />
}
