import { useParams } from 'react-router-dom'
import { useApiClienteVenda } from '../../../api/useApiClienteVenda'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { ClienteVendaFormField, type AtualizarSenhaClienteVenda } from '../../../types/ClienteVendaTypes'

const validationSchema = new YupAdapter()
  .string(ClienteVendaFormField.Senha, 'Informe a senha')
  .string(ClienteVendaFormField.ConfirmarSenha, 'Confirme a senha')
  .build()

export function ClienteVendaAtualizarSenhaPage() {
  const { id } = useParams<{ id: string }>()
  const { navigate } = useNavigationApp()
  const { atualizarSenha } = useApiClienteVenda()
  const form = useFormikAdapter<AtualizarSenhaClienteVenda>({
    initialValues: { usuarioId: id ?? '', senha: '', confirmarSenha: '' },
    validationSchema,
    onSubmit: async (values: AtualizarSenhaClienteVenda) => {
      if (values.senha !== values.confirmarSenha) {
        form.setError(ClienteVendaFormField.ConfirmarSenha, 'As senhas não conferem')
        return
      }
      const response = await atualizarSenha.fetch(values)
      if (response) navigate(PrivateRoutePath.ClienteVenda)
    },
  })

  return (
    <FormRoot.Form
      loading={atualizarSenha.loading}
      responsiveMobileActions
      submit={form.onSubmit}
      urlVoltar={PrivateRoutePath.ClienteVenda}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            error={form.error(ClienteVendaFormField.Senha)}
            focus
            helperText={form.helperText(ClienteVendaFormField.Senha)}
            id={ClienteVendaFormField.Senha}
            label="Senha"
            maxLength={20}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Password}
            value={form.values.senha}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            error={form.error(ClienteVendaFormField.ConfirmarSenha)}
            helperText={form.helperText(ClienteVendaFormField.ConfirmarSenha)}
            id={ClienteVendaFormField.ConfirmarSenha}
            label="Confirmar senha"
            maxLength={20}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Password}
            value={form.values.confirmarSenha}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
