import { useEffect, useState } from 'react'
import { useApiCep } from '../../../api/useApiCep'
import { useApiCliente } from '../../../api/useApiCliente'
import { useApiPedido } from '../../../api/useApiPedido'
import { useApiTabelaDePreco } from '../../../api/useApiTabelaDePreco'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppJustifyContent,
} from '../../../components/BoxApp/boxAppTypes'
import { ButtonApp } from '../../../components/ButtonApp/ButtonApp'
import { CepConsultaButton } from '../../../components/CepConsultaButton/CepConsultaButton'
import { ClienteRepresentanteDropDown } from '../../../components/DropDown/ClienteRepresentanteDropDown'
import { ItemCatalogoRepresentanteDropDown } from '../../../components/DropDown/ItemCatalogoRepresentanteDropDown'
import { TabelaDePrecoDropDown } from '../../../components/DropDown/TabelaDePrecoDropDown'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { IconButtonComTooltipVariant } from '../../../components/IconButtonComTolltip/iconButtonComTooltipTypes'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { TabsApp } from '../../../components/TabsApp/TabsApp'
import { TextApp, TextAppColor } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useMediaQueryApp } from '../../../hook/useMediaQueryApp'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { EnderecoClienteVendaField } from '../../../types/ClienteVendaTypes'
import {
  PedidoFormField,
  PedidoItemFormField,
  type PedidoCriarPayload,
  type PedidoFormValues,
  type PedidoItemForm,
} from '../../../types/PedidoTypes'
import type { ItemCatalogoRepresentante, TabelaDePreco } from '../../../types/TabelaDePrecoTypes'
import { PedidoItemCard } from './PedidoItemCard'
import { PedidoItensTable } from './PedidoItensTable'

const PedidoTab = { Geral: 0, Itens: 1 } as const
const PedidoFormConfig = {
  AddressMaxLength: 255,
  CepMaxLength: 8,
  NumberMaxLength: 10,
  UfMaxLength: 2,
} as const

const initialValues: PedidoFormValues = {
  enderecoEntrega: {},
  itensPedido: [],
  tabelaDePrecoId: '',
  usuarioId: '',
}

const validationSchema = new YupAdapter()
  .string(PedidoFormField.UsuarioId, 'Selecione o cliente')
  .string(PedidoFormField.TabelaDePrecoId, 'Selecione a tabela de preço')
  .build()

export function PedidoFormPage() {
  const { navigate } = useNavigationApp()
  const { isCelular } = useMediaQueryApp()
  const { consultar: consultarCepApi } = useApiCep()
  const { obter: obterCliente } = useApiCliente()
  const { criar } = useApiPedido()
  const { obterAtiva } = useApiTabelaDePreco()
  const [tab, setTab] = useState<number>(PedidoTab.Geral)
  const [itemPedido, setItemPedido] = useState<PedidoItemForm>({})
  const [itemError, setItemError] = useState('')
  const form = useFormikAdapter<PedidoFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values: PedidoFormValues) => {
      if (values.itensPedido.length === 0) {
        setItemError('Adicione ao menos um item ao pedido')
        setTab(PedidoTab.Itens)
        return
      }

      const payload: PedidoCriarPayload = {
        tabelaDePrecoId: values.tabelaDePrecoId as '',
        usuarioId: values.usuarioId as string,
        enderecoEntrega: values.enderecoEntrega,
        itensPedido: values.itensPedido.map((item) => ({
          produtoId: item.produtoId as string,
          pesoId: item.pesoId,
          quantidade: item.quantidade as number,
          tamanhoId: item.tamanhoId,
          valorUnitario: item.valorUnitario as number,
        })),
      }
      const response = await criar.fetch(payload)
      if (response) navigate(PrivateRoutePath.Pedido)
    },
  })

  useEffect(() => {
    async function carregarTabelaDePrecoPadrao() {
      const tabelaDePreco = await obterAtiva.fetch()
      if (!tabelaDePreco?.id) return
      form.setValue({
        tabelaDePreco,
        tabelaDePrecoId: tabelaDePreco.id,
      })
    }

    carregarTabelaDePrecoPadrao()
    // O carregamento da tabela padrão ocorre somente na abertura da página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function selecionarCliente(cliente?: { id: string; nome: string }) {
    if (!cliente) {
      setTab(PedidoTab.Geral)
      form.setValue({ enderecoEntrega: {}, usuario: undefined, usuarioId: '' })
      return
    }
    const response = await obterCliente.fetch(cliente.id)
    if (response) {
      form.setValue({
        enderecoEntrega: { ...response.enderecoUsuario },
        usuario: response,
        usuarioId: response.id,
      })
    }
  }

  async function selecionarTabelaDePreco(tabelaDePreco?: TabelaDePreco) {
    setItemPedido({})
    if (!tabelaDePreco) {
      setTab(PedidoTab.Geral)
      form.setValue({ tabelaDePreco: undefined, tabelaDePrecoId: '' })
      return
    }
    form.setValue({
      tabelaDePreco,
      tabelaDePrecoId: tabelaDePreco.id,
    })
  }

  function selecionarItemCatalogo(itemCatalogo?: ItemCatalogoRepresentante) {
    setItemPedido(
      itemCatalogo
        ? {
            itemCatalogo,
            pesoId: itemCatalogo.pesoId ?? undefined,
            produtoId: itemCatalogo.produtoId,
            tamanhoId: itemCatalogo.tamanhoId ?? undefined,
            valorUnitario: form.values.usuario?.isAtacado
              ? itemCatalogo.valorUnitarioAtacado
              : itemCatalogo.valorUnitarioVarejo,
          }
        : {},
    )
    setItemError('')
  }

  function adicionarItem() {
    if (!form.values.tabelaDePrecoId) {
      setItemError('Selecione uma tabela de preço na aba Geral antes de adicionar itens')
      return
    }
    if (
      !itemPedido.produtoId ||
      !itemPedido.quantidade ||
      itemPedido.quantidade <= 0 ||
      itemPedido.valorUnitario === undefined ||
      itemPedido.valorUnitario < 0
    ) {
      setItemError('Informe produto, quantidade e valor unitário válidos')
      return
    }
    form.setValue({ itensPedido: [...form.values.itensPedido, itemPedido] })
    setItemPedido({})
    setItemError('')
  }

  function atualizarQuantidade(quantidade: number) {
    setItemPedido((current) => ({ ...current, quantidade }))
    setItemError('')
  }

  function alterarQuantidade(incremento: number) {
    atualizarQuantidade(Math.max(1, (itemPedido.quantidade ?? 0) + incremento))
  }

  function removerItem(index: number) {
    form.setValue({
      itensPedido: form.values.itensPedido.filter((_, current) => current !== index),
    })
  }

  function setEndereco(field: EnderecoClienteVendaField, value?: string | number | boolean) {
    form.setValue({
      enderecoEntrega: {
        ...form.values.enderecoEntrega,
        [field]: String(value ?? ''),
      },
    })
  }

  async function consultarCep() {
    const cep = form.values.enderecoEntrega?.cep
    if (!cep) return
    const response = await consultarCepApi.fetch(cep)
    if (!response) return
    form.setValue({
      enderecoEntrega: {
        ...form.values.enderecoEntrega,
        bairro: response.bairro,
        cep: response.cep,
        complemento: response.complemento,
        localidade: response.localidade,
        logradouro: response.logradouro,
        uf: response.uf,
      },
    })
  }

  const endereco = form.values.enderecoEntrega ?? {}
  const loading =
    criar.loading || obterCliente.loading || obterAtiva.loading || consultarCepApi.loading
  const clientePendente = !form.values.usuarioId
  const tabelaDePrecoPendente = !form.values.tabelaDePrecoId
  const itensBloqueados = clientePendente || tabelaDePrecoPendente
  const itensBloqueadosMensagem = clientePendente
    ? tabelaDePrecoPendente
      ? 'Selecione o cliente e a tabela de preço na aba Geral'
      : 'Selecione o cliente na aba Geral'
    : 'Selecione a tabela de preço na aba Geral'
  const pedidoTabs = [
    { label: 'Geral', value: PedidoTab.Geral },
    {
      disabled: itensBloqueados,
      label: 'Itens',
      value: PedidoTab.Itens,
      warning: itensBloqueados,
      warningMessage: itensBloqueadosMensagem,
    },
  ]

  return (
    <FormRoot.Form
      loading={loading}
      responsiveMobileActions
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Pedido}
    >
      <TabsApp
        ariaLabel="Seções do cadastro de pedido"
        items={pedidoTabs}
        onChange={setTab}
        value={tab}
      />

      {tab === PedidoTab.Geral && (
        <>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow sm={6} xs={12}>
              <ClienteRepresentanteDropDown
                error={form.error(PedidoFormField.UsuarioId)}
                helperText={form.helperText(PedidoFormField.UsuarioId)}
                onChange={selecionarCliente}
                value={form.values.usuario}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={6} xs={12}>
              <TabelaDePrecoDropDown
                error={form.error(PedidoFormField.TabelaDePrecoId)}
                helperText={form.helperText(PedidoFormField.TabelaDePrecoId)}
                onChange={selecionarTabelaDePreco}
                value={form.values.tabelaDePreco}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>

          <TextApp color={TextAppColor.Primary}>Endereço de entrega</TextApp>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow sm={3} xs={12}>
              <BoxApp alignItems={BoxAppAlignItems.Center} display={BoxAppDisplay.Flex}>
                <InputApp
                  id={EnderecoClienteVendaField.Cep}
                  label="CEP"
                  maxLength={PedidoFormConfig.CepMaxLength}
                  onChange={(_, value) =>
                    setEndereco(
                      EnderecoClienteVendaField.Cep,
                      String(value ?? '')
                        .replace(/\D/g, '')
                        .slice(0, 8),
                    )
                  }
                  value={endereco.cep ?? ''}
                />
                <CepConsultaButton
                  disabled={!endereco.cep}
                  loading={consultarCepApi.loading}
                  onClick={consultarCep}
                />
              </BoxApp>
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={6} xs={12}>
              <InputApp
                id={EnderecoClienteVendaField.Logradouro}
                label="Rua"
                maxLength={PedidoFormConfig.AddressMaxLength}
                onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Logradouro, value)}
                value={endereco.logradouro ?? ''}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={3} xs={12}>
              <InputApp
                id={EnderecoClienteVendaField.Numero}
                label="N°"
                maxLength={PedidoFormConfig.NumberMaxLength}
                onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Numero, value)}
                value={endereco.numero ?? ''}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow sm={6} xs={12}>
              <InputApp
                id={EnderecoClienteVendaField.Localidade}
                label="Cidade"
                maxLength={PedidoFormConfig.AddressMaxLength}
                onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Localidade, value)}
                value={endereco.localidade ?? ''}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={3} xs={12}>
              <InputApp
                id={EnderecoClienteVendaField.Bairro}
                label="Bairro"
                maxLength={PedidoFormConfig.AddressMaxLength}
                onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Bairro, value)}
                value={endereco.bairro ?? ''}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={3} xs={12}>
              <InputApp
                id={EnderecoClienteVendaField.Uf}
                label="UF"
                maxLength={PedidoFormConfig.UfMaxLength}
                onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Uf, value)}
                value={endereco.uf ?? ''}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12}>
              <InputApp
                id={EnderecoClienteVendaField.Complemento}
                label="Complemento"
                maxLength={PedidoFormConfig.AddressMaxLength}
                onChange={(_, value) => setEndereco(EnderecoClienteVendaField.Complemento, value)}
                value={endereco.complemento ?? ''}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
        </>
      )}

      {tab === PedidoTab.Itens && (
        <>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12}>
              <ItemCatalogoRepresentanteDropDown
                onChange={selecionarItemCatalogo}
                tabelaDePrecoId={form.values.tabelaDePrecoId}
                value={itemPedido.itemCatalogo}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow sm={4} xs={12}>
              {isCelular ? (
                <BoxApp alignItems={BoxAppAlignItems.End} display={BoxAppDisplay.Flex} gap="0.5rem">
                  <IconButtonComTolltip
                    aria-label="Diminuir quantidade"
                    disabled={(itemPedido.quantidade ?? 0) <= 1}
                    onClick={() => alterarQuantidade(-1)}
                    size="small"
                    tooltip="Diminuir quantidade"
                    variant={IconButtonComTooltipVariant.Contained}
                  >
                    <IconApp icon="tabler:minus" width="1.25rem" />
                  </IconButtonComTolltip>
                  <InputApp
                    id={PedidoItemFormField.Quantidade}
                    label="Quantidade"
                    onChange={(_, value) => atualizarQuantidade(Number(value))}
                    type={InputAppType.Number}
                    value={itemPedido.quantidade ?? ''}
                  />

                  <IconButtonComTolltip
                    aria-label="Aumentar quantidade"
                    onClick={() => alterarQuantidade(1)}
                    size="small"
                    tooltip="Aumentar quantidade"
                    variant={IconButtonComTooltipVariant.Contained}
                  >
                    <IconApp icon="tabler:plus" width="1.25rem" />
                  </IconButtonComTolltip>
                </BoxApp>
              ) : (
                <InputApp
                  id={PedidoItemFormField.Quantidade}
                  label="Quantidade"
                  onChange={(_, value) => atualizarQuantidade(Number(value))}
                  type={InputAppType.Number}
                  value={itemPedido.quantidade ?? ''}
                />
              )}
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={4} xs={12}>
              <InputApp
                id={PedidoItemFormField.ValorUnitario}
                label="Valor unitário"
                onChange={(_, value) => {
                  setItemPedido((current) => ({ ...current, valorUnitario: Number(value) }))
                  setItemError('')
                }}
                startAdornment="R$"
                type={InputAppType.Currency}
                value={itemPedido.valorUnitario ?? ''}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={4} xs={12}>
              <BoxApp
                alignItems={BoxAppAlignItems.Center}
                display={BoxAppDisplay.Flex}
                height="100%"
                justifyContent={BoxAppJustifyContent.Start}
              >
                <ButtonApp disabled={tabelaDePrecoPendente} onClick={adicionarItem}>
                  Adicionar item
                </ButtonApp>
              </BoxApp>
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
          {itemError && <TextApp color="error.main">{itemError}</TextApp>}
          {form.values.itensPedido.length === 0 ? (
            <TextApp color={TextAppColor.Secondary}>Nenhum item adicionado.</TextApp>
          ) : isCelular ? (
            <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={1}>
              {form.values.itensPedido.map((item, index) => (
                <PedidoItemCard
                  item={item}
                  key={`${item.produtoId}-${item.pesoId ?? ''}-${item.tamanhoId ?? ''}-${index}`}
                  onRemove={() => removerItem(index)}
                />
              ))}
            </BoxApp>
          ) : (
            <PedidoItensTable itens={form.values.itensPedido} onRemove={removerItem} />
          )}
        </>
      )}
    </FormRoot.Form>
  )
}
