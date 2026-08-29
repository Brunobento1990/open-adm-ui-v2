import type { IFormikAdapter } from '../../hook/useFormikAdapter'
import type { Cliente } from '../../types/ClienteTypes'
import { ClienteFormField } from '../../types/ClienteTypes'
import { FormRoot } from '../../form'
import { InputApp } from '../InputApp/InputApp'
import { InputAppType } from '../InputApp/inputAppTypes'

type ClienteFormFieldsProps = {
  form: IFormikAdapter<Partial<Cliente>>
  fullWidth?: boolean
  readonly?: boolean
}

export function ClienteFormFields({ form, fullWidth, readonly }: ClienteFormFieldsProps) {
  return (
    <>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={fullWidth ? 12 : 6}>
          <InputApp
            disabled={readonly}
            error={form.error(ClienteFormField.Nome)}
            helperText={form.helperText(ClienteFormField.Nome)}
            id={ClienteFormField.Nome}
            label="Nome"
            maxLength={150}
            name={ClienteFormField.Nome}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o nome"
            required
            type={InputAppType.Text}
            value={form.values.nome}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={fullWidth ? 6 : 3}>
          <InputApp
            disabled={readonly}
            id={ClienteFormField.Cpf}
            label="CPF"
            maxLength={14}
            name={ClienteFormField.Cpf}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o CPF"
            type={InputAppType.Text}
            value={form.values.cpf}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={fullWidth ? 6 : 3}>
          <InputApp
            disabled={readonly}
            id={ClienteFormField.Telefone}
            label="Telefone"
            maxLength={20}
            name={ClienteFormField.Telefone}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o telefone"
            type={InputAppType.Tel}
            value={form.values.telefone}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </>
  )
}
