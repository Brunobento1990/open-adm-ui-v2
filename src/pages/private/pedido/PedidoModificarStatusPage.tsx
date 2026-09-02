import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiFatura } from '../../../api/useApiFatura'
import { useApiPedido } from '../../../api/useApiPedido'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { DividerApp } from '../../../components/DividerApp/DividerApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { ProgressApp } from '../../../components/ProgressApp/ProgressApp'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { PedidoStatus, PedidoStatusOptions, type Pedido } from '../../../types/PedidoTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney } from '../../../utils/moneyUtils'

const PedidoStatusField = {
  Status: 'statusPedido',
} as const

type PedidoStatusForm = Pick<Pedido, 'statusPedido'>

const validationSchema = new YupAdapter()
  .number(PedidoStatusField.Status, 'Selecione o status')
  .build()

export function PedidoModificarStatusPage() {
  const { id } = useParams<{ id: string }>()
  const { navigate } = useNavigationApp()
  const { atualizarStatus, obter } = useApiPedido()
  const { baixarAutomaticamente, bonificar } = useApiFatura()
  const [pedido, setPedido] = useState<Pedido>()
  const [modalFinanceiroAberto, setModalFinanceiroAberto] = useState(false)
  const [modalDescontoAberto, setModalDescontoAberto] = useState(false)
  const [desconto, setDesconto] = useState(0)
  const form = useFormikAdapter<Partial<PedidoStatusForm>>({
    initialValues: { statusPedido: undefined },
    validationSchema,
    onSubmit: async (values) => {
      if (!pedido || values.statusPedido === undefined) return
      const response = await atualizarStatus.fetch({
        id: pedido.id,
        statusPedido: Number(values.statusPedido),
      })
      if (!response) return
      if (Number(values.statusPedido) === PedidoStatus.Entregue) {
        setModalFinanceiroAberto(true)
        return
      }
      navigate(PrivateRoutePath.Pedido)
    },
  })

  const valorTotal = pedido?.valorTotal ?? 0
  const descontoInvalido = desconto > valorTotal
  const loadingFinanceiro = baixarAutomaticamente.loading || bonificar.loading

  function finalizarFluxo() {
    setModalFinanceiroAberto(false)
    setModalDescontoAberto(false)
    navigate(PrivateRoutePath.Pedido)
  }

  async function bonificarPedido() {
    if (!pedido) return
    const response = await bonificar.fetch(pedido.id)
    if (response?.resultado) finalizarFluxo()
  }

  async function baixarAVista() {
    if (!pedido || descontoInvalido) return
    const response = await baixarAutomaticamente.fetch({
      pedidoId: pedido.id,
      desconto,
    })
    if (response?.resultado) finalizarFluxo()
  }

  function abrirDescontoAVista() {
    setDesconto(0)
    setModalFinanceiroAberto(false)
    setModalDescontoAberto(true)
  }

  function cancelarDescontoAVista() {
    setModalDescontoAberto(false)
    setModalFinanceiroAberto(true)
  }

  useEffect(() => {
    if (!id) return
    async function carregarPedido() {
      const response = await obter.fetch(id as string)
      if (!response) return
      setPedido(response)
      form.setValue({ statusPedido: response.statusPedido })
    }
    carregarPedido()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <>
      <FormRoot.Form
        loading={obter.loading || atualizarStatus.loading}
        responsiveMobileActions
        submit={form.onSubmit}
        urlVoltar={PrivateRoutePath.Pedido}
      >
        {obter.loading && <ProgressApp />}
        {pedido && (
          <StackApp spacing={3} sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
            <BoxApp border="1px solid" borderColor="divider" borderRadius={1} padding="1rem">
              <StackApp spacing={0.75}>
                <TextApp weight={TextAppWeight.SemiBold}>N°: #{pedido.numero}</TextApp>
                <TextApp>
                  Data de cadastro: {formatarDataHoraUtcLocal(pedido.dataDeCriacao)}
                </TextApp>
                <TextApp>Cliente: {pedido.usuario || '-'}</TextApp>
                <TextApp>Total: {formatMoney(pedido.valorTotal)}</TextApp>
              </StackApp>
            </BoxApp>
            <DividerApp>Selecione o status</DividerApp>
            <InputApp
              error={form.error(PedidoStatusField.Status)}
              helperText={form.helperText(PedidoStatusField.Status)}
              id={PedidoStatusField.Status}
              label="Status"
              onBlur={form.onBlur}
              onChange={form.onChange}
              options={PedidoStatusOptions}
              required
              type={InputAppType.Select}
              value={form.values.statusPedido}
            />
          </StackApp>
        )}
      </FormRoot.Form>

      <ModalChildren
        close={() => setModalFinanceiroAberto(false)}
        footerChildren={
          <StackApp
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: '100%', justifyContent: 'flex-end' }}
          >
            <ButtonApp
              disabled={loadingFinanceiro}
              loading={bonificar.loading}
              onClick={bonificarPedido}
              variant={ButtonAppVariant.Outlined}
            >
              Bonificado
            </ButtonApp>
            <ButtonApp
              disabled={loadingFinanceiro}
              onClick={abrirDescontoAVista}
              variant={ButtonAppVariant.Outlined}
            >
              Baixar à vista
            </ButtonApp>
            <ButtonApp
              disabled={loadingFinanceiro}
              onClick={() =>
                pedido && navigate(`${PrivateRoutePath.FaturaNegociarCobranca}/${pedido.id}`)
              }
            >
              Parcelar
            </ButtonApp>
          </StackApp>
        }
        fullWidth
        maxWidth="sm"
        open={modalFinanceiroAberto}
        titulo="Deseja parcelar o pedido?"
      >
        <TextApp>Escolha como deseja concluir o financeiro deste pedido.</TextApp>
      </ModalChildren>

      <ModalChildren
        close={cancelarDescontoAVista}
        disabledAction={descontoInvalido || loadingFinanceiro}
        action={baixarAVista}
        fullWidth
        loading={baixarAutomaticamente.loading}
        maxWidth="sm"
        open={modalDescontoAberto}
        textoButton="Confirmar baixa"
        titulo="Baixar pedido à vista"
      >
        <StackApp spacing={2}>
          <BoxApp>
            <TextApp>Valor do pedido: {formatMoney(valorTotal)}</TextApp>
            <TextApp>
              Valor após desconto: {formatMoney(Math.max(valorTotal - desconto, 0))}
            </TextApp>
          </BoxApp>
          <InputApp
            error={descontoInvalido}
            focus
            helperText={
              descontoInvalido ? 'O desconto não pode ser maior que o valor do pedido' : undefined
            }
            id="desconto"
            label="Desconto"
            onChange={(_, value) => setDesconto(Number(value) || 0)}
            startAdornment="R$"
            type={InputAppType.Currency}
            value={desconto}
          />
        </StackApp>
      </ModalChildren>
    </>
  )
}
