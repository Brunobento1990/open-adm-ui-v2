import type { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { useApiClienteVenda } from '../../../api/useApiClienteVenda'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp } from '../../../components/TextApp/TextApp'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { ClienteVendaFormField, type ClienteVenda } from '../../../types/ClienteVendaTypes'
import { formatarCnpj, formatarCpf, formatarTelefone } from '../../../utils/documentUtils'

const ClienteVendaTable = { Name: 'clientes-vendas' } as const

export function ClienteVendaPage() {
  const { navigate } = useNavigationApp()
  const { cores } = useThemeApp()
  const { ativarInativar } = useApiClienteVenda()
  const [refresh, setRefresh] = useState(0)
  const [clienteConfirmacao, setClienteConfirmacao] = useState<ClienteVenda>()

  async function alterarAcesso() {
    if (!clienteConfirmacao) return
    const response = await ativarInativar.fetch(clienteConfirmacao.id)
    if (response === undefined) return
    setClienteConfirmacao(undefined)
    setRefresh((atual) => atual + 1)
  }

  const columns: TypeColumns[] = [
    {
      field: ClienteVendaFormField.Nome,
      headerName: 'Nome',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: ClienteVendaFormField.Senha,
      headerName: 'Atualizar senha',
      width: 150,
      cellRenderer: ({ data }: ICellRendererParams<ClienteVenda>) =>
        data && (
          <IconButtonComTolltip
            aria-label={`Atualizar senha de ${data.nome}`}
            onClick={() => navigate(`${PrivateRoutePath.ClienteVendaAtualizarSenha}/${data.id}`)}
            tooltip="Atualizar senha"
          >
            <IconApp color={cores.primary} icon="material-symbols-light:refresh-rounded" />
          </IconButtonComTolltip>
        ),
    },
    {
      field: 'ativarAcesso',
      headerName: 'Ativar/Bloquear acesso',
      width: 180,
      cellRenderer: ({ data }: ICellRendererParams<ClienteVenda>) =>
        data && (
          <IconButtonComTolltip
            aria-label={
              data.ativo ? `Bloquear acesso de ${data.nome}` : `Ativar acesso de ${data.nome}`
            }
            onClick={() => setClienteConfirmacao(data)}
            tooltip={data.ativo ? 'Bloquear acesso' : 'Ativar acesso'}
          >
            <IconApp
              color={data.ativo ? cores.error : cores.success}
              icon={data.ativo ? 'material-symbols:block-outline' : 'fontisto:checkbox-active'}
            />
          </IconButtonComTolltip>
        ),
    },
    {
      field: ClienteVendaFormField.Telefone,
      headerName: 'Telefone',
      minWidth: 175,
      cellRenderer: ({ data }: ICellRendererParams<ClienteVenda>) =>
        formatarTelefone(data?.telefone),
    },
    {
      field: ClienteVendaFormField.Cpf,
      headerName: 'CPF/CNPJ',
      minWidth: 180,
      cellRenderer: ({ data }: ICellRendererParams<ClienteVenda>) =>
        data?.cpf ? formatarCpf(data.cpf) : formatarCnpj(data?.cnpj),
    },
  ]

  return (
    <>
      <TableIndex
        columns={columns}
        desabilitarColunaAtivo
        refreshPai={refresh}
        nomeDaTabela={ClienteVendaTable.Name}
        orderBy={ClienteVendaFormField.Nome}
        order="asc"
        url={ApiRoutePath.ClienteVenda}
        urlAdd={PrivateRoutePath.ClienteVendaAdicionar}
        urlView={PrivateRoutePath.ClienteVendaVisualizar}
      />
      <ModalChildren
        close={() => setClienteConfirmacao(undefined)}
        footerChildren={
          <StackApp direction="row" spacing={1}>
            <ButtonApp
              disabled={ativarInativar.loading}
              onClick={() => setClienteConfirmacao(undefined)}
              variant={ButtonAppVariant.Outlined}
            >
              Cancelar
            </ButtonApp>
            <ButtonApp loading={ativarInativar.loading} onClick={alterarAcesso}>
              Confirmar
            </ButtonApp>
          </StackApp>
        }
        fullWidth
        maxWidth="sm"
        open={Boolean(clienteConfirmacao)}
        titulo={clienteConfirmacao?.ativo ? 'Bloquear acesso' : 'Ativar acesso'}
      >
        <TextApp>
          {clienteConfirmacao?.ativo
            ? `Deseja bloquear o acesso do cliente “${clienteConfirmacao.nome}”?`
            : `Deseja ativar o acesso do cliente “${clienteConfirmacao?.nome}”?`}
        </TextApp>
      </ModalChildren>
    </>
  )
}
