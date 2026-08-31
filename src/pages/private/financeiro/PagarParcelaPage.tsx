import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiParcela } from '../../../api/useApiParcela'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { MeioDePagamentoDropDown } from '../../../components/DropDown/MeioDePagamentoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ProgressApp } from '../../../components/ProgressApp/ProgressApp'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  MeioDePagamento,
  PagarParcelaFormField,
  TipoFatura,
  type PagarParcelaForm,
  type Parcela,
} from '../../../types/FaturaTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney } from '../../../utils/moneyUtils'

function dataAtualInput() {
  const agora = new Date()
  const offset = agora.getTimezoneOffset() * 60_000
  return new Date(agora.getTime() - offset).toISOString().slice(0, 10)
}

const initialValues: PagarParcelaForm = {
  valor: 0,
  desconto: 0,
  juros: 0,
  meioDePagamento: MeioDePagamento.Pix,
  dataDePagamento: dataAtualInput(),
  observacao: '',
}

const validationSchema = new YupAdapter()
  .number(PagarParcelaFormField.Valor, 'Informe um valor maior que zero', 0.01)
  .build()

type ResumoLinhaProps = { label: string; value: string; destaque?: boolean }

function ResumoLinha({ destaque, label, value }: ResumoLinhaProps) {
  return (
    <StackApp direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
      <TextApp color={destaque ? TextAppColor.Default : TextAppColor.Secondary} weight={destaque ? TextAppWeight.SemiBold : undefined}>{label}</TextApp>
      <TextApp weight={destaque ? TextAppWeight.SemiBold : undefined}>{value}</TextApp>
    </StackApp>
  )
}

export function PagarParcelaPage() {
  const { id } = useParams<{ id: string }>()
  const { navigate } = useNavigationApp()
  const { obter, pagar } = useApiParcela()
  const [parcela, setParcela] = useState<Parcela>()
  const urlVoltar = parcela?.fatura.tipo === TipoFatura.APagar
    ? PrivateRoutePath.ContaAPagar
    : PrivateRoutePath.ContaAReceber
  const form = useFormikAdapter<PagarParcelaForm>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (!id) return
      const response = await pagar.fetch({
        id,
        valor: Number(values.valor),
        desconto: values.desconto || undefined,
        juros: values.juros || undefined,
        meioDePagamento: values.meioDePagamento ? Number(values.meioDePagamento) : undefined,
        dataDePagamento: values.dataDePagamento || undefined,
        observacao: values.observacao?.trim() || undefined,
      })
      if (response) navigate(urlVoltar)
    },
  })
  const totalRecebido = Math.max(
    0,
    Number(form.values.valor ?? 0) -
      Number(form.values.desconto ?? 0) +
      Number(form.values.juros ?? 0),
  )

  useEffect(() => {
    if (!id) return
    async function carregar() {
      const response = await obter.fetch(id as string)
      if (!response) return
      setParcela(response)
      form.setValue({ valor: response.valorAPagarAReceber })
    }
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <FormRoot.Form loading={obter.loading || pagar.loading} responsiveMobileActions submit={form.onSubmit} textoButton="Baixar parcela" urlVoltar={urlVoltar}>
      {obter.loading && <ProgressApp />}
      {parcela && (
        <StackApp spacing={3} sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
          <BoxApp border="1px solid" borderColor="divider" borderRadius={1} padding="1rem">
            <StackApp spacing={1.5}>
              <StackApp direction={{ xs: 'column', sm: 'row' }} spacing={0.5} sx={{ justifyContent: 'space-between' }}>
                <TextApp weight={TextAppWeight.SemiBold}>
                  Fatura #{parcela.fatura.numero}{parcela.fatura.pedido?.numero ? ` · Pedido #${parcela.fatura.pedido.numero}` : ''}
                </TextApp>
                <TextApp weight={TextAppWeight.SemiBold}>Parcela {parcela.numeroDaParcela}</TextApp>
              </StackApp>
              <TextApp>{parcela.fatura.usuario?.nome || '-'}</TextApp>
              <StackApp direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between' }}>
                <TextApp color={TextAppColor.Secondary}>Vencimento {formatarDataHoraUtcLocal(parcela.dataDeVencimento)}</TextApp>
                <StackApp direction="row" spacing={1}>
                  <TextApp color={TextAppColor.Secondary}>Restante</TextApp>
                  <TextApp weight={TextAppWeight.SemiBold}>{formatMoney(parcela.valorAPagarAReceber)}</TextApp>
                </StackApp>
              </StackApp>
            </StackApp>
          </BoxApp>

          <FormRoot.FormRow>
            <FormRoot.FormItemRow md={6} xs={12}>
              <InputApp error={form.error(PagarParcelaFormField.Valor)} helperText={form.helperText(PagarParcelaFormField.Valor)} id={PagarParcelaFormField.Valor} label="Valor recebido" onBlur={form.onBlur} onChange={form.onChange} required startAdornment="R$" type={InputAppType.Currency} value={form.values.valor} />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow md={6} xs={12}>
              <InputApp id={PagarParcelaFormField.DataDePagamento} label="Data do pagamento" onChange={form.onChange} type={InputAppType.Date} value={form.values.dataDePagamento ?? ''} />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow xs={12}>
              <MeioDePagamentoDropDown
                id={PagarParcelaFormField.MeioDePagamento}
                onChange={(value) => form.onChange(
                  PagarParcelaFormField.MeioDePagamento,
                  value,
                )}
                value={form.values.meioDePagamento}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>

          <StackApp spacing={1}>
            <TextApp weight={TextAppWeight.SemiBold}>Ajustes</TextApp>
            <FormRoot.FormRow>
              <FormRoot.FormItemRow md={6} xs={12}>
                <InputApp id={PagarParcelaFormField.Desconto} label="Desconto" onChange={form.onChange} startAdornment="R$" type={InputAppType.Currency} value={form.values.desconto ?? 0} />
              </FormRoot.FormItemRow>
              <FormRoot.FormItemRow md={6} xs={12}>
                <InputApp id={PagarParcelaFormField.Juros} label="Juros" onChange={form.onChange} startAdornment="R$" type={InputAppType.Currency} value={form.values.juros ?? 0} />
              </FormRoot.FormItemRow>
            </FormRoot.FormRow>
          </StackApp>

          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12}>
              <InputApp id={PagarParcelaFormField.Observacao} label="Observação" maxLength={500} multiline onChange={form.onChange} rows={3} value={form.values.observacao ?? ''} />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>

          <StackApp spacing={0.75}>
            <ResumoLinha label="Valor da parcela" value={formatMoney(parcela.valorAPagarAReceber)} />
            <ResumoLinha label="Desconto" value={formatMoney(Number(form.values.desconto ?? 0))} />
            <ResumoLinha label="Juros" value={formatMoney(Number(form.values.juros ?? 0))} />
            <BoxApp borderTop="1px solid" borderColor="divider" pt="0.75rem">
              <ResumoLinha destaque label="Total recebido" value={formatMoney(totalRecebido)} />
            </BoxApp>
          </StackApp>
        </StackApp>
      )}
    </FormRoot.Form>
  )
}
