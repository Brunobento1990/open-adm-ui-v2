import { useNavigate, useParams } from 'react-router-dom'
import { useApiCadastrarSenha } from '../../api/useApiLogin'
import { BoxApp } from '../../components/BoxApp/BoxApp'
import {
  BoxAppComponent,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppPlaceItems,
} from '../../components/BoxApp/boxAppTypes'
import { ContainerApp, ContainerAppMaxWidth } from '../../components/ContainerApp/ContainerApp'
import { DividerApp } from '../../components/DividerApp/DividerApp'
import { InputApp } from '../../components/InputApp/InputApp'
import { InputAppType } from '../../components/InputApp/inputAppTypes'
import { PaperApp } from '../../components/PaperApp/PaperApp'
import { TextApp, TextAppColor, TextAppVariant, TextAppWeight } from '../../components/TextApp/TextApp'
import { FormRoot } from '../../form'
import { useFormikAdapter } from '../../hook/useFormikAdapter'
import { YupAdapter } from '../../lib/YupAdapter'
import { PublicRoutePath } from '../../routes/appRoutes'
import {
  CadastrarSenhaFormField,
  type CadastrarSenhaFormValues,
} from '../../types/LoginTypes'

const initialValues: CadastrarSenhaFormValues = {
  [CadastrarSenhaFormField.Senha]: '',
  [CadastrarSenhaFormField.ConfirmacaoSenha]: '',
}

const validationSchema = new YupAdapter()
  .string(CadastrarSenhaFormField.Senha)
  .string(CadastrarSenhaFormField.ConfirmacaoSenha)
  .build()

export function CadastrarSenhaPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const navigate = useNavigate()
  const api = useApiCadastrarSenha()
  const form = useFormikAdapter<CadastrarSenhaFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (values.senha !== values.confirmacaoSenha) {
        form.setError(CadastrarSenhaFormField.ConfirmacaoSenha, 'As senhas não coincidem')
        return
      }

      if (!codigo) return

      await api.action(
        {
          codigo,
          [CadastrarSenhaFormField.Senha]: values.senha,
          [CadastrarSenhaFormField.ConfirmacaoSenha]: values.confirmacaoSenha,
        },
        () => navigate(PublicRoutePath.Login),
      )
    },
  })

  return (
    <BoxApp
      component={BoxAppComponent.Main}
      display={BoxAppDisplay.Grid}
      minHeight="100vh"
      placeItems={BoxAppPlaceItems.Center}
      px={2}
      py={4}
    >
      <ContainerApp maxWidth={ContainerAppMaxWidth.Xs} disableGutters>
        <PaperApp elevation={0}>
          <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={3}>
            <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={1}>
              <TextApp component="h1" variant={TextAppVariant.Title} weight={TextAppWeight.Bold}>
                Cadastrar senha
              </TextApp>
              <TextApp color={TextAppColor.Secondary}>
                Digite e confirme sua nova senha.
              </TextApp>
            </BoxApp>
            <DividerApp />
            <FormRoot.Form
              loading={api.loading}
              padding="0"
              paddingFooter="1rem 0 0"
              submit={form.onSubmit}
              textoButton="Alterar senha"
            >
              <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={2.25}>
                <InputApp
                  autoComplete="new-password"
                  error={form.error(CadastrarSenhaFormField.Senha)}
                  helperText={form.helperText(CadastrarSenhaFormField.Senha)}
                  id={CadastrarSenhaFormField.Senha}
                  label="Nova senha"
                  name={CadastrarSenhaFormField.Senha}
                  onBlur={form.onBlur}
                  onChange={form.onChange}
                  required
                  type={InputAppType.Password}
                  value={form.values.senha}
                />
                <InputApp
                  autoComplete="new-password"
                  error={form.error(CadastrarSenhaFormField.ConfirmacaoSenha)}
                  helperText={form.helperText(CadastrarSenhaFormField.ConfirmacaoSenha)}
                  id={CadastrarSenhaFormField.ConfirmacaoSenha}
                  label="Confirmar nova senha"
                  name={CadastrarSenhaFormField.ConfirmacaoSenha}
                  onBlur={form.onBlur}
                  onChange={form.onChange}
                  required
                  type={InputAppType.Password}
                  value={form.values.confirmacaoSenha}
                />
              </BoxApp>
            </FormRoot.Form>
          </BoxApp>
        </PaperApp>
      </ContainerApp>
    </BoxApp>
  )
}
