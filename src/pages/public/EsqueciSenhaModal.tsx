import { useApiEsqueciSenha } from '../../api/useApiLogin'
import { InputApp } from '../../components/InputApp/InputApp'
import { InputAppType } from '../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../components/Modal/ModalChildren'
import { FormRoot } from '../../form'
import { useFormikAdapter } from '../../hook/useFormikAdapter'
import { YupAdapter } from '../../lib/YupAdapter'
import { LoginFormField, type EsqueciSenhaRequest } from '../../types/LoginTypes'

type EsqueciSenhaModalProps = {
  email: string
  open: boolean
  onClose: () => void
}

const validationSchema = new YupAdapter()
  .email(LoginFormField.Email)
  .build()

export function EsqueciSenhaModal({ email, open, onClose }: EsqueciSenhaModalProps) {
  const api = useApiEsqueciSenha()
  const form = useFormikAdapter<EsqueciSenhaRequest>({
    initialValues: { [LoginFormField.Email]: email },
    validationSchema,
    onSubmit: async (values) => {
      await api.action(values, onClose)
    },
  })

  function close() {
    if (!api.loading) onClose()
  }

  return (
    <ModalChildren
      close={close}
      fullWidth
      maxWidth="xs"
      open={open}
      retirarFooter
      titulo="Recuperar senha"
    >
      <FormRoot.Form
        loading={api.loading}
        padding="0"
        paddingFooter="1rem 0 0"
        stopPropagation
        submit={form.onSubmit}
        textoButton="Enviar e-mail"
      >
        <InputApp
          autoComplete="email"
          error={form.error(LoginFormField.Email)}
          helperText={form.helperText(LoginFormField.Email)}
          id={LoginFormField.Email}
          label="E-mail"
          name={LoginFormField.Email}
          onBlur={form.onBlur}
          onChange={form.onChange}
          required
          type={InputAppType.Email}
          value={form.values.email}
        />
      </FormRoot.Form>
    </ModalChildren>
  )
}
