import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiFatura } from '../../../api/useApiFatura'
import { useApiPedido } from '../../../api/useApiPedido'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
} from '../../../components/BoxApp/boxAppTypes'
import { FaturaParcelaCard } from '../../../components/Fatura/FaturaParcelaCard'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ProgressApp } from '../../../components/ProgressApp/ProgressApp'
import { useSnackbarApp } from '../../../components/Snackbar/useSnackbar'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import type { FaturaCriarForm } from '../../../types/FaturaTypes'
import type { PedidoCobranca } from '../../../types/PedidoTypes'
import { gerarParcelas } from '../../../utils/gerarParcelas'
import { formatMoney } from '../../../utils/moneyUtils'

const quantidadeMinimaParcelas = 1

const NegociarCobrancaField = {
  QuantidadeDeParcelas: 'quantidadeDeParcelas',
} as const

type NegociarCobrancaForm = Pick<FaturaCriarForm, 'quantidadeDeParcelas' | 'parcelas'>

const initialValues: NegociarCobrancaForm = {
  quantidadeDeParcelas: quantidadeMinimaParcelas,
  parcelas: [],
}

const validationSchema = new YupAdapter()
  .number(NegociarCobrancaField.QuantidadeDeParcelas, 'Informe uma quantidade de parcelas válida')
  .build()

export function NegociarCobrancaPage() {
  const { id } = useParams<{ id: string }>()
  const { navigate } = useNavigationApp()
  const { cores } = useThemeApp()
  const snack = useSnackbarApp()
  const { cobranca } = useApiPedido()
  const { negociar } = useApiFatura()
  const [dadosCobranca, setDadosCobranca] = useState<PedidoCobranca>()
  const form = useFormikAdapter<NegociarCobrancaForm>({
    initialValues,
    validationSchema,
    onSubmit: async (values: NegociarCobrancaForm) => {
      if (!dadosCobranca || values.parcelas.length === 0) {
        snack.show('Informe uma quantidade de parcelas válida', 'error')
        return
      }
      if (values.parcelas.some((parcela) => !parcela.dataDeVencimento || !parcela.meioDePagamento)) {
        snack.show('Informe o vencimento e o meio de pagamento de todas as parcelas', 'error')
        return
      }
      const response = await negociar.fetch({
        pedidoId: dadosCobranca.pedidoId,
        parcelas: values.parcelas,
      })
      if (response?.resultado) navigate(PrivateRoutePath.Pedido)
    },
  })
  const loading = cobranca.loading || negociar.loading

  function atualizarQuantidade(value?: string | number | boolean) {
    const quantidadeDeParcelas = Number(value)
    form.setValue({
      quantidadeDeParcelas,
      parcelas: gerarParcelas(dadosCobranca?.total ?? 0, quantidadeDeParcelas),
    })
  }

  function alterarQuantidade(incremento: number) {
    atualizarQuantidade(Math.max(
      quantidadeMinimaParcelas,
      Number(form.values.quantidadeDeParcelas) + incremento,
    ))
  }

  useEffect(() => {
    if (!id) return
    async function carregarCobranca() {
      const response = await cobranca.fetch(id as string)
      if (!response) return
      setDadosCobranca(response)
      form.setValue({
        quantidadeDeParcelas: quantidadeMinimaParcelas,
        parcelas: gerarParcelas(response.total, quantidadeMinimaParcelas),
      })
    }
    carregarCobranca()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <FormRoot.Form
      loading={loading || !dadosCobranca}
      responsiveMobileActions
      submit={form.onSubmit}
      urlVoltar={PrivateRoutePath.Pedido}
    >
      {cobranca.loading && <ProgressApp />}
      {dadosCobranca && (
        <>
          <BoxApp border="1px solid" borderColor="divider" borderRadius="8px" padding="1rem">
            <TextApp weight={TextAppWeight.SemiBold}>Pedido: #{dadosCobranca.numero}</TextApp>
            <TextApp weight={TextAppWeight.SemiBold}>Total: {formatMoney(dadosCobranca.total)}</TextApp>
          </BoxApp>

          <FormRoot.FormRow marginTop="1rem" spacing={2}>
            <FormRoot.FormItemRow sm={4} xs={12}>
              <BoxApp alignItems={BoxAppAlignItems.End} display={BoxAppDisplay.Flex} gap="0.5rem">
                <IconButtonComTolltip
                  aria-label="Diminuir quantidade de parcelas"
                  disabled={form.values.quantidadeDeParcelas <= quantidadeMinimaParcelas || loading}
                  onClick={() => alterarQuantidade(-1)}
                  tooltip="Diminuir quantidade de parcelas"
                >
                  <IconApp color={cores.primary} icon="tabler:minus" />
                </IconButtonComTolltip>
                <InputApp
                  error={form.error(NegociarCobrancaField.QuantidadeDeParcelas)}
                  helperText={form.helperText(NegociarCobrancaField.QuantidadeDeParcelas)}
                  id={NegociarCobrancaField.QuantidadeDeParcelas}
                  label="Quantidade de parcelas"
                  onBlur={form.onBlur}
                  onChange={(_, value) => atualizarQuantidade(value)}
                  required
                  type={InputAppType.Number}
                  value={form.values.quantidadeDeParcelas}
                />
                <IconButtonComTolltip
                  aria-label="Aumentar quantidade de parcelas"
                  disabled={loading}
                  onClick={() => alterarQuantidade(1)}
                  tooltip="Aumentar quantidade de parcelas"
                >
                  <IconApp color={cores.primary} icon="tabler:plus" />
                </IconButtonComTolltip>
              </BoxApp>
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={4} xs={12}>
              <InputApp
                disabled
                id="total"
                label="Total da cobrança"
                startAdornment="R$"
                type={InputAppType.Currency}
                value={dadosCobranca.total}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>

          <TextApp weight={TextAppWeight.SemiBold}>Parcelas</TextApp>
          <FormRoot.FormRow spacing={2}>
            {form.values.parcelas.map((parcela, index) => (
              <FaturaParcelaCard
                index={index}
                key={parcela.numeroDaParcela}
                onChange={(value) => form.setValue({
                  parcelas: form.values.parcelas.map((item, itemIndex) =>
                    itemIndex === index ? value : item,
                  ),
                })}
                parcela={parcela}
              />
            ))}
          </FormRoot.FormRow>
        </>
      )}
    </FormRoot.Form>
  )
}
