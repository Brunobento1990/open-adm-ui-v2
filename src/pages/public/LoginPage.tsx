import { useState, type ComponentPropsWithoutRef } from 'react'
import { useApiLogin } from '../../api/useApiLogin'
import {
  BoxApp
} from '../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppComponent,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppJustifyContent,
  BoxAppPlaceItems,
} from '../../components/BoxApp/boxAppTypes'
import {
  ButtonApp
} from '../../components/ButtonApp/ButtonApp'
import {
  ContainerApp,
  ContainerAppMaxWidth,
} from '../../components/ContainerApp/ContainerApp'
import { DividerApp } from '../../components/DividerApp/DividerApp'
import { InputApp } from '../../components/InputApp/InputApp'
import { InputAppType } from '../../components/InputApp/inputAppTypes'
import { LinkApp } from '../../components/LinkApp/LinkApp'
import { PaperApp } from '../../components/PaperApp/PaperApp'
import {
  TextApp,
  TextAppAlign,
  TextAppColor,
  TextAppVariant,
  TextAppWeight,
} from '../../components/TextApp/TextApp'
import { useFormikAdapter } from '../../hook/useFormikAdapter'
import { YupAdapter } from '../../lib/YupAdapter'
import { LoginFormField, type LoginRequest } from '../../types/LoginTypes'
import { EsqueciSenhaModal } from './EsqueciSenhaModal'

type FormSubmitEvent = Parameters<NonNullable<ComponentPropsWithoutRef<'form'>['onSubmit']>>[0]

const loginInitialValues: LoginRequest = {
  [LoginFormField.Email]: '',
  [LoginFormField.Senha]: '',
}

const loginValidationSchema = new YupAdapter()
  .email(LoginFormField.Email)
  .string(LoginFormField.Senha)
  .build()

export function LoginPage() {
  const [esqueciSenhaOpen, setEsqueciSenhaOpen] = useState(false)
  const apiLogin = useApiLogin()
  const form = useFormikAdapter<LoginRequest>({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      await apiLogin.action(values)
    },
  })

  function handleSubmit(event: FormSubmitEvent) {
    event.preventDefault()
    form.onSubmit()
  }

  return (
    <BoxApp
      component={BoxAppComponent.Main}
      display={BoxAppDisplay.Grid}
      placeItems={BoxAppPlaceItems.Center}
      minHeight="100vh"
      px={2}
      py={4}
    >
      <ContainerApp maxWidth={ContainerAppMaxWidth.Xs} disableGutters>
        <PaperApp elevation={0}>
          <BoxApp
            display={BoxAppDisplay.Flex}
            flexDirection={BoxAppFlexDirection.Column}
            gap={3}
          >
            <BoxApp
              display={BoxAppDisplay.Flex}
              flexDirection={BoxAppFlexDirection.Column}
              gap={1}
            >
              <TextApp
                component="h1"
                variant={TextAppVariant.Title}
                weight={TextAppWeight.Bold}
              >
                Entrar
              </TextApp>
              <TextApp color={TextAppColor.Secondary}>
                Acesse sua conta para iniciar.
              </TextApp>
            </BoxApp>
            <DividerApp />

            <BoxApp
              component={BoxAppComponent.Form}
              noValidate
              onSubmit={handleSubmit}
            >
              <BoxApp
                display={BoxAppDisplay.Flex}
                flexDirection={BoxAppFlexDirection.Column}
                gap={2.25}
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
                  placeholder="voce@empresa.com"
                  required
                  type={InputAppType.Email}
                  value={form.values.email}
                />

                <InputApp
                  autoComplete="current-password"
                  error={form.error(LoginFormField.Senha)}
                  helperText={form.helperText(LoginFormField.Senha)}
                  id={LoginFormField.Senha}
                  label="Senha"
                  name={LoginFormField.Senha}
                  onBlur={form.onBlur}
                  onChange={form.onChange}
                  required
                  type={InputAppType.Password}
                  value={form.values.senha}
                />

                <BoxApp
                  display={BoxAppDisplay.Flex}
                  flexDirection={BoxAppFlexDirection.Row}
                  gap={2}
                  alignItems={BoxAppAlignItems.Center}
                  justifyContent={BoxAppJustifyContent.SpaceBetween}
                >
                  <LinkApp
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      setEsqueciSenhaOpen(true)
                    }}
                  >
                    Esqueci a senha
                  </LinkApp>
                </BoxApp>

                <ButtonApp
                  fullWidth
                  loading={apiLogin.loading}
                  type="submit"
                >
                  Entrar
                </ButtonApp>
              </BoxApp>
            </BoxApp>
            <DividerApp />
            <TextApp color={TextAppColor.Secondary} align={TextAppAlign.Center}>
              Ainda nao tem conta?{' '}
              <LinkApp href="#">
                Solicitar acesso
              </LinkApp>
            </TextApp>
          </BoxApp>
        </PaperApp>
      </ContainerApp>
      {esqueciSenhaOpen && (
        <EsqueciSenhaModal
          email={form.values.email}
          onClose={() => setEsqueciSenhaOpen(false)}
          open
        />
      )}
    </BoxApp>
  )
}
