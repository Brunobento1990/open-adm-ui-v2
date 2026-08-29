import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiEstoque } from '../../../api/useApiEstoque'
import { ProdutoDropDown } from '../../../components/DropDown/ProdutoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  EstoqueFormField,
  type Estoque,
} from '../../../types/EstoqueTypes'

const estoqueInitialValues: Partial<Estoque> = {
  [EstoqueFormField.ProdutoId]: '',
  [EstoqueFormField.Quantidade]: undefined,
  produto: undefined,
}

const estoqueValidationSchema = new YupAdapter()
  .string(EstoqueFormField.ProdutoId)
  .number(EstoqueFormField.Quantidade, 'Informe uma quantidade maior que zero')
  .build()

export function EstoqueMovimentacaoPage() {
  const { id } = useParams<{ id: string }>()
  const { movimentar, obter } = useApiEstoque()
  const { navigate } = useNavigationApp()
  const form = useFormikAdapter<Partial<Estoque>>({
    initialValues: estoqueInitialValues,
    validationSchema: estoqueValidationSchema,
    onSubmit: async (values) => {
      const response = await movimentar.fetch(values)
      if (response !== undefined) navigate(PrivateRoutePath.Estoque)
    },
  })

  useEffect(() => {
    if (!id) return

    async function buscarEstoque() {
      const response = await obter.fetch(id as string)
      if (!response) return

      form.setValue(response)
    }

    buscarEstoque()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <FormRoot.Form
      loading={obter.loading || movimentar.loading}
      submit={form.onSubmit}
      urlVoltar={PrivateRoutePath.Estoque}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={8}>
          <ProdutoDropDown
            error={form.error(EstoqueFormField.ProdutoId)}
            helperText={form.helperText(EstoqueFormField.ProdutoId)}
            id={EstoqueFormField.ProdutoId}
            onBlur={form.onBlur}
            onChange={(_, produto) => form.setValue({
              produto,
              produtoId: produto?.id,
            })}
            readonly
            required
            value={form.values.produto}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={4}>
          <InputApp
            error={form.error(EstoqueFormField.Quantidade)}
            helperText={form.helperText(EstoqueFormField.Quantidade)}
            id={EstoqueFormField.Quantidade}
            label="Quantidade"
            name={EstoqueFormField.Quantidade}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe a quantidade"
            required
            type={InputAppType.Number}
            value={form.values.quantidade ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
