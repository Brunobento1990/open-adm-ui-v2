import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiCategoria } from '../../../api/useApiCategoria'
import { ImageUploadApp } from '../../../components/ImageUploadApp/ImageUploadApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { CategoriaFormField, type Categoria } from '../../../types/CategoriaTypes'
import { FormAction, type IFormTypes } from '../../../types/Form'
import { removerPrefixoBase64 } from '../../../utils/imageUtils'

const CategoriaField = {
  MaxLength: 255,
} as const

const categoriaInitialValues: Partial<Categoria> = {
  [CategoriaFormField.Descricao]: '',
  [CategoriaFormField.Foto]: '',
  [CategoriaFormField.InativoEcommerce]: false,
  [CategoriaFormField.NovaFoto]: undefined,
}

const categoriaValidationSchema = new YupAdapter()
  .stringWithTests(
    CategoriaFormField.Descricao,
    [{
      name: 'maxLength',
      message: `A descrição deve ter no máximo ${CategoriaField.MaxLength} caracteres`,
      test: (value) => !value || value.length <= CategoriaField.MaxLength,
    }],
    'Informe a descrição',
  )
  .build()

export function CategoriaFormPage({ action }: IFormTypes) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiCategoria()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<Categoria>>({
    initialValues: categoriaInitialValues,
    validationSchema: categoriaValidationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        novaFoto: values.novaFoto
          ? removerPrefixoBase64(values.novaFoto)
          : undefined,
      }
      const response = action === FormAction.Edit
        ? await atualizar.fetch(payload)
        : await criar.fetch(payload)

      if (response) navigate(PrivateRoutePath.Categoria)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarCategoria() {
      const response = await obter.fetch(id as string)
      if (response) form.setValue(response)
    }

    buscarCategoria()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      loading={obter.loading || criar.loading || atualizar.loading}
      action={action}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Categoria}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            error={form.error(CategoriaFormField.Descricao)}
            helperText={form.helperText(CategoriaFormField.Descricao)}
            id={CategoriaFormField.Descricao}
            label="Descrição"
            maxLength={CategoriaField.MaxLength}
            name={CategoriaFormField.Descricao}
            disabled={readonly}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe a descrição"
            required
            type={InputAppType.Text}
            value={form.values.descricao}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            checked={Boolean(form.values.inativoEcommerce)}
            disabled={readonly}
            id={CategoriaFormField.InativoEcommerce}
            label="Inativo no e-commerce"
            name={CategoriaFormField.InativoEcommerce}
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <ImageUploadApp
            alt={form.values.descricao ? `Categoria ${form.values.descricao}` : 'Categoria'}
            onChange={(value) => form.onChange(CategoriaFormField.NovaFoto, value)}
            previewLabel="Pré-visualização da foto"
            readonly={readonly}
            value={form.values.novaFoto || form.values.foto}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
