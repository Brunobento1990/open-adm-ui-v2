import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import type { IFormikAdapter } from '../../../hook/useFormikAdapter'
import {
  TabelaDePrecoFormField,
  type TabelaDePrecoCabecalhoValues,
} from '../../../types/TabelaDePrecoTypes'

type Props<T extends TabelaDePrecoCabecalhoValues> = {
  form: IFormikAdapter<T>
  readonly?: boolean
}

export function TabelaDePrecoCabecalhoFields<T extends TabelaDePrecoCabecalhoValues>({
  form,
  readonly,
}: Props<T>) {
  return (
    <FormRoot.FormRow>
      <FormRoot.FormItemRow sm={6} xs={12}>
        <InputApp
          disabled={readonly}
          error={form.error(TabelaDePrecoFormField.Descricao)}
          helperText={form.helperText(TabelaDePrecoFormField.Descricao)}
          id={TabelaDePrecoFormField.Descricao}
          label="Descrição"
          maxLength={255}
          onBlur={form.onBlur}
          onChange={form.onChange}
          required
          value={form.values.descricao}
        />
      </FormRoot.FormItemRow>
      <FormRoot.FormItemRow sm={6} xs={12}>
        <InputApp
          checked={form.values.ativaEcommerce}
          disabled={readonly}
          id={TabelaDePrecoFormField.AtivaEcommerce}
          label="Ativa ecommerce"
          onChange={form.onChange}
          type={InputAppType.Checkbox}
        />
      </FormRoot.FormItemRow>
    </FormRoot.FormRow>
  )
}
