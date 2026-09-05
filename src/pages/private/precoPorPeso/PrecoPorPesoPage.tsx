import { useApiItemTabelaDePreco } from '../../../api/useApiItemTabelaDePreco'
import { PesoDropDown } from '../../../components/DropDown/PesoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  PrecoPorPesoFormField,
  type PrecoPorPesoFormValues,
} from '../../../types/PrecoPorPesoTypes'

const initialValues: PrecoPorPesoFormValues = {
  pesoId: '',
  valorUnitarioAtacado: '',
  valorUnitarioVarejo: '',
}

const validationSchema = new YupAdapter()
  .string(PrecoPorPesoFormField.PesoId, 'Selecione o peso')
  .build()

function valorMonetarioOuUndefined(value?: number | '') {
  return value === '' ? undefined : value
}

export function PrecoPorPesoPage() {
  const { atualizarPorPeso } = useApiItemTabelaDePreco()
  const form = useFormikAdapter<PrecoPorPesoFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values: PrecoPorPesoFormValues) => {
      await atualizarPorPeso.fetch({
        pesoId: values.pesoId as string,
        valorUnitarioAtacado: valorMonetarioOuUndefined(values.valorUnitarioAtacado),
        valorUnitarioVarejo: valorMonetarioOuUndefined(values.valorUnitarioVarejo),
      })
    },
  })

  return (
    <FormRoot.Form
      loading={atualizarPorPeso.loading}
      responsiveMobileActions
      submit={form.onSubmit}
      textoButton="Atualizar preços"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <PesoDropDown
            error={form.error(PrecoPorPesoFormField.PesoId)}
            helperText={form.helperText(PrecoPorPesoFormField.PesoId)}
            id={PrecoPorPesoFormField.PesoId}
            onBlur={form.onBlur}
            onChange={(_, peso) => form.setValue({ peso, pesoId: peso?.id ?? '' })}
            required
            value={form.values.peso}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <InputApp
            id={PrecoPorPesoFormField.ValorUnitarioAtacado}
            label="Valor un atacado"
            onChange={form.onChange}
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.valorUnitarioAtacado ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <InputApp
            id={PrecoPorPesoFormField.ValorUnitarioVarejo}
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
