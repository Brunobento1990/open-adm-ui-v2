import { Pagination } from '@mui/material'
import type { ICellRendererParams } from 'ag-grid-community'
import { useEffect, useState } from 'react'
import { useApiClienteUltimoPedido } from '../../../api/useApiClienteUltimoPedido'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppAlignItems, BoxAppDisplay } from '../../../components/BoxApp/boxAppTypes'
import { ButtonApp } from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { InputApp } from '../../../components/InputApp/InputApp'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TabelaComDrag } from '../../../components/Tabela/TabelaComDrag'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { ClienteUltimoPedido, ClienteUltimoPedidoPaginacao } from '../../../types/ClienteUltimoPedidoTypes'
import { PedidoStatusColorMap, PedidoStatusLabel } from '../../../types/PedidoTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatarCnpj, formatarCpf, formatarTelefone, limparTelefone } from '../../../utils/documentUtils'
import { formatMoney } from '../../../utils/moneyUtils'

const ClienteUltimoPedidoTable = {
  Cnpj: 'clientes-cnpj-ultimos-pedidos',
  Cpf: 'clientes-cpf-ultimos-pedidos',
} as const
const ExternalUrl = { WhatsApp: 'https://api.whatsapp.com/send?phone=' } as const
const BrazilCountryCode = '55'

type ClienteUltimosPedidosPageProps = {
  isJuridico: boolean
}

export function ClienteUltimosPedidosPage({ isJuridico }: ClienteUltimosPedidosPageProps) {
  const { cores, getPaletteColor } = useThemeApp()
  const api = useApiClienteUltimoPedido()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [paginacao, setPaginacao] = useState<ClienteUltimoPedidoPaginacao>()
  const [selecionado, setSelecionado] = useState<ClienteUltimoPedido>()

  useEffect(() => {
    void api.listar.fetch(page, isJuridico, appliedSearch).then((response) => {
      if (response) setPaginacao(response)
    })
    // A alteração dos filtros é a origem intencional da consulta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isJuridico, appliedSearch])

  function pesquisar() {
    setPage(1)
    setAppliedSearch(search.trim())
  }

  function alterarPesquisa(value: string) {
    setSearch(value)

    if (!value.trim() && appliedSearch) {
      setPage(1)
      setAppliedSearch('')
    }
  }

  function abrirWhatsApp(telefone?: string) {
    const numero = limparTelefone(telefone)
    return numero ? `${ExternalUrl.WhatsApp}${BrazilCountryCode}${numero}` : undefined
  }

  function renderStatus(cliente?: ClienteUltimoPedido) {
    if (cliente?.statusPedido === undefined) return ''
    return (
      <BadgeApp
        cor={getPaletteColor(PedidoStatusColorMap[cliente.statusPedido])}
        padding="4px 10px"
        texto={PedidoStatusLabel[cliente.statusPedido]}
      />
    )
  }

  function renderSituacao(cliente?: ClienteUltimoPedido) {
    const comPedido = Boolean(cliente?.numeroDoPedido)
    return (
      <BadgeApp
        cor={comPedido ? cores.success : cores.error}
        padding="4px 10px"
        texto={comPedido ? 'Com pedido' : 'Sem pedido'}
      />
    )
  }

  const columns: TypeColumns[] = [
    {
      field: 'whatsApp',
      headerName: 'WhatsApp',
      width: 115,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<ClienteUltimoPedido>) => {
        const url = abrirWhatsApp(data?.telefone)
        return url ? (
          <IconButtonComTolltip onClick={() => window.open(url, '_blank', 'noopener,noreferrer')} tooltip="Abrir conversa">
            <IconApp icon="logos:whatsapp-icon" width="1.2rem" />
          </IconButtonComTolltip>
        ) : ''
      },
    },
    {
      field: 'visualizar',
      headerName: 'Visualizar',
      width: 105,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<ClienteUltimoPedido>) => data && (
        <IconButtonComTolltip onClick={() => setSelecionado(data)} tooltip="Visualizar">
          <IconApp icon="solar:eye-linear" width="1.2rem" />
        </IconButtonComTolltip>
      ),
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 140,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams<ClienteUltimoPedido>) => renderSituacao(data),
    },
    { field: 'nome', headerName: 'Nome', flex: 1, minWidth: 220 },
    {
      field: 'cpfCnpj',
      headerName: isJuridico ? 'CNPJ' : 'CPF',
      minWidth: 165,
      cellRenderer: ({ data }: ICellRendererParams<ClienteUltimoPedido>) =>
        isJuridico ? formatarCnpj(data?.cpfCnpj) : formatarCpf(data?.cpfCnpj),
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      minWidth: 155,
      cellRenderer: ({ data }: ICellRendererParams<ClienteUltimoPedido>) => formatarTelefone(data?.telefone),
    },
    { field: 'statusPedido', headerName: 'Status', minWidth: 160, cellRenderer: ({ data }: ICellRendererParams<ClienteUltimoPedido>) => renderStatus(data) },
    { field: 'dataDoUltimoPedido', headerName: 'Data do pedido', minWidth: 175, cellRenderer: ({ data }: ICellRendererParams<ClienteUltimoPedido>) => formatarDataHoraUtcLocal(data?.dataDoUltimoPedido) },
    { field: 'total', headerName: 'Total', minWidth: 130, cellRenderer: ({ data }: ICellRendererParams<ClienteUltimoPedido>) => data?.total === undefined ? '' : formatMoney(data.total) },
    { field: 'numeroDoPedido', headerName: 'Número', minWidth: 115 },
  ]

  const whatsappSelecionado = abrirWhatsApp(selecionado?.telefone)

  return (
    <PaperApp fullHeight sx={{ flex: 1, minWidth: 0, width: '100%' }}>
      <StackApp spacing={2} sx={{ height: '100%', minHeight: 0 }}>
        <BoxApp>
          <TextApp component="h1" variant="h6" fontWeight={700}>
            Últimos pedidos de clientes {isJuridico ? 'CNPJ' : 'CPF'}
          </TextApp>
          <TextApp color="text.secondary">Consulte clientes com e sem pedidos realizados.</TextApp>
        </BoxApp>

        <StackApp
          component="form"
          onSubmit={(event) => {
            event.preventDefault()
            pesquisar()
          }}
        >
          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12} sm={12}>
              <BoxApp gap={'1rem'} display={BoxAppDisplay.Flex} width={'100%'} alignItems={BoxAppAlignItems.Center}>
                <InputApp fullWidth id="search" label="Pesquisar" value={search} onChange={(_, value) => alterarPesquisa(String(value ?? ''))} />
                <ButtonApp loading={api.listar.loading} type="submit">Pesquisar</ButtonApp>
              </BoxApp>
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
        </StackApp>

        <BoxApp flex={1} minHeight={240} sx={{ overflow: 'hidden' }}>
          <TabelaComDrag
            columns={columns}
            loading={api.listar.loading}
            nomeDaTabela={
              isJuridico
                ? ClienteUltimoPedidoTable.Cnpj
                : ClienteUltimoPedidoTable.Cpf
            }
            rows={paginacao?.dados ?? []}
          />
        </BoxApp>

        <Pagination
          color="primary"
          count={paginacao?.totalPagina ?? 0}
          onChange={(_, value) => setPage(value)}
          page={page}
          shape="rounded"
          sx={{ alignSelf: 'flex-end' }}
          variant="outlined"
        />
      </StackApp>

      <ModalChildren close={() => setSelecionado(undefined)} fullWidth maxWidth="sm" open={Boolean(selecionado)} retirarFooter titulo="Detalhes do último pedido">
        <StackApp spacing={1.5}>
          <Detail label="Cliente" value={selecionado?.nome} />
          <Detail label={isJuridico ? 'CNPJ' : 'CPF'} value={isJuridico ? formatarCnpj(selecionado?.cpfCnpj) : formatarCpf(selecionado?.cpfCnpj)} />
          <Detail label="Telefone" value={formatarTelefone(selecionado?.telefone)} />
          {whatsappSelecionado && (
            <Detail label="Conversa" value={<ButtonApp onClick={() => window.open(whatsappSelecionado, '_blank', 'noopener,noreferrer')}><IconApp icon="logos:whatsapp-icon" width="1.1rem" />&nbsp;Abrir WhatsApp</ButtonApp>} />
          )}
          <Detail label="Data do último pedido" value={formatarDataHoraUtcLocal(selecionado?.dataDoUltimoPedido) || '-'} />
          <Detail label="Total do último pedido" value={selecionado?.total === undefined ? '-' : formatMoney(selecionado.total)} />
          <Detail label="Número do último pedido" value={selecionado?.numeroDoPedido ?? '-'} />
          <Detail label="Status" value={renderStatus(selecionado) || '-'} />
        </StackApp>
      </ModalChildren>
    </PaperApp>
  )
}

function Detail({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <StackApp direction={{ xs: 'column', sm: 'row' }} spacing={0.5}>
      <TextApp fontWeight={700} sx={{ width: { sm: 190 }, flexShrink: 0 }}>{label}:</TextApp>
      <BoxApp>{value || '-'}</BoxApp>
    </StackApp>
  )
}
