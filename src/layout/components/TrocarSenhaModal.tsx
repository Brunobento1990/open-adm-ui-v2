import { useApiUsuarioTrocarSenha } from '../../api/useApiUsuario'
import { Stack } from '@mui/material'
import { InputApp } from '../../components/InputApp/InputApp'
import { InputAppType } from '../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../components/Modal/ModalChildren'
import { FormRoot } from '../../form'
import { useFormikAdapter } from '../../hook/useFormikAdapter'
import { YupAdapter } from '../../lib/YupAdapter'
import { TrocarSenhaFormField, type TrocarSenhaRequest } from '../../types/UsuarioTypes'

type TrocarSenhaModalProps = {
  open: boolean
  onClose: () => void
}

const initialValues: TrocarSenhaRequest = {
  [TrocarSenhaFormField.SenhaAtual]: '',
  [TrocarSenhaFormField.Senha]: '',
  [TrocarSenhaFormField.ConfirmacaoSenha]: '',
}

const validationSchema = new YupAdapter()
  .string(TrocarSenhaFormField.SenhaAtual)
  .string(TrocarSenhaFormField.Senha)
  .string(TrocarSenhaFormField.ConfirmacaoSenha)
  .build()

export function TrocarSenhaModal({ open, onClose }: TrocarSenhaModalProps) {
  const api = useApiUsuarioTrocarSenha()
  const form = useFormikAdapter<TrocarSenhaRequest>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (values.senha !== values.confirmacaoSenha) {
        form.setError(TrocarSenhaFormField.ConfirmacaoSenha, 'As senhas não coincidem')
        return
      }

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
      titulo="Trocar senha"
    >
      <FormRoot.Form
        loading={api.loading}
        padding="0"
        paddingFooter="1rem 0 0"
        stopPropagation
        submit={form.onSubmit}
        textoButton="Alterar senha"
      >
        <Stack spacing={2.25}>
          <InputApp
          autoComplete="current-password"
          error={form.error(TrocarSenhaFormField.SenhaAtual)}
          helperText={form.helperText(TrocarSenhaFormField.SenhaAtual)}
          id={TrocarSenhaFormField.SenhaAtual}
          label="Senha atual"
          name={TrocarSenhaFormField.SenhaAtual}
          onBlur={form.onBlur}
          onChange={form.onChange}
          required
          type={InputAppType.Password}
          value={form.values.senhaAtual}
          />
          <InputApp
          autoComplete="new-password"
          error={form.error(TrocarSenhaFormField.Senha)}
          helperText={form.helperText(TrocarSenhaFormField.Senha)}
          id={TrocarSenhaFormField.Senha}
          label="Nova senha"
          name={TrocarSenhaFormField.Senha}
          onBlur={form.onBlur}
          onChange={form.onChange}
          required
          type={InputAppType.Password}
          value={form.values.senha}
          />
          <InputApp
          autoComplete="new-password"
          error={form.error(TrocarSenhaFormField.ConfirmacaoSenha)}
          helperText={form.helperText(TrocarSenhaFormField.ConfirmacaoSenha)}
          id={TrocarSenhaFormField.ConfirmacaoSenha}
          label="Confirmar nova senha"
          name={TrocarSenhaFormField.ConfirmacaoSenha}
          onBlur={form.onBlur}
          onChange={form.onChange}
          required
          type={InputAppType.Password}
          value={form.values.confirmacaoSenha}
          />
        </Stack>
      </FormRoot.Form>
    </ModalChildren>
  )
}
