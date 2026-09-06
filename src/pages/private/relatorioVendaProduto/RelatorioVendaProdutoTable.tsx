import type { ICellRendererParams } from 'ag-grid-community'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppComponent,
  BoxAppDisplay,
} from '../../../components/BoxApp/boxAppTypes'
import { IconApp } from '../../../components/Icon/IconApp'
import { TabelaComDrag } from '../../../components/Tabela/TabelaComDrag'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { RelatorioVendaProdutoItem } from '../../../types/RelatorioVendaProdutoTypes'
import { formatMoney, formatNumber } from '../../../utils/moneyUtils'

const RelatorioVendaProdutoColumn = {
  Descricao: 'descricao',
  Quantidade: 'quantidade',
  Variacao: 'variacao',
  ValorTotal: 'valorTotal',
} as const

export function RelatorioVendaProdutoTable({ itens }: { itens: RelatorioVendaProdutoItem[] }) {
  const { cores } = useThemeApp()
  const columns: TypeColumns[] = [
    {
      field: RelatorioVendaProdutoColumn.Descricao,
      headerName: 'Produto',
      flex: 1,
      minWidth: 240,
      cellRenderer: ({ data }: ICellRendererParams<RelatorioVendaProdutoItem>) =>
        data && (
          <BoxApp alignItems={BoxAppAlignItems.Center} display={BoxAppDisplay.Flex} gap={1}>
            {data.foto ? (
              <BoxApp
                alt={data.descricao}
                borderRadius={1}
                component={BoxAppComponent.Img}
                height={30}
                objectFit="cover"
                src={data.foto}
                width={30}
              />
            ) : (
              <IconApp color={cores.primary} icon="solar:box-linear" width="1.5rem" />
            )}
            <TextApp>{data.descricao}</TextApp>
          </BoxApp>
        ),
    },
    {
      field: RelatorioVendaProdutoColumn.Variacao,
      headerName: 'Peso/Tamanho',
      width: 180,
      valueGetter: ({ data }: { data?: RelatorioVendaProdutoItem }) =>
        data?.peso || data?.tamanho || '-',
    },
    {
      field: RelatorioVendaProdutoColumn.Quantidade,
      headerName: 'Quantidade',
      width: 140,
      cellRenderer: ({ data }: ICellRendererParams<RelatorioVendaProdutoItem>) =>
        formatNumber(data?.quantidade ?? 0),
    },
    {
      field: RelatorioVendaProdutoColumn.ValorTotal,
      headerName: 'Valor total',
      width: 160,
      cellRenderer: ({ data }: ICellRendererParams<RelatorioVendaProdutoItem>) => (
        <TextApp color="success.main" weight={TextAppWeight.SemiBold}>
          {formatMoney(data?.valorTotal ?? 0)}
        </TextApp>
      ),
    },
  ]

  return (
    <TabelaComDrag
      columns={columns}
      height="100%"
      rows={itens.map((x) => {
        return {
          ...x,
          id: `${x.id}-${x.peso || x.tamanho || ''}`,
        }
      })}
    />
  )
}
