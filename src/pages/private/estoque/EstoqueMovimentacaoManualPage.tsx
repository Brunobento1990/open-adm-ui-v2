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
  MovimentacaoEstoqueManualFormField,
  TipoMovimentacaoEstoqueOptions,
  type MovimentacaoEstoqueManualFormValues,
} from '../../../types/EstoqueTypes'

const movimentacaoEstoqueInitialValues: Partial<MovimentacaoEstoqueManualFormValues> = {
  [MovimentacaoEstoqueManualFormField.ProdutoId]: '',
  [MovimentacaoEstoqueManualFormField.Quantidade]: undefined,
  [MovimentacaoEstoqueManualFormField.TipoMovimentacaoEstoque]: undefined,
  produto: undefined,
}

const movimentacaoEstoqueValidationSchema = new YupAdapter()
  .string(MovimentacaoEstoqueManualFormField.ProdutoId)
  .number(MovimentacaoEstoqueManualFormField.Quantidade, 'Informe uma quantidade maior que zero')
  .number(
    MovimentacaoEstoqueManualFormField.TipoMovimentacaoEstoque,
    'Selecione o tipo da movimentação',
  )
  .build()

export function EstoqueMovimentacaoManualPage() {
  const { movimentarManualmente } = useApiEstoque()
  const { navigate } = useNavigationApp()
  const form = useFormikAdapter<Partial<MovimentacaoEstoqueManualFormValues>>({
    initialValues: movimentacaoEstoqueInitialValues,
    validationSchema: movimentacaoEstoqueValidationSchema,
    onSubmit: async (values) => {
      const response = await movimentarManualmente.fetch(values)
      if (response !== undefined) navigate(PrivateRoutePath.EstoqueMovimentacoes)
    },
  })

  return (
    <FormRoot.Form
      loading={movimentarManualmente.loading}
      submit={form.onSubmit}
      textoButton="Movimentar"
      urlVoltar={PrivateRoutePath.EstoqueMovimentacoes}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={4}>
          <ProdutoDropDown
            error={form.error(MovimentacaoEstoqueManualFormField.ProdutoId)}
            helperText={form.helperText(MovimentacaoEstoqueManualFormField.ProdutoId)}
            id={MovimentacaoEstoqueManualFormField.ProdutoId}
            onBlur={form.onBlur}
            onChange={(_, produto) => form.setValue({
              produto,
              produtoId: produto?.id,
            })}
            required
            value={form.values.produto}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={4}>
          <InputApp
            error={form.error(MovimentacaoEstoqueManualFormField.Quantidade)}
            helperText={form.helperText(MovimentacaoEstoqueManualFormField.Quantidade)}
            id={MovimentacaoEstoqueManualFormField.Quantidade}
            label="Quantidade"
            name={MovimentacaoEstoqueManualFormField.Quantidade}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe a quantidade"
            required
            type={InputAppType.Number}
            value={form.values.quantidade ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={4}>
          <InputApp
            error={form.error(MovimentacaoEstoqueManualFormField.TipoMovimentacaoEstoque)}
            helperText={form.helperText(MovimentacaoEstoqueManualFormField.TipoMovimentacaoEstoque)}
            id={MovimentacaoEstoqueManualFormField.TipoMovimentacaoEstoque}
            label="Tipo"
            name={MovimentacaoEstoqueManualFormField.TipoMovimentacaoEstoque}
            onBlur={form.onBlur}
            onChange={(field, value) => form.onChange(field, Number(value))}
            options={TipoMovimentacaoEstoqueOptions}
            required
            type={InputAppType.Select}
            value={form.values.tipoMovimentacaoEstoque ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
