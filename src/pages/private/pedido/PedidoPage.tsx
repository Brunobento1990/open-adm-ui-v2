import type { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { useApiPedido } from '../../../api/useApiPedido'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import type { MenuAppItem } from '../../../components/MenuApp/MenuApp'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { keysLocalStorage } from '../../../configs/keysLocalStorage'
import { useLocalStorageApp } from '../../../hook/useLocalStorageApp'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  PedidoColumnField,
  PedidoStatus,
  PedidoStatusColorMap,
  PedidoStatusFiltro,
  PedidoStatusLabel,
  PedidoStatusOptions,
  type PedidoFiltros,
  type PedidoPaginacao,
} from '../../../types/PedidoTypes'
import { TipoPaletaCorEnum } from '../../../types/TipoPaletaCorEnum'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { baixarPdf } from '../../../utils/pdfUtils'
import { ExcluirPedidoButton } from './ExcluirPedidoButton'

const PedidoTable = { Name: 'pedidos' } as const

const statusOptions = [{ label: 'Todos', value: PedidoStatusFiltro.Todos }, ...PedidoStatusOptions]

type PedidoPageState = {
  filtros: PedidoFiltros
  filtrosTemporarios: PedidoFiltros
  filtrosModalAberto: boolean
  refresh: number
}

export function PedidoPage() {
  const { download, excluir } = useApiPedido()
  const { getItem, removeItem, setItem } = useLocalStorageApp()
  const { navigate } = useNavigationApp()
  const { cores, getPaletteColor } = useThemeApp()
  const [state, setState] = useState<PedidoPageState>(() => {
    const statusSalvo = Number(getItem<string>(keysLocalStorage.pedidoStatusFiltro))
    const statusInicial = PedidoStatusOptions.some((option) => option.value === statusSalvo)
      ? (statusSalvo as PedidoStatus)
      : PedidoStatusFiltro.Todos
    const filtros = { statusPedido: statusInicial }
    return { filtros, filtrosTemporarios: filtros, filtrosModalAberto: false, refresh: 0 }
  })

  function abrirFiltros() {
    setState((atual) => ({
      ...atual,
      filtrosTemporarios: atual.filtros,
      filtrosModalAberto: true,
    }))
  }

  function aplicarFiltros() {
    if (state.filtrosTemporarios.statusPedido === PedidoStatusFiltro.Todos) {
      removeItem(keysLocalStorage.pedidoStatusFiltro)
    } else {
      setItem(keysLocalStorage.pedidoStatusFiltro, String(state.filtrosTemporarios.statusPedido))
    }
    setState((atual) => ({
      ...atual,
      filtros: atual.filtrosTemporarios,
      filtrosModalAberto: false,
      refresh: atual.refresh + 1,
    }))
  }

  function limparFiltros() {
    const filtrosLimpos = { statusPedido: PedidoStatusFiltro.Todos }
    removeItem(keysLocalStorage.pedidoStatusFiltro)
    setState((atual) => ({
      filtros: filtrosLimpos,
      filtrosTemporarios: filtrosLimpos,
      filtrosModalAberto: false,
      refresh: atual.refresh + 1,
    }))
  }

  async function downloadPedido(pedido: PedidoPaginacao) {
    const response = await download.fetch(pedido.id)
    if (response) baixarPdf(response, `pedido-${pedido.numero}.pdf`)
  }

  async function excluirPedido(pedido: PedidoPaginacao) {
    const sucesso = await excluir.fetch(pedido.id)
    if (sucesso) setState((atual) => ({ ...atual, refresh: atual.refresh + 1 }))
    return sucesso
  }

  const columns: TypeColumns[] = [
    {
      field: PedidoColumnField.Numero,
      headerName: 'N°',
      width: 90,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<PedidoPaginacao>) =>
        data ? `#${data.numero}` : '',
    },
    {
      field: PedidoColumnField.Cadastro,
      headerName: 'Cadastro',
      minWidth: 175,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<PedidoPaginacao>) =>
        formatarDataHoraUtcLocal(data?.dataDeCriacao),
    },
    {
      field: PedidoColumnField.Cliente,
      headerName: 'Cliente',
      flex: 1,
      minWidth: 200,
    },
    {
      field: PedidoColumnField.Estoque,
      headerName: 'Estoque',
      width: 110,
      cellRenderer: ({ data }: ICellRendererParams<PedidoPaginacao>) => {
        if (!data) return null
        if (data.statusPedido === PedidoStatus.Entregue) return 'Fechado'
        const cor =
          data.porcentagemEstoqueAtendido <= 20
            ? cores.error
            : data.porcentagemEstoqueAtendido <= 50
              ? cores.warning
              : cores.success
        return (
          <BadgeApp
            cor={cor}
            padding=".3rem .75rem"
            texto={`${data.porcentagemEstoqueAtendido}%`}
            width="72px"
          />
        )
      },
    },
    {
      field: PedidoColumnField.Status,
      headerName: 'Status',
      minWidth: 150,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<PedidoPaginacao>) =>
        data && (
          <BadgeApp
            cor={getPaletteColor(PedidoStatusColorMap[data.statusPedido])}
            texto={PedidoStatusLabel[data.statusPedido]}
            width="100px"
          />
        ),
    },
    {
      field: PedidoColumnField.Baixar,
      headerName: 'Baixar',
      width: 100,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<PedidoPaginacao>) =>
        data && (
          <IconButtonComTolltip
            aria-label="Modificar status do pedido"
            onClick={(event) => {
              event.stopPropagation()
              navigate(`${PrivateRoutePath.PedidoModificarStatus}/${data.id}`)
            }}
            tooltip="Modificar status do pedido"
          >
            <IconApp color={cores.primary} icon="fe:app-menu" />
          </IconButtonComTolltip>
        ),
    },
    {
      field: PedidoColumnField.Financeiro,
      headerName: 'Financeiro',
      width: 110,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<PedidoPaginacao>) =>
        data && (
          <IconButtonComTolltip
            aria-label="Acessar financeiro do pedido"
            onClick={(event) => {
              event.stopPropagation()
              navigate(`${PrivateRoutePath.ContaAReceber}?pedidoId=${encodeURIComponent(data.id)}`)
            }}
            tooltip="Acessar financeiro do pedido"
          >
            <IconApp color={cores.success} icon="solar:wallet-money-outline" />
          </IconButtonComTolltip>
        ),
    },
    {
      field: PedidoColumnField.Acoes,
      headerName: 'Ações',
      width: 160,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<PedidoPaginacao>) =>
        data && (
          <StackApp direction="row" spacing={0.5}>
            <IconButtonComTolltip
              aria-label="Visualizar pedido"
              onClick={(event) => {
                event.stopPropagation()
                navigate(`${PrivateRoutePath.PedidoVisualizar}/${data.id}`)
              }}
              tooltip="Visualizar pedido"
            >
              <IconApp color={cores.primary} icon="solar:eye-linear" />
            </IconButtonComTolltip>
            <IconButtonComTolltip
              aria-label="Download do pedido"
              disabled={download.loading}
              onClick={(event) => {
                event.stopPropagation()
                downloadPedido(data)
              }}
              tooltip="Download do pedido"
            >
              <IconApp color={cores.primary} icon="material-symbols-light:download" />
            </IconButtonComTolltip>
            <ExcluirPedidoButton
              loading={excluir.loading}
              numero={data.numero}
              onConfirmar={() => excluirPedido(data)}
            />
          </StackApp>
        ),
    },
  ]

  const menuItems: MenuAppItem[] = [
    {
      icon: 'solar:filter-linear',
      iconColor: getPaletteColor(TipoPaletaCorEnum.Primary),
      label: 'Filtros',
      onClick: abrirFiltros,
    },
  ]

  return (
    <>
      <TableIndex
        columns={columns}
        desabilitarColunaAcoes
        desabilitarColunaAtivo
        filtroComplementar={{
          statusPedido:
            state.filtros.statusPedido === PedidoStatusFiltro.Todos
              ? undefined
              : state.filtros.statusPedido,
        }}
        menuItems={menuItems}
        nomeDaTabela={PedidoTable.Name}
        orderBy={PedidoColumnField.Numero}
        refreshPai={state.refresh}
        url={ApiRoutePath.Pedido}
        urlAdd={PrivateRoutePath.PedidoAdicionar}
      />
      <ModalChildren
        close={() => setState((atual) => ({ ...atual, filtrosModalAberto: false }))}
        footerChildren={
          <StackApp direction="row" spacing={1}>
            <ButtonApp onClick={limparFiltros} variant={ButtonAppVariant.Outlined}>
              Limpar filtros
            </ButtonApp>
            <ButtonApp onClick={aplicarFiltros}>Aplicar filtros</ButtonApp>
          </StackApp>
        }
        fullWidth
        maxWidth="sm"
        open={state.filtrosModalAberto}
        titulo="Filtros"
      >
        <InputApp
          id="statusPedido"
          label="Status"
          onChange={(_, value) =>
            setState((atual) => ({
              ...atual,
              filtrosTemporarios: { statusPedido: Number(value) },
            }))
          }
          options={statusOptions}
          type={InputAppType.Select}
          value={state.filtrosTemporarios.statusPedido}
        />
      </ModalChildren>
    </>
  )
}
