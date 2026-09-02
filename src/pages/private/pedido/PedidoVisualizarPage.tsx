import type { ICellRendererParams } from 'ag-grid-community'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiPedido } from '../../../api/useApiPedido'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppOverflow } from '../../../components/BoxApp/boxAppTypes'
import { DividerApp } from '../../../components/DividerApp/DividerApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { ProgressApp } from '../../../components/ProgressApp/ProgressApp'
import { TabelaComDrag } from '../../../components/Tabela/TabelaComDrag'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction } from '../../../types/Form'
import {
  PedidoItemColumnField,
  PedidoStatusColorMap,
  PedidoStatusLabel,
  type Pedido,
  type PedidoItem,
} from '../../../types/PedidoTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney } from '../../../utils/moneyUtils'

const PedidoItensTable = { Name: 'pedido-itens-visualizacao' } as const

export function PedidoVisualizarPage() {
  const { id } = useParams<{ id: string }>()
  const { obter } = useApiPedido()
  const { cores, getPaletteColor } = useThemeApp()
  const [pedido, setPedido] = useState<Pedido>()

  useEffect(() => {
    if (!id) return
    async function carregar() {
      const response = await obter.fetch(id as string)
      if (response) setPedido({ ...response, itensPedido: response.itensPedido ?? [] })
    }
    carregar()
    // A consulta deve ocorrer somente quando o identificador da rota mudar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const columns: TypeColumns[] = [
    {
      field: PedidoItemColumnField.Estoque,
      headerName: 'Estoque',
      width: 120,
      cellRenderer: ({ data }: ICellRendererParams<PedidoItem>) => data && (
        <BadgeApp
          cor={data.estoqueDisponivel >= data.quantidade ? cores.success : cores.error}
          padding=".3rem .75rem"
          texto={String(data.estoqueDisponivel)}
          width="72px"
        />
      ),
    },
    { field: PedidoItemColumnField.Quantidade, headerName: 'Quantidade', width: 130 },
    {
      field: PedidoItemColumnField.Produto,
      headerName: 'Produto',
      flex: 1,
      minWidth: 220,
      cellRenderer: ({ data }: ICellRendererParams<PedidoItem>) => data?.produto?.descricao ?? '',
    },
    {
      field: PedidoItemColumnField.PesoTamanho,
      headerName: 'Peso/Tamanho',
      minWidth: 180,
      cellRenderer: ({ data }: ICellRendererParams<PedidoItem>) =>
        data?.peso?.descricao ?? data?.tamanho?.descricao ?? '',
    },
    {
      field: PedidoItemColumnField.ValorUnitario,
      headerName: 'Vlr',
      width: 140,
      cellRenderer: ({ data }: ICellRendererParams<PedidoItem>) =>
        data ? formatMoney(data.valorUnitario) : '',
    },
  ]

  return (
    <FormRoot.Form
      action={FormAction.View}
      loading={obter.loading}
      submit={async () => undefined}
      urlVoltar={PrivateRoutePath.Pedido}
    >
      {obter.loading && <ProgressApp />}
      <TextApp component="h1" fontSize="1.25rem" weight={TextAppWeight.SemiBold}>
        Pedido {pedido?.numero ?? ''}
      </TextApp>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          <InputApp label="Data de cadastro" value={formatarDataHoraUtcLocal(pedido?.dataDeCriacao)} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp label="Cliente" value={pedido?.usuario ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          {pedido ? (
            <BoxApp pt="3px">
              <BadgeApp
                cor={getPaletteColor(PedidoStatusColorMap[pedido.statusPedido])}
                padding=".45rem .75rem"
                texto={PedidoStatusLabel[pedido.statusPedido]}
                width="100%"
              />
            </BoxApp>
          ) : <InputApp label="Status" value="" />}
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <DividerApp sx={{ mb: 2 }}>Itens</DividerApp>
      <BoxApp flex={1} minHeight={240} overflow={BoxAppOverflow.Hidden}>
        <TabelaComDrag
          columns={columns}
          loading={obter.loading}
          nomeDaTabela={PedidoItensTable.Name}
          rows={pedido?.itensPedido ?? []}
        />
      </BoxApp>
    </FormRoot.Form>
  )
}
