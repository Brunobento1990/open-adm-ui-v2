import { useEffect } from 'react'
import { useApiConfiguracaoPedido } from '../../../api/useApiConfiguracaoPedido'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  ConfiguracaoPedidoFormField,
  type ConfiguracaoPedidoForm,
} from '../../../types/ConfiguracaoPedidoTypes'
import { limparTelefone } from '../../../utils/documentUtils'

const valoresIniciais: ConfiguracaoPedidoForm = {
  emailDeEnvio: '',
  whatsApp: '',
  pedidoMinimoAtacado: '',
  pedidoMinimoVarejo: '',
  vendaDeProdutoComEstoque: false,
}

const validacao = new YupAdapter()
  .email(ConfiguracaoPedidoFormField.EmailDeEnvio, 'Informe o e-mail!')
  .build()

function valorMonetarioOuUndefined(value?: number | '') {
  return value === '' ? undefined : value
}

export function ConfiguracaoPedidoPage() {
  const { atualizar, obter } = useApiConfiguracaoPedido()
  const form = useFormikAdapter<ConfiguracaoPedidoForm>({
    initialValues: valoresIniciais,
    validationSchema: validacao,
    onSubmit: async (values: ConfiguracaoPedidoForm) => {
      const response = await atualizar.fetch({
        emailDeEnvio: values.emailDeEnvio,
        whatsApp: limparTelefone(values.whatsApp),
        pedidoMinimoAtacado: valorMonetarioOuUndefined(values.pedidoMinimoAtacado),
        pedidoMinimoVarejo: valorMonetarioOuUndefined(values.pedidoMinimoVarejo),
        vendaDeProdutoComEstoque: values.vendaDeProdutoComEstoque,
      })
      if (response) {
        form.setValue({
          emailDeEnvio: response.emailDeEnvio,
          whatsApp: response.whatsApp ?? '',
          pedidoMinimoAtacado: response.pedidoMinimoAtacado ?? '',
          pedidoMinimoVarejo: response.pedidoMinimoVarejo ?? '',
          vendaDeProdutoComEstoque: response.vendaDeProdutoComEstoque,
        })
      }
    },
  })

  useEffect(() => {
    async function carregar() {
      const response = await obter.fetch()
      if (!response) return
      form.setValue({
        emailDeEnvio: response.emailDeEnvio,
        whatsApp: response.whatsApp ?? '',
        pedidoMinimoAtacado: response.pedidoMinimoAtacado ?? '',
        pedidoMinimoVarejo: response.pedidoMinimoVarejo ?? '',
        vendaDeProdutoComEstoque: response.vendaDeProdutoComEstoque,
      })
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
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            error={form.error(ConfiguracaoPedidoFormField.EmailDeEnvio)}
            focus
            helperText={form.helperText(ConfiguracaoPedidoFormField.EmailDeEnvio)}
            id={ConfiguracaoPedidoFormField.EmailDeEnvio}
            label="E-mail de envio"
            maxLength={255}
            name={ConfiguracaoPedidoFormField.EmailDeEnvio}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Email}
            value={form.values.emailDeEnvio}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            id={ConfiguracaoPedidoFormField.WhatsApp}
            label="WhatsApp de envio"
            maxLength={255}
            name={ConfiguracaoPedidoFormField.WhatsApp}
            onBlur={form.onBlur}
            onChange={form.onChange}
            type={InputAppType.Tel}
            value={form.values.whatsApp}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            id={ConfiguracaoPedidoFormField.PedidoMinimoAtacado}
            label="Pedido minimo no atacado"
            name={ConfiguracaoPedidoFormField.PedidoMinimoAtacado}
            onBlur={form.onBlur}
            onChange={form.onChange}
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.pedidoMinimoAtacado}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            id={ConfiguracaoPedidoFormField.PedidoMinimoVarejo}
            label="Pedido minimo no varejo"
            name={ConfiguracaoPedidoFormField.PedidoMinimoVarejo}
            onBlur={form.onBlur}
            onChange={form.onChange}
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.pedidoMinimoVarejo}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            checked={form.values.vendaDeProdutoComEstoque}
            id={ConfiguracaoPedidoFormField.VendaDeProdutoComEstoque}
            label="Venda de produto somente com estoque"
            name={ConfiguracaoPedidoFormField.VendaDeProdutoComEstoque}
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
