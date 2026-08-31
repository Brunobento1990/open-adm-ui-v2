import type { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import {
  EstornarParcelaButton,
  EstornoParcelaProvider,
} from '../../../components/Fatura/EstornarParcelaButton'
import { PagarParcelaButton } from '../../../components/Fatura/PagarParcelaButton'
import { StatusParcelaBadge } from '../../../components/Fatura/StatusParcelaBadge'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import type { MenuAppItem } from '../../../components/MenuApp/MenuApp'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { useThemeApp } from '../../../hook/useThemeApp'
import {
  FaturaColumnField,
  StatusParcela,
  StatusParcelaFiltro,
  TipoFatura,
  type FaturaFiltros,
  type ParcelaPaginacao,
} from '../../../types/FaturaTypes'
import { TipoPaletaCorEnum } from '../../../types/TipoPaletaCorEnum'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney } from '../../../utils/moneyUtils'

type FaturaPageProps = {
  tipo: TipoFatura
  urlAdd?: string
}

const situacaoOptions = [
  { label: 'Todos', value: StatusParcelaFiltro.Todos },
  { label: 'Pendente', value: StatusParcela.Pendente },
  { label: 'Pago parcial', value: StatusParcela.PagoParcial },
  { label: 'Pago', value: StatusParcela.Pago },
  { label: 'Vencida', value: StatusParcela.Vencida },
]

export function FaturaPage({ tipo, urlAdd }: FaturaPageProps) {
  const { getPaletteColor } = useThemeApp()
  const [refresh, setRefresh] = useState(0)
  const [filtros, setFiltros] = useState<FaturaFiltros>({
    status: StatusParcelaFiltro.Todos,
  })
  const [filtrosTemporarios, setFiltrosTemporarios] =
    useState<FaturaFiltros>(filtros)
  const [filtrosModalAberto, setFiltrosModalAberto] = useState(false)

  function alterarFiltroTemporario(
    campo: keyof FaturaFiltros,
    valor?: string | number | boolean,
  ) {
    setFiltrosTemporarios((atual) => ({ ...atual, [campo]: valor }))
  }

  function abrirFiltros() {
    setFiltrosTemporarios(filtros)
    setFiltrosModalAberto(true)
  }

  function aplicarFiltros() {
    setFiltros(filtrosTemporarios)
    setRefresh((atual) => atual + 1)
    setFiltrosModalAberto(false)
  }

  function limparFiltros() {
    const filtrosLimpos = { status: StatusParcelaFiltro.Todos }
    setFiltros(filtrosLimpos)
    setFiltrosTemporarios(filtrosLimpos)
    setRefresh((atual) => atual + 1)
    setFiltrosModalAberto(false)
  }

  const columns: TypeColumns[] = [
    {
      field: FaturaColumnField.NumeroFatura,
      headerName: 'Nº fatura',
      minWidth: 125,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) =>
        data ? `#${data.numeroFatura}` : '',
    },
    {
      field: FaturaColumnField.NumeroDaParcela,
      headerName: 'Nº parcela',
      minWidth: 125,
      sortable: true,
    },
    {
      field: FaturaColumnField.NumeroPedido,
      headerName: 'Nº pedido',
      minWidth: 125,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) =>
        data?.numeroPedido ? `#${data.numeroPedido}` : '-',
    },
    {
      field: FaturaColumnField.NomeUsuario,
      headerName: 'Cliente',
      flex: 1,
      minWidth: 210,
    },
    {
      field: FaturaColumnField.Valor,
      headerName: 'Valor',
      minWidth: 135,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) =>
        data ? formatMoney(data.valor) : '',
    },
    {
      field: FaturaColumnField.ValorPagoRecebidoLiquido,
      headerName: 'Valor recebido',
      minWidth: 155,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) =>
        data ? formatMoney(data.valorPagoRecebidoLiquido) : '',
    },
    {
      field: FaturaColumnField.DescontoConcedido,
      headerName: 'Desconto',
      minWidth: 135,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) =>
        data ? formatMoney(data.descontoConcedido) : '',
    },
    {
      field: FaturaColumnField.ValorAPagarAReceber,
      headerName: tipo === TipoFatura.AReceber ? 'Valor a receber' : 'Valor a pagar',
      minWidth: 155,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) =>
        data ? formatMoney(data.valorAPagarAReceber) : '',
    },
    {
      field: FaturaColumnField.Vencimento,
      headerName: 'Vencimento',
      minWidth: 150,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) =>
        formatarDataHoraUtcLocal(data?.vencimento),
    },
    {
      field: FaturaColumnField.Status,
      headerName: 'Status',
      minWidth: 140,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) => {
        if (!data) return null
        return <StatusParcelaBadge status={data.status} />
      },
    },
    {
      field: FaturaColumnField.Acoes,
      headerName: 'Ações',
      width: 100,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<ParcelaPaginacao>) => {
        if (!data) return null
        const permiteEstorno = data.status === StatusParcela.PagoParcial || data.status === StatusParcela.Pago

        return (
          <StackApp direction="row" spacing={0.5}>
            {!data.quitada && <PagarParcelaButton parcelaId={data.id} />}
            {permiteEstorno && <EstornarParcelaButton parcelaId={data.id} />}
          </StackApp>
        )
      },
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

  const filtrosModal = (
    <ModalChildren
      action={aplicarFiltros}
      close={() => setFiltrosModalAberto(false)}
      footerChildren={(
        <StackApp direction="row" spacing={1}>
          <ButtonApp onClick={limparFiltros} variant={ButtonAppVariant.Outlined}>
            Limpar filtros
          </ButtonApp>
          <ButtonApp onClick={aplicarFiltros}>Aplicar filtros</ButtonApp>
        </StackApp>
      )}
      fullWidth
      maxWidth="sm"
      open={filtrosModalAberto}
      textoButton="Aplicar filtros"
      titulo="Filtros"
    >
      <StackApp spacing={2}>
        <InputApp
          id="dataVencimentoInicial"
          label="Vencimento inicial"
          onChange={(id, value) =>
            alterarFiltroTemporario(id as keyof FaturaFiltros, value)}
          type={InputAppType.Date}
          value={filtrosTemporarios.dataVencimentoInicial ?? ''}
        />
        <InputApp
          id="dataVencimentoFinal"
          label="Vencimento final"
          onChange={(id, value) =>
            alterarFiltroTemporario(id as keyof FaturaFiltros, value)}
          type={InputAppType.Date}
          value={filtrosTemporarios.dataVencimentoFinal ?? ''}
        />
        <InputApp
          id="status"
          label="Situação"
          onChange={(id, value) =>
            alterarFiltroTemporario(id as keyof FaturaFiltros, value)}
          options={situacaoOptions}
          type={InputAppType.Select}
          value={filtrosTemporarios.status}
        />
      </StackApp>
    </ModalChildren>
  )

  return (
    <EstornoParcelaProvider onEstornada={() => setRefresh((atual) => atual + 1)}>
      <TableIndex
        columns={columns}
        desabilitarColunaAtivo
        filtroComplementar={{
          tipo,
          dataVencimentoInicial: filtros.dataVencimentoInicial || undefined,
          dataVencimentoFinal: filtros.dataVencimentoFinal || undefined,
          status: filtros.status || undefined,
        }}
        menuItems={menuItems}
        nomeDaTabela={`fatura-${tipo}`}
        notBtnAdd={!urlAdd}
        urlAdd={urlAdd}
        orderBy={FaturaColumnField.NumeroFatura}
        refreshPai={refresh}
        url={ApiRoutePath.Parcela}
      />
      {filtrosModal}
    </EstornoParcelaProvider>
  )
}
