import { FormRoot } from '../../form'
import type { IFormikAdapter } from '../../hook/useFormikAdapter'
import {
  RepresentanteFormField,
  type RepresentanteFormValues,
} from '../../types/RepresentanteTypes'
import { FormAction, type FormAction as FormActionType } from '../../types/Form'
import { InputApp } from '../InputApp/InputApp'
import { InputAppType } from '../InputApp/inputAppTypes'

type RepresentanteFormFieldsProps = {
  action: FormActionType
  form: IFormikAdapter<RepresentanteFormValues>
}

export function RepresentanteFormFields({ action, form }: RepresentanteFormFieldsProps) {
  const readonly = action === FormAction.View

  return (
    <>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            disabled={readonly}
            error={form.error(RepresentanteFormField.Nome)}
            helperText={form.helperText(RepresentanteFormField.Nome)}
            id={RepresentanteFormField.Nome}
            label="Nome"
            maxLength={255}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o nome"
            required
            value={form.values.nome}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            disabled={readonly}
            id={RepresentanteFormField.Cpf}
            label="CPF"
            maxLength={14}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o CPF"
            value={form.values.cpf}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            disabled={readonly}
            error={form.error(RepresentanteFormField.Email)}
            helperText={form.helperText(RepresentanteFormField.Email)}
            id={RepresentanteFormField.Email}
            label="E-mail"
            maxLength={255}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o e-mail"
            type={InputAppType.Email}
            value={form.values.email}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            disabled={readonly}
            id={RepresentanteFormField.Telefone}
            label="Telefone"
            maxLength={20}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o telefone"
            type={InputAppType.Tel}
            value={form.values.telefone}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      {action === FormAction.Create && (
        <FormRoot.FormRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <InputApp
              autoComplete="new-password"
              id={RepresentanteFormField.Senha}
              label="Senha"
              maxLength={255}
              onBlur={form.onBlur}
              onChange={form.onChange}
              placeholder="Informe a senha"
              type={InputAppType.Password}
              value={form.values.senha}
            />
          </FormRoot.FormItemRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <InputApp
              autoComplete="new-password"
              error={form.error(RepresentanteFormField.ConfirmacaoSenha)}
              helperText={form.helperText(RepresentanteFormField.ConfirmacaoSenha)}
              id={RepresentanteFormField.ConfirmacaoSenha}
              label="Confirmar senha"
              maxLength={255}
              onBlur={form.onBlur}
              onChange={form.onChange}
              placeholder="Confirme a senha"
              type={InputAppType.Password}
              value={form.values.confirmacaoSenha}
            />
          </FormRoot.FormItemRow>
        </FormRoot.FormRow>
      )}
    </>
  )
}
