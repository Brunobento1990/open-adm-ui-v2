import { useApiFatura } from '../../../api/useApiFatura'
import { ClienteEcommerceDropDown } from '../../../components/DropDown/ClienteEcommerceDropDown'
import { FaturaParcelaCard } from '../../../components/Fatura/FaturaParcelaCard'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { FaturaFormField, TipoFatura, type FaturaCriarForm } from '../../../types/FaturaTypes'
import { gerarParcelas } from '../../../utils/gerarParcelas'

type Props = { tipo: TipoFatura; urlVoltar: string }
const initialValues: FaturaCriarForm = {
  parcelas: [],
  quantidadeDeParcelas: 1,
  total: 0,
  usuarioId: '',
}
const validationSchema = new YupAdapter()
  .string(FaturaFormField.UsuarioId, 'Informe o cliente')
  .number(FaturaFormField.QuantidadeDeParcelas, 'Informe a quantidade de parcelas')
  .number(FaturaFormField.Total, 'Informe o valor total', 0.01)
  .build()

export function FaturaFormPage({ tipo, urlVoltar }: Props) {
  const { navigate } = useNavigationApp()
  const { criar } = useApiFatura()
  const form = useFormikAdapter<FaturaCriarForm>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const response = await criar.fetch({
        parcelas: values.parcelas,
        tipo,
        usuarioId: values.usuarioId,
      })
      if (response) navigate(urlVoltar)
    },
  })

  function atualizarParcelas() {
    form.setValue({
      parcelas: gerarParcelas(form.values.total, Number(form.values.quantidadeDeParcelas)),
    })
  }

  return (
    <FormRoot.Form
      loading={criar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={urlVoltar}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow md={6} xs={12}>
          <ClienteEcommerceDropDown
            error={form.error(FaturaFormField.UsuarioId)}
            helperText={form.helperText(FaturaFormField.UsuarioId)}
            onChange={(usuario) => form.setValue({ usuario, usuarioId: usuario?.id ?? '' })}
            value={form.values.usuario}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow md={3} xs={12}>
          <InputApp
            error={form.error(FaturaFormField.QuantidadeDeParcelas)}
            helperText={form.helperText(FaturaFormField.QuantidadeDeParcelas)}
            id={FaturaFormField.QuantidadeDeParcelas}
            label="Quantidade de parcelas"
            onBlur={atualizarParcelas}
            onChange={form.onChange}
            type={InputAppType.Number}
            value={form.values.quantidadeDeParcelas}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow md={3} xs={12}>
          <InputApp
            error={form.error(FaturaFormField.Total)}
            helperText={form.helperText(FaturaFormField.Total)}
            id={FaturaFormField.Total}
            label="Total"
            onBlur={atualizarParcelas}
            onChange={form.onChange}
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.total}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      {form.values.parcelas.length > 0 && (
        <TextApp weight={TextAppWeight.SemiBold}>Parcelas</TextApp>
      )}
      <FormRoot.FormRow spacing={2}>
        {form.values.parcelas.map((parcela, index) => (
          <FaturaParcelaCard
            index={index}
            key={parcela.numeroDaParcela}
            parcela={parcela}
            onChange={(value) =>
              form.setValue({
                parcelas: form.values.parcelas.map((item, itemIndex) =>
                  itemIndex === index ? value : item,
                ),
              })
            }
          />
        ))}
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
