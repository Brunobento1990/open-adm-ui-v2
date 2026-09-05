import { useApiItemTabelaDePreco } from '../../../api/useApiItemTabelaDePreco'
import { TamanhoDropDown } from '../../../components/DropDown/TamanhoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  PrecoPorTamanhoFormField,
  type PrecoPorTamanhoFormValues,
} from '../../../types/PrecoPorTamanhoTypes'

const initialValues: PrecoPorTamanhoFormValues = {
  tamanhoId: '',
  valorUnitarioAtacado: '',
  valorUnitarioVarejo: '',
}

const validationSchema = new YupAdapter()
  .string(PrecoPorTamanhoFormField.TamanhoId, 'Selecione o tamanho')
  .build()

function valorMonetarioOuUndefined(value?: number | '') {
  return value === '' ? undefined : value
}

export function PrecoPorTamanhoPage() {
  const { atualizarPorTamanho } = useApiItemTabelaDePreco()
  const form = useFormikAdapter<PrecoPorTamanhoFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values: PrecoPorTamanhoFormValues) => {
      await atualizarPorTamanho.fetch({
        tamanhoId: values.tamanhoId as string,
        valorUnitarioAtacado: valorMonetarioOuUndefined(values.valorUnitarioAtacado),
        valorUnitarioVarejo: valorMonetarioOuUndefined(values.valorUnitarioVarejo),
      })
    },
  })

  return (
    <FormRoot.Form
      loading={atualizarPorTamanho.loading}
      responsiveMobileActions
      submit={form.onSubmit}
      textoButton="Atualizar preços"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <TamanhoDropDown
            error={form.error(PrecoPorTamanhoFormField.TamanhoId)}
            helperText={form.helperText(PrecoPorTamanhoFormField.TamanhoId)}
            id={PrecoPorTamanhoFormField.TamanhoId}
            onBlur={form.onBlur}
            onChange={(_, tamanho) => form.setValue({ tamanho, tamanhoId: tamanho?.id ?? '' })}
            required
            value={form.values.tamanho}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <InputApp
            id={PrecoPorTamanhoFormField.ValorUnitarioAtacado}
            label="Valor un atacado"
            onChange={form.onChange}
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.valorUnitarioAtacado ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <InputApp
            id={PrecoPorTamanhoFormField.ValorUnitarioVarejo}
            label="Valor un varejo"
            onChange={form.onChange}
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.valorUnitarioVarejo ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
