import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiPeso } from '../../../api/useApiPeso'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type IFormTypes } from '../../../types/Form'
import { PesoFormField, type Peso } from '../../../types/PesoTypes'

const PesoField = {
  DescricaoMaxLength: 255,
} as const

const pesoInitialValues: Partial<Peso> = {
  [PesoFormField.AlturaReal]: undefined,
  [PesoFormField.ComprimentoReal]: undefined,
  [PesoFormField.Descricao]: '',
  [PesoFormField.LarguraReal]: undefined,
  [PesoFormField.PesoReal]: undefined,
}

const pesoValidationSchema = new YupAdapter()
  .stringWithTests(
    PesoFormField.Descricao,
    [{
      name: 'maxLength',
      message: `A descrição deve ter no máximo ${PesoField.DescricaoMaxLength} caracteres`,
      test: (value) => !value || value.length <= PesoField.DescricaoMaxLength,
    }],
    'Informe a descrição',
  )
  .build()

function obterNumeroOpcional(value?: number) {
  return value === undefined || String(value).trim() === ''
    ? undefined
    : Number(value)
}

export function PesoFormPage({ action }: IFormTypes) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiPeso()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<Peso>>({
    initialValues: pesoInitialValues,
    validationSchema: pesoValidationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        alturaReal: obterNumeroOpcional(values.alturaReal),
        comprimentoReal: obterNumeroOpcional(values.comprimentoReal),
        larguraReal: obterNumeroOpcional(values.larguraReal),
        pesoReal: obterNumeroOpcional(values.pesoReal),
      }
      const response = action === FormAction.Edit
        ? await atualizar.fetch(payload)
        : await criar.fetch(payload)

      if (response) navigate(PrivateRoutePath.Peso)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarPeso() {
      const response = await obter.fetch(id as string)
      if (response) form.setValue(response)
    }

    buscarPeso()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Peso}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            error={form.error(PesoFormField.Descricao)}
            focus
            helperText={form.helperText(PesoFormField.Descricao)}
            id={PesoFormField.Descricao}
            label="Descrição"
            maxLength={PesoField.DescricaoMaxLength}
            name={PesoFormField.Descricao}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            value={form.values.descricao}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            disabled={readonly}
            id={PesoFormField.PesoReal}
            label="Peso real (kg)"
            name={PesoFormField.PesoReal}
            onChange={form.onChange}
            type={InputAppType.Number}
            value={form.values.pesoReal ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            disabled={readonly}
            id={PesoFormField.AlturaReal}
            label="Altura real (cm)"
            name={PesoFormField.AlturaReal}
            onChange={form.onChange}
            type={InputAppType.Number}
            value={form.values.alturaReal ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            disabled={readonly}
            id={PesoFormField.LarguraReal}
            label="Largura real (cm)"
            name={PesoFormField.LarguraReal}
            onChange={form.onChange}
            type={InputAppType.Number}
            value={form.values.larguraReal ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            disabled={readonly}
            id={PesoFormField.ComprimentoReal}
            label="Comprimento real (cm)"
            name={PesoFormField.ComprimentoReal}
            onChange={form.onChange}
            type={InputAppType.Number}
            value={form.values.comprimentoReal ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
