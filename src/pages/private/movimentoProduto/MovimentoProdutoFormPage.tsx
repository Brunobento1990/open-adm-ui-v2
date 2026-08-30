import { useApiMovimentoProduto } from '../../../api/useApiMovimentoProduto'
import { PesoDropDown } from '../../../components/DropDown/PesoDropDown'
import { ProdutoDropDown } from '../../../components/DropDown/ProdutoDropDown'
import { TamanhoDropDown } from '../../../components/DropDown/TamanhoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  MovimentoProdutoFormField,
  TipoMovimentacaoProdutoOptions,
  type MovimentoProdutoFormValues,
} from '../../../types/EstoqueTypes'

const MovimentoProdutoField = { ObservacaoMaxLength: 255 } as const

const movimentoProdutoInitialValues: Partial<MovimentoProdutoFormValues> = {
  produtoId: '',
  quantidade: undefined,
  tipoMovimentacaoDeProduto: undefined,
}

const movimentoProdutoValidationSchema = new YupAdapter()
  .string(MovimentoProdutoFormField.ProdutoId, 'Informe o produto')
  .number(MovimentoProdutoFormField.Quantidade, 'Informe uma quantidade maior que zero')
  .number(
    MovimentoProdutoFormField.TipoMovimentacaoDeProduto,
    'Selecione o tipo da movimentação',
    0,
  )
  .build()

export function MovimentoProdutoFormPage() {
  const { movimentar } = useApiMovimentoProduto()
  const { navigate } = useNavigationApp()
  const form = useFormikAdapter<Partial<MovimentoProdutoFormValues>>({
    initialValues: movimentoProdutoInitialValues,
    validationSchema: movimentoProdutoValidationSchema,
    onSubmit: async (values) => {
      const response = await movimentar.fetch({
        observacao: values.observacao,
        pesoId: values.pesoId,
        produtoId: values.produtoId,
        quantidade: values.quantidade,
        tamanhoId: values.tamanhoId,
        tipoMovimentacaoDeProduto: values.tipoMovimentacaoDeProduto,
      })
      if (response !== undefined) navigate(PrivateRoutePath.MovimentoProduto)
    },
  })

  return (
    <FormRoot.Form
      loading={movimentar.loading}
      submit={form.onSubmit}
      textoButton="Movimentar"
      urlVoltar={PrivateRoutePath.MovimentoProduto}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <ProdutoDropDown
            error={form.error(MovimentoProdutoFormField.ProdutoId)}
            helperText={form.helperText(MovimentoProdutoFormField.ProdutoId)}
            onBlur={form.onBlur}
            onChange={(_, produto) => form.setValue({ produto, produtoId: produto?.id })}
            required
            value={form.values.produto}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <TamanhoDropDown
            id={MovimentoProdutoFormField.TamanhoId}
            onChange={(_, tamanho) => form.setValue({ tamanho, tamanhoId: tamanho?.id })}
            value={form.values.tamanho}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <PesoDropDown
            id={MovimentoProdutoFormField.PesoId}
            onChange={(_, peso) => form.setValue({ peso, pesoId: peso?.id })}
            value={form.values.peso}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            error={form.error(MovimentoProdutoFormField.TipoMovimentacaoDeProduto)}
            helperText={form.helperText(MovimentoProdutoFormField.TipoMovimentacaoDeProduto)}
            id={MovimentoProdutoFormField.TipoMovimentacaoDeProduto}
            label="Tipo de movimentação"
            name={MovimentoProdutoFormField.TipoMovimentacaoDeProduto}
            onBlur={form.onBlur}
            onChange={(field, value) => form.onChange(field, Number(value))}
            options={TipoMovimentacaoProdutoOptions}
            required
            type={InputAppType.Select}
            value={form.values.tipoMovimentacaoDeProduto ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            error={form.error(MovimentoProdutoFormField.Quantidade)}
            helperText={form.helperText(MovimentoProdutoFormField.Quantidade)}
            id={MovimentoProdutoFormField.Quantidade}
            label="Quantidade"
            name={MovimentoProdutoFormField.Quantidade}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Number}
            value={form.values.quantidade ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12}>
          <InputApp
            id={MovimentoProdutoFormField.Observacao}
            label="Observação"
            maxLength={MovimentoProdutoField.ObservacaoMaxLength}
            name={MovimentoProdutoFormField.Observacao}
            onChange={form.onChange}
            value={form.values.observacao ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
