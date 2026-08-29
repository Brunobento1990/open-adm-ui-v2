import { useEffect } from 'react'
import { useApiAtendimentoNumero } from '../../api/useApiAtendimentoNumero'
import { InputApp } from '../../components/InputApp/InputApp'
import { InputAppType } from '../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../form'
import { useFormikAdapter } from '../../hook/useFormikAdapter'
import { YupAdapter } from '../../lib/YupAdapter'
import {
  AtendimentoNumeroFormField,
  TipoProvedorWhatsAppEnum,
  type AtendimentoNumeroForm,
} from '../../types/AtendimentoNumeroTypes'

const tipoProvedorWhatsAppOptions = [
  {
    label: 'Evolution API',
    value: TipoProvedorWhatsAppEnum.EvoltuionApi,
  },
  {
    label: 'Wuz API',
    value: TipoProvedorWhatsAppEnum.WuzApi,
  },
]

const atendimentoNumeroInitialValues: AtendimentoNumeroForm = {
  [AtendimentoNumeroFormField.Numero]: '',
  [AtendimentoNumeroFormField.Descricao]: '',
  [AtendimentoNumeroFormField.TipoProvedorWhatsApp]: TipoProvedorWhatsAppEnum.EvoltuionApi,
}

const atendimentoNumeroValidationSchema = new YupAdapter()
  .string(AtendimentoNumeroFormField.Numero)
  .string(AtendimentoNumeroFormField.Descricao)
  .number(AtendimentoNumeroFormField.TipoProvedorWhatsApp)
  .build()

export function AtendimentoNumeroPage() {
  const { obter, salvar } = useApiAtendimentoNumero()
  const form = useFormikAdapter<AtendimentoNumeroForm>({
    initialValues: atendimentoNumeroInitialValues,
    validationSchema: atendimentoNumeroValidationSchema,
    onSubmit: async (values) => {
      await salvar.fetch(values)
    },
  })

  async function buscarAtendimentoNumero() {
    const response = await obter.fetch()

    if (response) {
      form.setValue(response)
    }
  }

  useEffect(() => {
    buscarAtendimentoNumero()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FormRoot.Form
      loading={obter.loading || salvar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={4}>
          <InputApp
            error={form.error(AtendimentoNumeroFormField.Numero)}
            helperText={form.helperText(AtendimentoNumeroFormField.Numero)}
            id={AtendimentoNumeroFormField.Numero}
            label="Numero"
            name={AtendimentoNumeroFormField.Numero}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o numero"
            required
            maxLength={20}
            type={InputAppType.Text}
            value={form.values.numero}
          />
        </FormRoot.FormItemRow>

        <FormRoot.FormItemRow xs={12} md={4}>
          <InputApp
            error={form.error(AtendimentoNumeroFormField.TipoProvedorWhatsApp)}
            helperText={form.helperText(AtendimentoNumeroFormField.TipoProvedorWhatsApp)}
            id={AtendimentoNumeroFormField.TipoProvedorWhatsApp}
            label="Tipo provedor WhatsApp"
            name={AtendimentoNumeroFormField.TipoProvedorWhatsApp}
            onBlur={form.onBlur}
            onChange={(id, value) => form.onChange(id, Number(value))}
            options={tipoProvedorWhatsAppOptions}
            required
            type={InputAppType.Select}
            value={form.values.tipoProvedorWhatsApp}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>

      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12}>
          <InputApp
            error={form.error(AtendimentoNumeroFormField.Descricao)}
            helperText={form.helperText(AtendimentoNumeroFormField.Descricao)}
            id={AtendimentoNumeroFormField.Descricao}
            label="Descricao"
            multiline
            name={AtendimentoNumeroFormField.Descricao}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Descreva o atendimento"
            required
            rows={4}
            maxLength={255}
            type={InputAppType.Text}
            value={form.values.descricao}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
