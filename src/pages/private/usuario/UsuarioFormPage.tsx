import { Alert } from '@mui/material'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiUsuario } from '../../../api/useApiUsuario'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import { UsuarioFormField, type Usuario } from '../../../types/UsuarioTypes'
import { limparCpf, limparTelefone } from '../../../utils/documentUtils'

const usuarioInitialValues: Partial<Usuario> = {
  [UsuarioFormField.Nome]: '',
  [UsuarioFormField.Email]: '',
  [UsuarioFormField.Cpf]: '',
  [UsuarioFormField.Telefone]: '',
}

const usuarioValidationSchema = new YupAdapter()
  .string(UsuarioFormField.Nome)
  .email(UsuarioFormField.Email)
  .build()

type UsuarioFormPageProps = {
  action: FormActionType
}

export function UsuarioFormPage({ action }: UsuarioFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiUsuario()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<Usuario>>({
    initialValues: usuarioInitialValues,
    validationSchema: usuarioValidationSchema,
    onSubmit: async (values) => {
      const usuario: Partial<Usuario> = {
        nome: values.nome,
        email: values.email,
        cpf: limparCpf(values.cpf),
        telefone: limparTelefone(values.telefone),
      }
      const response = action === FormAction.Edit && id
        ? await atualizar.fetch(id, usuario)
        : await criar.fetch(usuario)

      if (response) navigate(PrivateRoutePath.Usuario)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarUsuario() {
      const response = await obter.fetch(id as string)
      if (!response) return

      form.setValue({
        nome: response.nome,
        email: response.email,
        cpf: response.cpf ?? '',
        telefone: response.telefone ?? '',
      })
    }

    buscarUsuario()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Usuario}
    >
      {action === FormAction.Create && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Após criar o usuário, enviaremos um e-mail para o cadastro da primeira senha.
          O link enviado expira em 24 horas.
        </Alert>
      )}
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            disabled={readonly}
            error={form.error(UsuarioFormField.Nome)}
            helperText={form.helperText(UsuarioFormField.Nome)}
            id={UsuarioFormField.Nome}
            label="Nome"
            maxLength={150}
            name={UsuarioFormField.Nome}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o nome"
            required
            type={InputAppType.Text}
            value={form.values.nome}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            disabled={readonly}
            error={form.error(UsuarioFormField.Email)}
            helperText={form.helperText(UsuarioFormField.Email)}
            id={UsuarioFormField.Email}
            label="E-mail"
            maxLength={150}
            name={UsuarioFormField.Email}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o e-mail"
            required
            type={InputAppType.Email}
            value={form.values.email}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={3}>
          <InputApp
            disabled={readonly}
            id={UsuarioFormField.Cpf}
            label="CPF"
            maxLength={14}
            name={UsuarioFormField.Cpf}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o CPF"
            type={InputAppType.Text}
            value={form.values.cpf}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={3}>
          <InputApp
            disabled={readonly}
            id={UsuarioFormField.Telefone}
            label="Telefone"
            maxLength={20}
            name={UsuarioFormField.Telefone}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe o telefone"
            type={InputAppType.Tel}
            value={form.values.telefone}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
