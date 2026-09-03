import { useEffect } from 'react'
import { useApiConfiguracaoMercadoPago } from '../../../api/useApiConfiguracaoMercadoPago'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  ConfiguracaoMercadoPagoFormField,
  type ConfiguracaoMercadoPago,
} from '../../../types/ConfiguracaoMercadoPagoTypes'

const valoresIniciais: ConfiguracaoMercadoPago = {
  publicKey: '',
  accessToken: '',
  urlWebHook: '',
  cobrarCpf: false,
  cobrarCnpj: false,
}

const validacao = new YupAdapter()
  .string(ConfiguracaoMercadoPagoFormField.PublicKey, 'Informe a Public Key')
  .string(ConfiguracaoMercadoPagoFormField.AccessToken, 'Informe o Access Token')
  .string(ConfiguracaoMercadoPagoFormField.UrlWebHook, 'Informe a URL do webhook')
  .build()

export function ConfiguracaoMercadoPagoPage() {
  const { atualizar, obter } = useApiConfiguracaoMercadoPago()
  const form = useFormikAdapter<ConfiguracaoMercadoPago>({
    initialValues: valoresIniciais,
    validationSchema: validacao,
    onSubmit: async (values: ConfiguracaoMercadoPago) => {
      const response = await atualizar.fetch(values)
      if (response) form.setValue(response)
    },
  })

  useEffect(() => {
    async function carregar() {
      const response = await obter.fetch()
      if (response) form.setValue(response)
    }
    carregar()
    // Esta consulta pertence apenas à montagem da página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FormRoot.Form
      loading={obter.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            error={form.error(ConfiguracaoMercadoPagoFormField.PublicKey)}
            focus
            helperText={form.helperText(ConfiguracaoMercadoPagoFormField.PublicKey)}
            id={ConfiguracaoMercadoPagoFormField.PublicKey}
            label="Public Key"
            name={ConfiguracaoMercadoPagoFormField.PublicKey}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            value={form.values.publicKey}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            error={form.error(ConfiguracaoMercadoPagoFormField.AccessToken)}
            helperText={form.helperText(ConfiguracaoMercadoPagoFormField.AccessToken)}
            id={ConfiguracaoMercadoPagoFormField.AccessToken}
            label="Access Token"
            name={ConfiguracaoMercadoPagoFormField.AccessToken}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            value={form.values.accessToken}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            checked={form.values.cobrarCpf}
            id={ConfiguracaoMercadoPagoFormField.CobrarCpf}
            label="Cobrar de CPF"
            name={ConfiguracaoMercadoPagoFormField.CobrarCpf}
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            checked={form.values.cobrarCnpj}
            id={ConfiguracaoMercadoPagoFormField.CobrarCnpj}
            label="Cobrar de CNPJ"
            name={ConfiguracaoMercadoPagoFormField.CobrarCnpj}
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            error={form.error(ConfiguracaoMercadoPagoFormField.UrlWebHook)}
            helperText={form.helperText(ConfiguracaoMercadoPagoFormField.UrlWebHook)}
            id={ConfiguracaoMercadoPagoFormField.UrlWebHook}
            label="URL do webhook"
            name={ConfiguracaoMercadoPagoFormField.UrlWebHook}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Url}
            value={form.values.urlWebHook ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
