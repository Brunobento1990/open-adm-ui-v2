import type { ICellRendererParams } from 'ag-grid-community'
import { Stack } from '@mui/material'
import { useState } from 'react'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { useComandaStatus } from '../../../hook/useComandaStatus'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import type { Comanda } from '../../../types/ComandaTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney } from '../../../utils/moneyUtils'
import { ComandaCompartilhamentoAction } from './ComandaCompartilhamentoAction'

export function ComandaPage() {
  const getStatus = useComandaStatus()
  const [refreshKey, setRefreshKey] = useState(false)
  const columns: TypeColumns[] = [
    { field: 'numero', headerName: 'Número', width: 120 },
    { field: 'identificacao', headerName: 'Identificação', flex: 1, minWidth: 220 },
    {
      field: 'idPublico',
      headerName: 'Compartilhar',
      width: 125,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<Comanda>) => data && (
        <Stack direction="row" sx={{ alignItems: 'center', height: '100%' }}>
          <ComandaCompartilhamentoAction
            comandaId={data.id}
            idPublico={data.idPublico}
            onChanged={() => setRefreshKey((current) => !current)}
            somenteIcone
          />
        </Stack>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 190,
      cellRenderer: ({ data }: ICellRendererParams<Comanda>) => data && (
        <BadgeApp
          cor={getStatus(data.status).color}
          padding="4px 10px"
          texto={getStatus(data.status).label}
        />
      ),
    },
    {
      field: 'valorLiquido',
      headerName: 'Valor líquido',
      minWidth: 150,
      cellRenderer: ({ data }: ICellRendererParams<Comanda>) =>
        data ? formatMoney(data.valorLiquido) : '',
    },
    {
      field: 'dataDeCadastro',
      headerName: 'Data de cadastro',
      minWidth: 180,
      cellRenderer: ({ data }: ICellRendererParams<Comanda>) =>
        formatarDataHoraUtcLocal(data?.dataDeCadastro),
    },
  ]

  return (
    <TableIndex
      columns={columns}
      desabilitarColunaAtivo
      nomeDaTabela="comandas"
      orderBy="dataDeCadastro"
      refreshPai={refreshKey}
      url={ApiRoutePath.Comanda}
      urlAdd={PrivateRoutePath.ComandaAdicionar}
      urlEdit={PrivateRoutePath.ComandaEditar}
      urlView={PrivateRoutePath.ComandaVisualizar}
    />
  )
}
