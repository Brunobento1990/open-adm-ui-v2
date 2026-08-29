import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import type { IFormikAdapter } from '../../../hook/useFormikAdapter'
import { ContatoFormField, type IContato } from '../../../types/ContatoTypes'

type FormContatoProps = {
  form: IFormikAdapter<IContato>
}

export function FormContato({ form }: FormContatoProps) {
  return (
    <>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12}>
          <InputApp
            error={form.error(ContatoFormField.Nome)}
            focus
            helperText={form.helperText(ContatoFormField.Nome)}
            id={ContatoFormField.Nome}
            label="Nome"
            maxLength={120}
            name={ContatoFormField.Nome}
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
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            error={form.error(ContatoFormField.Cpf)}
            helperText={form.helperText(ContatoFormField.Cpf)}
            id={ContatoFormField.Cpf}
            label="CPF"
            maxLength={14}
            name={ContatoFormField.Cpf}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o CPF"
            type={InputAppType.Text}
            value={form.values.cpf ?? ''}
          />
        </FormRoot.FormItemRow>

        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            error={form.error(ContatoFormField.Telefone)}
            helperText={form.helperText(ContatoFormField.Telefone)}
            id={ContatoFormField.Telefone}
            label="Telefone"
            maxLength={20}
            name={ContatoFormField.Telefone}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o telefone"
            type={InputAppType.Tel}
            value={form.values.telefone ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>

      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12}>
          <InputApp
            error={form.error(ContatoFormField.Email)}
            helperText={form.helperText(ContatoFormField.Email)}
            id={ContatoFormField.Email}
            label="E-mail"
            maxLength={180}
            name={ContatoFormField.Email}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o e-mail"
            type={InputAppType.Email}
            value={form.values.email ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </>
  )
}
