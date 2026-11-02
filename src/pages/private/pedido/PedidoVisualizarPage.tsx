import type { ICellRendererParams } from 'ag-grid-community'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiPedido } from '../../../api/useApiPedido'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppOverflow,
} from '../../../components/BoxApp/boxAppTypes'
import { ButtonApp } from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
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
import { PedidoAdicionarItemModal } from './PedidoAdicionarItemModal'
import { PedidoEditarItemModal } from './PedidoEditarItemModal'
import { PedidoExcluirItemModal } from './PedidoExcluirItemModal'

const PedidoItensTable = { Name: 'pedido-itens-visualizacao' } as const

export function PedidoVisualizarPage() {
  const { id } = useParams<{ id: string }>()
  const { obter } = useApiPedido()
  const { cores, getPaletteColor } = useThemeApp()
  const [pedido, setPedido] = useState<Pedido>()
  const [itemParaEditar, setItemParaEditar] = useState<PedidoItem>()
  const [itemParaExcluir, setItemParaExcluir] = useState<PedidoItem>()
  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false)

  async function carregarPedido() {
    if (!id) return
    const response = await obter.fetch(id)
    if (response) setPedido({ ...response, itensPedido: response.itensPedido ?? [] })
  }

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
      cellRenderer: ({ data }: ICellRendererParams<PedidoItem>) =>
        data && (
          <BadgeApp
            cor={data.estoqueDisponivel >= data.quantidade ? cores.success : cores.error}
            padding=".3rem .75rem"
            texto={String(data.estoqueDisponivel)}
            width="72px"
          />
        ),
    },
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
    { field: PedidoItemColumnField.Quantidade, headerName: 'Quantidade', width: 130 },
    {
      field: PedidoItemColumnField.ValorUnitario,
      headerName: 'Vlr',
      width: 140,
      cellRenderer: ({ data }: ICellRendererParams<PedidoItem>) =>
        data ? formatMoney(data.valorUnitario) : '',
    },
    {
      field: PedidoItemColumnField.ValorTotal,
      headerName: 'Valor total',
      width: 140,
      cellRenderer: ({ data }: ICellRendererParams<PedidoItem>) =>
        data ? formatMoney(data.valorTotal) : '',
    },
    {
      field: PedidoItemColumnField.Acoes,
      headerName: 'Ações',
      width: 130,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<PedidoItem>) =>
        data && (
          <>
            <IconButtonComTolltip
              aria-label={`Editar item ${data.produto?.descricao ?? ''}`}
              onClick={(event) => {
                event.stopPropagation()
                setItemParaEditar(data)
              }}
              tooltip="Editar item"
            >
              <IconApp color={cores.primary} icon="solar:pen-linear" />
            </IconButtonComTolltip>
            <IconButtonComTolltip
              aria-label={`Excluir item ${data.produto?.descricao ?? ''}`}
              onClick={(event) => {
                event.stopPropagation()
                setItemParaExcluir(data)
              }}
              tooltip="Excluir item"
            >
              <IconApp color={cores.error} icon="solar:trash-bin-trash-linear" />
            </IconButtonComTolltip>
          </>
        ),
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
        <FormRoot.FormItemRow xs={12} sm={2}>
          <InputApp
            label="Data de cadastro"
            value={formatarDataHoraUtcLocal(pedido?.dataDeCriacao)}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={5}>
          <InputApp label="Cliente" value={pedido?.usuario ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={2}>
          <InputApp
            disabled
            label="Valor total"
            startAdornment="R$"
            type={InputAppType.Currency}
            value={pedido?.valorTotal ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={3}>
          {pedido ? (
            <BoxApp
              display={BoxAppDisplay.Flex}
              alignItems={BoxAppAlignItems.Center}
              width={'100%'}
              gap=".5rem"
            >
              <BadgeApp
                cor={getPaletteColor(PedidoStatusColorMap[pedido.statusPedido])}
                padding=".45rem .75rem"
                texto={PedidoStatusLabel[pedido.statusPedido]}
                width="250px"
              />
              <ButtonApp
                fullWidth
                onClick={() => setModalAdicionarAberto(true)}
                startIcon={<IconApp icon="solar:add-circle-linear" />}
              >
                Adicionar item
              </ButtonApp>
            </BoxApp>
          ) : (
            <InputApp label="Status" value="" />
          )}
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <BoxApp flex={1} minHeight={240} overflow={BoxAppOverflow.Hidden}>
        <TabelaComDrag
          columns={columns}
          loading={obter.loading}
          nomeDaTabela={PedidoItensTable.Name}
          rows={pedido?.itensPedido ?? []}
        />
      </BoxApp>
      <PedidoAdicionarItemModal
        onClose={() => setModalAdicionarAberto(false)}
        onSuccess={() => {
          setModalAdicionarAberto(false)
          void carregarPedido()
        }}
        open={modalAdicionarAberto}
        pedidoId={id}
      />
      <PedidoEditarItemModal
        item={itemParaEditar}
        onClose={() => setItemParaEditar(undefined)}
        onSuccess={() => {
          setItemParaEditar(undefined)
          void carregarPedido()
        }}
      />
      <PedidoExcluirItemModal
        item={itemParaExcluir}
        onClose={() => setItemParaExcluir(undefined)}
        onSuccess={() => {
          setItemParaExcluir(undefined)
          void carregarPedido()
        }}
      />
    </FormRoot.Form>
  )
}
