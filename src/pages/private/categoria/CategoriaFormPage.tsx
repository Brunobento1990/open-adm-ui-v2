import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiCategoria } from '../../../api/useApiCategoria'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { CategoriaFormField, type Categoria } from '../../../types/CategoriaTypes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'

const categoriaInitialValues: Partial<Categoria> = {
  [CategoriaFormField.Descricao]: '',
}

const categoriaValidationSchema = new YupAdapter()
  .string(CategoriaFormField.Descricao)
  .build()

type CategoriaFormPageProps = {
  action: FormActionType
}

export function CategoriaFormPage({ action }: CategoriaFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiCategoria()
  const { navigate } = useNavigationApp()
  const form = useFormikAdapter<Categoria>({
    initialValues: categoriaInitialValues,
    validationSchema: categoriaValidationSchema,
    onSubmit: async (values) => {
      const response = action === FormAction.Edit && id
        ? await atualizar.fetch(id, values)
        : await criar.fetch(values)

      if (response) navigate(PrivateRoutePath.Categoria)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarCategoria() {
      const response = await obter.fetch(id as string)
      if (response) form.setValue({ descricao: response.descricao })
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
            maxLength={150}
            name={CategoriaFormField.Descricao}
            disabled={action === FormAction.View}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe a descrição"
            required
            type={InputAppType.Text}
            value={form.values.descricao}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
