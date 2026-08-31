import type { ICellRendererParams } from 'ag-grid-community'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  MensalidadeColumnField,
  MensalidadeStatus,
  type Mensalidade,
} from '../../../types/MensalidadeTypes'
import { formatMoney } from '../../../utils/moneyUtils'

const MensalidadeTable = { Name: 'mensalidades' } as const

export function MensalidadePage() {
  const { cores } = useThemeApp()
  const columns: TypeColumns[] = [
    {
      field: MensalidadeColumnField.Referente,
      headerName: 'Referente',
      minWidth: 140,
      cellRenderer: ({ data }: ICellRendererParams<Mensalidade>) =>
        data ? `${data.mesCobranca}/${data.anoCobranca}` : '',
    },
    {
      field: MensalidadeColumnField.Valor,
      headerName: 'Valor',
      minWidth: 150,
      cellRenderer: ({ data }: ICellRendererParams<Mensalidade>) =>
        data ? formatMoney(data.valor) : '',
    },
    {
      field: MensalidadeColumnField.ValorPago,
      headerName: 'Valor pago',
      minWidth: 150,
      cellRenderer: ({ data }: ICellRendererParams<Mensalidade>) =>
        data ? formatMoney(data.valorPago) : '',
    },
    {
      field: MensalidadeColumnField.Status,
      headerName: 'Status',
      minWidth: 140,
      cellRenderer: ({ data }: ICellRendererParams<Mensalidade>) => {
        if (!data) return null
        const texto = data.pago
          ? MensalidadeStatus.Pago
          : data.vencido
            ? MensalidadeStatus.Vencido
            : MensalidadeStatus.Pendente
        const cor = data.pago ? cores.success : data.vencido ? cores.error : cores.warning

        return <BadgeApp cor={cor} texto={texto} width="100px" />
      },
    },
  ]

  return (
    <TableIndex
      columns={columns}
      desabilitarColunaAtivo
      nomeDaTabela={MensalidadeTable.Name}
      notBtnAdd
      orderBy={MensalidadeColumnField.DataDeVencimento}
      url={ApiRoutePath.Mensalidade}
      urlView={PrivateRoutePath.MensalidadeVisualizar}
    />
  )
}
