import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiFatura } from '../../../api/useApiFatura'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { FaturaParcelaCard } from '../../../components/Fatura/FaturaParcelaCard'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ProgressApp } from '../../../components/ProgressApp/ProgressApp'
import { useSnackbarApp } from '../../../components/Snackbar/useSnackbar'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  type FaturaSugestaoParcelamento,
  type ParcelaRenegociacao,
  FaturaParcelaCardMode,
} from '../../../types/FaturaTypes'
import { gerarParcelas } from '../../../utils/gerarParcelas'
import { parcelasDaSugestao, parcelasSomamSaldo, saldoParcelas } from '../../../utils/faturaRenegociacao'
import { formatMoney } from '../../../utils/moneyUtils'

const RenegociarField = { Quantidade: 'quantidadeDeParcelas' } as const
type RenegociarForm = { quantidadeDeParcelas: number; parcelas: ParcelaRenegociacao[] }
const initialValues: RenegociarForm = { quantidadeDeParcelas: 1, parcelas: [] }
const validationSchema = new YupAdapter()
  .number(RenegociarField.Quantidade, 'Informe uma quantidade de parcelas válida')
  .build()

export function FaturaRenegociarPage() {
  const { id } = useParams<{ id: string }>()
  const { navigate } = useNavigationApp()
  const snack = useSnackbarApp()
  const { sugerirParcelamento, renegociar } = useApiFatura()
  const [sugestao, setSugestao] = useState<FaturaSugestaoParcelamento>()
  const [erroCarregamento, setErroCarregamento] = useState(false)
  const saldo = saldoParcelas(sugestao?.parcelas ?? [])

  const form = useFormikAdapter<RenegociarForm>({
    initialValues,
    validationSchema,
    onSubmit: async (values: RenegociarForm) => {
      if (!id || !sugestao || !values.parcelas.length) {
        snack.show('Não há parcelas em aberto para renegociar', 'error')
        return
      }
      if (values.parcelas.some((parcela) =>
        !parcela.dataDeVencimento || parcela.valor <= 0 || parcela.numeroDaParcela <= 0,
      )) {
        snack.show('Informe vencimento e valor válido para todas as parcelas', 'error')
        return
      }
      const numeros = values.parcelas.map((parcela) => parcela.numeroDaParcela)
      if (new Set(numeros).size !== numeros.length) {
        snack.show('Os números das parcelas não podem se repetir', 'error')
        return
      }
      if (!parcelasSomamSaldo(values.parcelas, saldo)) {
        snack.show('A soma das parcelas deve ser igual ao saldo em aberto', 'error')
        return
      }
      const response = await renegociar.fetch({ faturaId: id, parcelas: values.parcelas })
      if (response?.resultado) navigate(PrivateRoutePath.ContaAReceber)
    },
  })

  function atualizarQuantidade(value?: string | number | boolean) {
    const quantidade = Number(value)
    if (!Number.isInteger(quantidade) || quantidade < 1 || !saldo) {
      form.setValue({ quantidadeDeParcelas: quantidade, parcelas: [] })
      return
    }
    if (quantidade === form.values.parcelas.length) {
      form.setValue({ quantidadeDeParcelas: quantidade })
      return
    }
    const parcelas = gerarParcelas(saldo, quantidade).map((parcela) => ({
      dataDeVencimento: parcela.dataDeVencimento,
      meioDePagamento: parcela.meioDePagamento,
      numeroDaParcela: parcela.numeroDaParcela,
      valor: parcela.valor,
    }))
    form.setValue({ quantidadeDeParcelas: quantidade, parcelas })
  }

  function atualizarParcela(index: number, alteracao: Partial<ParcelaRenegociacao>) {
    form.setValue({
      parcelas: form.values.parcelas.map((parcela, atual) =>
        atual === index ? { ...parcela, ...alteracao } : parcela,
      ),
    })
  }

  useEffect(() => {
    if (!id) return
    async function carregar() {
      const response = await sugerirParcelamento.fetch(id as string)
      if (!response) {
        setErroCarregamento(true)
        return
      }
      const parcelas = parcelasDaSugestao(response.parcelas ?? [])
      setSugestao(response)
      form.setValue({ quantidadeDeParcelas: parcelas.length, parcelas })
    }
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loading = sugerirParcelamento.loading || renegociar.loading

  return (
    <FormRoot.Form
      buttonSalvarDisabled={loading || !sugestao || !form.values.parcelas.length}
      loading={loading}
      responsiveMobileActions
      submit={form.onSubmit}
      textoButton="Renegociar"
      urlVoltar={PrivateRoutePath.ContaAReceber}
    >
      {loading && <ProgressApp />}
      {erroCarregamento && <TextApp>Não foi possível carregar a fatura para renegociação.</TextApp>}
      {sugestao && (
        <>
          <BoxApp border="1px solid" borderColor="divider" borderRadius="8px" padding="1rem">
            <TextApp weight={TextAppWeight.SemiBold}>Fatura #{sugestao.numero}</TextApp>
            <TextApp>Total da fatura: {formatMoney(sugestao.total)}</TextApp>
            <TextApp weight={TextAppWeight.SemiBold}>Saldo em aberto: {formatMoney(saldo)}</TextApp>
          </BoxApp>
          <FormRoot.FormRow marginTop="1rem" spacing={2}>
            <FormRoot.FormItemRow sm={4} xs={12}>
              <InputApp
                error={form.error(RenegociarField.Quantidade)}
                helperText={form.helperText(RenegociarField.Quantidade)}
                id={RenegociarField.Quantidade}
                label="Quantidade de parcelas"
                onBlur={form.onBlur}
                onChange={(_, value) => atualizarQuantidade(value)}
                type={InputAppType.Number}
                value={form.values.quantidadeDeParcelas}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
          <TextApp weight={TextAppWeight.SemiBold}>Parcelas</TextApp>
          <FormRoot.FormRow spacing={2}>
            {form.values.parcelas.map((parcela, index) => (
              <FaturaParcelaCard
                index={index}
                key={parcela.numeroDaParcela}
                mode={FaturaParcelaCardMode.Renegociar}
                onChange={(value) => atualizarParcela(index, value)}
                parcela={parcela}
              />
            ))}
          </FormRoot.FormRow>
        </>
      )}
    </FormRoot.Form>
  )
}
