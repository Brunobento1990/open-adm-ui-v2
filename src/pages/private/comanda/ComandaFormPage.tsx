import { Icon } from '@iconify/react'
import { IconButton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiComanda } from '../../../api/useApiComanda'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { useSnackbarApp } from '../../../components/Snackbar/useSnackbar'
import { FormRoot } from '../../../form'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import type { Cliente } from '../../../types/ClienteTypes'
import { ComandaStatus, ComandaStatusLabel, type Comanda, type ComandaItem } from '../../../types/ComandaTypes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import type { TabelaDePreco } from '../../../types/TabelaDePrecoTypes'
import { ComandaGeralTab } from './ComandaGeralTab'
import { ComandaHistoricoTab } from './ComandaHistoricoTab'
import { ComandaProdutosTab } from './ComandaProdutosTab'
import { ComandaCompartilhamentoAction } from './ComandaCompartilhamentoAction'

enum ComandaTab {
  Geral = 'geral',
  Produtos = 'produtos',
  Historico = 'historico',
}

type ComandaFormPageProps = { action: FormActionType }

export function ComandaFormPage({ action }: ComandaFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, alterarStatus, criar, obter } = useApiComanda()
  const { navigate } = useNavigationApp()
  const snack = useSnackbarApp()
  const { isCelular } = useThemeApp()
  const [tab, setTab] = useState(ComandaTab.Geral)
  const [comanda, setComanda] = useState<Comanda>()
  const [identificacao, setIdentificacao] = useState('')
  const [observacao, setObservacao] = useState('')
  const [desconto, setDesconto] = useState(0)
  const [tabelaDePreco, setTabelaDePreco] = useState<TabelaDePreco>()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [itens, setItens] = useState<ComandaItem[]>([])
  const [modalStatusOpen, setModalStatusOpen] = useState(false)
  const [novoStatus, setNovoStatus] = useState<ComandaStatus>()
  const readonly = action === FormAction.View
    || (action === FormAction.Edit && comanda?.status !== ComandaStatus.Aberta)

  async function carregarComanda(comandaId: string) {
    const response = await obter.fetch(comandaId)
    if (!response) return

    setComanda(response)
    setIdentificacao(response.identificacao)
    setObservacao(response.observacao ?? '')
    setDesconto(response.desconto ?? 0)
    setTabelaDePreco(response.tabelaDePreco)
    setClientes(response.clientes ?? [])
  }

  useEffect(() => {
    // O retorno remoto inicializa o formulário após a resposta da API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (action !== FormAction.Create && id) carregarComanda(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  async function mudarAba(novaAba: ComandaTab) {
    setTab(novaAba)
    if (novaAba === ComandaTab.Geral && id && action !== FormAction.Create) await carregarComanda(id)
  }

  async function salvar() {
    if (readonly) return

    if (!identificacao.trim() || !tabelaDePreco?.id) {
      snack.show('Informe a identificação e a tabela de preço', 'error')
      setTab(ComandaTab.Geral)
      return
    }

    const cabecalho = {
      identificacao: identificacao.trim(),
      tabelaDePrecoId: tabelaDePreco.id,
      observacao: observacao.trim() || undefined,
      desconto: desconto === 0 ? undefined : desconto,
      clientesIds: Array.from(new Set(clientes.map((cliente) => cliente.id))),
    }
    const response = action === FormAction.Edit && id
      ? await atualizar.fetch(id, cabecalho)
      : await criar.fetch({
        ...cabecalho,
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          desconto: item.desconto,
        })),
      })

    if (response) navigate(PrivateRoutePath.Comanda)
  }

  async function mudarStatus(status: ComandaStatus) {
    if (!id) return
    const response = await alterarStatus.fetch(id, status)
    if (!response) return

    setModalStatusOpen(false)
    setNovoStatus(undefined)
    await carregarComanda(id)
  }

  const loading = obter.loading || criar.loading || atualizar.loading || alterarStatus.loading

  return (
    <FormRoot.Form
      action={action}
      loading={loading}
      readonly={readonly}
      responsiveMobileActions
      submit={salvar}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Comanda}
      footer={{
        children: comanda && (
          <Stack direction="row" spacing={0.5} sx={{ mr: 'auto' }}>
            {isCelular ? (
              <Tooltip title="Trocar status">
                <IconButton
                  aria-label="Trocar status"
                  disabled={alterarStatus.loading}
                  onClick={() => {
                    setNovoStatus(undefined)
                    setModalStatusOpen(true)
                  }}
                >
                  <IconApp icon="solar:refresh-circle-linear" />
                </IconButton>
              </Tooltip>
            ) : (
              <ButtonApp
                disabled={alterarStatus.loading}
                onClick={() => {
                  setNovoStatus(undefined)
                  setModalStatusOpen(true)
                }}
                startIcon={<Icon icon="solar:refresh-circle-linear" />}
                variant={ButtonAppVariant.Outlined}
              >
                Trocar status
              </ButtonApp>
            )}
            <ComandaCompartilhamentoAction
              comandaId={comanda.id}
              idPublico={comanda.idPublico}
              onChanged={() => carregarComanda(comanda.id)}
              somenteIcone={isCelular}
            />
          </Stack>
        ),
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, value: ComandaTab) => mudarAba(value)}
        sx={{
          mb: { xs: 1.5, md: 2 },
          '& .MuiTab-root': {
            flex: { xs: 1, md: '0 1 auto' },
            minWidth: { xs: 0, md: 90 },
            px: { xs: 0.5, md: 2 },
          },
        }}
        variant="standard"
      >
        <Tab label="Geral" value={ComandaTab.Geral} />
        <Tab label="Produtos" value={ComandaTab.Produtos} />
        {action !== FormAction.Create && (
          <Tab label="Histórico" value={ComandaTab.Historico} />
        )}
      </Tabs>

      {tab === ComandaTab.Geral && (
        <ComandaGeralTab
          clientes={clientes}
          comanda={comanda}
          desconto={desconto}
          identificacao={identificacao}
          loading={obter.loading && action !== FormAction.Create}
          observacao={observacao}
          onClientesChange={setClientes}
          onDescontoChange={setDesconto}
          onIdentificacaoChange={setIdentificacao}
          onObservacaoChange={setObservacao}
          onTabelaDePrecoChange={(value) => setTabelaDePreco(value)}
          readonly={readonly}
          tabelaDePreco={tabelaDePreco}
          valorSubtotal={comanda
            ? comanda.valorTotal
            : itens.reduce((total, item) => total + item.valorTotal, 0)}
        />
      )}
      {tab === ComandaTab.Produtos && (
        <ComandaProdutosTab
          action={action}
          comandaId={id}
          itens={itens}
          onIrParaGeral={() => setTab(ComandaTab.Geral)}
          readonly={readonly}
          setItens={setItens}
          tabelaDePreco={tabelaDePreco}
        />
      )}
      {tab === ComandaTab.Historico && id && <ComandaHistoricoTab comandaId={id} />}

      {comanda && (
        <ModalChildren
          close={() => {
            setModalStatusOpen(false)
            setNovoStatus(undefined)
          }}
          footerChildren={(
            <Stack direction="row" spacing={1}>
              <ButtonApp
                onClick={() => {
                  setModalStatusOpen(false)
                  setNovoStatus(undefined)
                }}
                variant={ButtonAppVariant.Outlined}
              >
                Voltar
              </ButtonApp>
              <ButtonApp
                disabled={novoStatus === undefined}
                loading={alterarStatus.loading}
                onClick={() => novoStatus !== undefined && mudarStatus(novoStatus)}
              >
                Confirmar alteração
              </ButtonApp>
            </Stack>
          )}
          fullWidth
          maxWidth="xs"
          open={modalStatusOpen}
          titulo="Trocar status da comanda"
        >
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Typography color="text.secondary" variant="body2">Status atual: {ComandaStatusLabel[comanda.status]}</Typography>
            <InputApp
              id="novoStatus"
              label="Novo status"
              onChange={(_, value) => setNovoStatus(Number(value) as ComandaStatus)}
              options={Object.values(ComandaStatus)
                .filter((status): status is ComandaStatus => typeof status === 'number' && status !== comanda.status)
                .map((status) => ({ label: ComandaStatusLabel[status], value: status }))}
              required
              type={InputAppType.Select}
              value={novoStatus ?? ''}
            />
            {(novoStatus === ComandaStatus.Fechada || novoStatus === ComandaStatus.Cancelada) && (
              <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
                Confirme abaixo para alterar a comanda para {ComandaStatusLabel[novoStatus]}.
              </Typography>
            )}
          </Stack>
        </ModalChildren>
      )}
    </FormRoot.Form>
  )
}
