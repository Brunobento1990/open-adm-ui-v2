import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiEstoque } from '../../../api/useApiEstoque'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { EstoqueFormField, type Estoque } from '../../../types/EstoqueTypes'

const estoqueInitialValues: Partial<Estoque> = {
  produtoId: '',
  quantidade: undefined,
}

const estoqueValidationSchema = new YupAdapter()
  .string(EstoqueFormField.ProdutoId)
  .build()

export function EstoqueMovimentacaoPage() {
  const { id } = useParams<{ id: string }>()
  const { atualizar, obter } = useApiEstoque()
  const { navigate } = useNavigationApp()
  const form = useFormikAdapter<Partial<Estoque>>({
    initialValues: estoqueInitialValues,
    validationSchema: estoqueValidationSchema,
    onSubmit: async (values) => {
      const response = await atualizar.fetch({
        pesoId: values.pesoId,
        produtoId: values.produtoId,
        quantidade: values.quantidade,
        tamanhoId: values.tamanhoId,
      })
      if (response !== undefined) navigate(PrivateRoutePath.Estoque)
    },
  })

  useEffect(() => {
    if (!id) return

    async function buscarEstoque() {
      const response = await obter.fetch(id as string)
      if (response) form.setValue(response)
    }

    buscarEstoque()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <FormRoot.Form
      loading={obter.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Estoque}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp disabled id={EstoqueFormField.Produto} label="Produto" value={form.values.produto ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp disabled id={EstoqueFormField.Peso} label="Peso" value={form.values.peso ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp disabled id={EstoqueFormField.Tamanho} label="Tamanho" value={form.values.tamanho ?? ''} />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            id={EstoqueFormField.Quantidade}
            label="Quantidade"
            name={EstoqueFormField.Quantidade}
            onChange={form.onChange}
            type={InputAppType.Number}
            value={form.values.quantidade ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
