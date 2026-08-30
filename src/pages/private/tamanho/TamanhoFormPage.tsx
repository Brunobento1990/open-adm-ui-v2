import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiTamanho } from '../../../api/useApiTamanho'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type IFormTypes } from '../../../types/Form'
import { TamanhoFormField, type Tamanho } from '../../../types/TamanhoTypes'
import { obterNumeroOpcional } from '../../../utils/numberUtils'

const TamanhoField = { DescricaoMaxLength: 255 } as const

const tamanhoInitialValues: Partial<Tamanho> = {
  [TamanhoFormField.AlturaReal]: undefined,
  [TamanhoFormField.ComprimentoReal]: undefined,
  [TamanhoFormField.Descricao]: '',
  [TamanhoFormField.LarguraReal]: undefined,
  [TamanhoFormField.PesoReal]: undefined,
}

const tamanhoValidationSchema = new YupAdapter()
  .stringWithTests(
    TamanhoFormField.Descricao,
    [{
      name: 'maxLength',
      message: `A descrição deve ter no máximo ${TamanhoField.DescricaoMaxLength} caracteres`,
      test: (value) => !value || value.length <= TamanhoField.DescricaoMaxLength,
    }],
    'Informe a descrição',
  )
  .build()

export function TamanhoFormPage({ action }: IFormTypes) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiTamanho()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<Tamanho>>({
    initialValues: tamanhoInitialValues,
    validationSchema: tamanhoValidationSchema,
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

      if (response) navigate(PrivateRoutePath.Tamanho)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarTamanho() {
      const response = await obter.fetch(id as string)
      if (response) form.setValue(response)
    }

    buscarTamanho()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Tamanho}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            error={form.error(TamanhoFormField.Descricao)}
            focus
            helperText={form.helperText(TamanhoFormField.Descricao)}
            id={TamanhoFormField.Descricao}
            label="Descrição"
            maxLength={TamanhoField.DescricaoMaxLength}
            name={TamanhoFormField.Descricao}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            value={form.values.descricao}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp disabled={readonly} id={TamanhoFormField.PesoReal} label="Peso real (kg)" name={TamanhoFormField.PesoReal} onChange={form.onChange} type={InputAppType.Number} value={form.values.pesoReal ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp disabled={readonly} id={TamanhoFormField.AlturaReal} label="Altura real (cm)" name={TamanhoFormField.AlturaReal} onChange={form.onChange} type={InputAppType.Number} value={form.values.alturaReal ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp disabled={readonly} id={TamanhoFormField.LarguraReal} label="Largura real (cm)" name={TamanhoFormField.LarguraReal} onChange={form.onChange} type={InputAppType.Number} value={form.values.larguraReal ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp disabled={readonly} id={TamanhoFormField.ComprimentoReal} label="Comprimento real (cm)" name={TamanhoFormField.ComprimentoReal} onChange={form.onChange} type={InputAppType.Number} value={form.values.comprimentoReal ?? ''} />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
