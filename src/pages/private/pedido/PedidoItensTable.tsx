import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { TabelaComDrag } from '../../../components/Tabela/TabelaComDrag'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import type { PedidoItemForm } from '../../../types/PedidoTypes'
import { formatMoney } from '../../../utils/moneyUtils'

const PedidoItemTableField = {
  Excluir: 'excluir',
  Foto: 'foto',
  Produto: 'produto',
  Quantidade: 'quantidade',
  Total: 'total',
  Variacao: 'variacao',
  ValorUnitario: 'valorUnitario',
} as const

type PedidoItensTableProps = {
  itens: PedidoItemForm[]
  onRemove: (index: number) => void
}

export function PedidoItensTable({ itens, onRemove }: PedidoItensTableProps) {
  const columns: TypeColumns[] = [
    {
      field: PedidoItemTableField.Produto,
      headerName: 'Produto',
      flex: 1,
      minWidth: 200,
      cellRenderer: ({ data }: any) => data?.produto?.descricao ?? '-',
    },
    {
      field: PedidoItemTableField.Variacao,
      headerName: 'Peso/Tamanho',
      minWidth: 160,
      cellRenderer: ({ data }: any) => data?.tamanho?.descricao ?? data?.peso?.descricao ?? '-',
    },
    { field: PedidoItemTableField.Quantidade, headerName: 'Qtd.', width: 100 },
    {
      field: PedidoItemTableField.ValorUnitario,
      headerName: 'Valor unitário',
      width: 150,
      cellRenderer: ({ data }: any) => formatMoney(data?.valorUnitario ?? 0),
    },
    {
      field: PedidoItemTableField.Total,
      headerName: 'Total',
      width: 140,
      cellRenderer: ({ data }: any) => (
        <TextApp color="success.main" weight={TextAppWeight.SemiBold}>
          {formatMoney((data?.valorUnitario ?? 0) * (data?.quantidade ?? 0))}
        </TextApp>
      ),
    },
    {
      field: PedidoItemTableField.Excluir,
      headerName: 'Excluir',
      width: 90,
      sortable: false,
      cellRenderer: ({ data }: any) =>
        data && (
          <IconButtonComTolltip
            aria-label="Excluir item"
            color="error"
            onClick={() => onRemove(data.key)}
            tooltip="Excluir item"
          >
            <IconApp icon="solar:trash-bin-trash-bold" />
          </IconButtonComTolltip>
        ),
    },
  ]

  return (
    <TabelaComDrag
      columns={columns}
      height={'100%'}
      rows={itens.map((item, key) => ({ ...item, key }))}
    />
  )
}
