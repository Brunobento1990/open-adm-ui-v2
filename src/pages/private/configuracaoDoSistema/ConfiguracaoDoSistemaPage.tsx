import { useEffect } from 'react'
import { useApiConfiguracaoDoSistema } from '../../../api/useApiConfiguracaoDoSistema'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  ConfiguracaoDoSistemaFormField,
  type ConfiguracaoDoSistemaForm,
} from '../../../types/ConfiguracaoDoSistemaTypes'
import { limparTelefone } from '../../../utils/documentUtils'

const valoresIniciais: ConfiguracaoDoSistemaForm = {
  emailParaEnvioNotificacao: '',
  mensagemPedidoFinalizado: '',
  whatsAppParaEnvioNotificacao: '',
  pedidoMinimoAtacado: '',
  pedidoMinimoVarejo: '',
  listarProdutoSomenteComEstoque: false,
  vendaDeProdutoComEstoque: false,
  notificarCadastroNovoCliente: false,
}

const validacao = new YupAdapter()
  .email(
    ConfiguracaoDoSistemaFormField.EmailParaEnvioNotificacao,
    'Informe o e-mail!',
  )
  .build()

function valorMonetarioOuUndefined(value?: number | '') {
  return value === '' ? undefined : value
}

export function ConfiguracaoDoSistemaPage() {
  const { atualizar, obter } = useApiConfiguracaoDoSistema()
  const form = useFormikAdapter<ConfiguracaoDoSistemaForm>({
    initialValues: valoresIniciais,
    validationSchema: validacao,
    onSubmit: async (values: ConfiguracaoDoSistemaForm) => {
      const response = await atualizar.fetch({
        emailParaEnvioNotificacao: values.emailParaEnvioNotificacao,
        mensagemPedidoFinalizado: values.mensagemPedidoFinalizado,
        whatsAppParaEnvioNotificacao: limparTelefone(
          values.whatsAppParaEnvioNotificacao,
        ),
        pedidoMinimoAtacado: valorMonetarioOuUndefined(values.pedidoMinimoAtacado),
        pedidoMinimoVarejo: valorMonetarioOuUndefined(values.pedidoMinimoVarejo),
        listarProdutoSomenteComEstoque: values.listarProdutoSomenteComEstoque,
        vendaDeProdutoComEstoque: values.vendaDeProdutoComEstoque,
        notificarCadastroNovoCliente: values.notificarCadastroNovoCliente,
      })
      if (response) {
        form.setValue({
          emailParaEnvioNotificacao: response.emailParaEnvioNotificacao,
          mensagemPedidoFinalizado: response.mensagemPedidoFinalizado ?? '',
          whatsAppParaEnvioNotificacao:
            response.whatsAppParaEnvioNotificacao ?? '',
          pedidoMinimoAtacado: response.pedidoMinimoAtacado ?? '',
          pedidoMinimoVarejo: response.pedidoMinimoVarejo ?? '',
          listarProdutoSomenteComEstoque:
            response.listarProdutoSomenteComEstoque ?? false,
          vendaDeProdutoComEstoque: response.vendaDeProdutoComEstoque,
          notificarCadastroNovoCliente:
            response.notificarCadastroNovoCliente ?? false,
        })
      }
    },
  })

  useEffect(() => {
    async function carregar() {
      const response = await obter.fetch()
      if (!response) return
      form.setValue({
        emailParaEnvioNotificacao: response.emailParaEnvioNotificacao,
        mensagemPedidoFinalizado: response.mensagemPedidoFinalizado ?? '',
        whatsAppParaEnvioNotificacao:
          response.whatsAppParaEnvioNotificacao ?? '',
        pedidoMinimoAtacado: response.pedidoMinimoAtacado ?? '',
        pedidoMinimoVarejo: response.pedidoMinimoVarejo ?? '',
        listarProdutoSomenteComEstoque:
          response.listarProdutoSomenteComEstoque ?? false,
        vendaDeProdutoComEstoque: response.vendaDeProdutoComEstoque,
        notificarCadastroNovoCliente:
          response.notificarCadastroNovoCliente ?? false,
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
        <FormRoot.FormItemRow xs={12}>
          <InputApp
            id={ConfiguracaoDoSistemaFormField.MensagemPedidoFinalizado}
            label="Mensagem do pedido finalizado"
            maxLength={3000}
            multiline
            name={ConfiguracaoDoSistemaFormField.MensagemPedidoFinalizado}
            onBlur={form.onBlur}
            onChange={form.onChange}
            rows={6}
            value={form.values.mensagemPedidoFinalizado ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            error={form.error(ConfiguracaoDoSistemaFormField.EmailParaEnvioNotificacao)}
            focus
            helperText={form.helperText(ConfiguracaoDoSistemaFormField.EmailParaEnvioNotificacao)}
            id={ConfiguracaoDoSistemaFormField.EmailParaEnvioNotificacao}
            label="E-mail para envio de notificação"
            maxLength={255}
            name={ConfiguracaoDoSistemaFormField.EmailParaEnvioNotificacao}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Email}
            value={form.values.emailParaEnvioNotificacao}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            id={ConfiguracaoDoSistemaFormField.WhatsAppParaEnvioNotificacao}
            label="WhatsApp para envio de notificação"
            maxLength={255}
            name={ConfiguracaoDoSistemaFormField.WhatsAppParaEnvioNotificacao}
            onBlur={form.onBlur}
            onChange={form.onChange}
            type={InputAppType.Tel}
            value={form.values.whatsAppParaEnvioNotificacao}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            id={ConfiguracaoDoSistemaFormField.PedidoMinimoAtacado}
            label="Pedido minimo no atacado"
            name={ConfiguracaoDoSistemaFormField.PedidoMinimoAtacado}
            onBlur={form.onBlur}
            onChange={form.onChange}
            startAdornment="R$"
            type={InputAppType.Currency}
            value={form.values.pedidoMinimoAtacado}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            id={ConfiguracaoDoSistemaFormField.PedidoMinimoVarejo}
            label="Pedido minimo no varejo"
            name={ConfiguracaoDoSistemaFormField.PedidoMinimoVarejo}
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
            checked={form.values.listarProdutoSomenteComEstoque}
            id={ConfiguracaoDoSistemaFormField.ListarProdutoSomenteComEstoque}
            label="Listar produto somente com estoque"
            name={ConfiguracaoDoSistemaFormField.ListarProdutoSomenteComEstoque}
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            checked={form.values.vendaDeProdutoComEstoque}
            id={ConfiguracaoDoSistemaFormField.VendaDeProdutoComEstoque}
            label="Venda de produto somente com estoque"
            name={ConfiguracaoDoSistemaFormField.VendaDeProdutoComEstoque}
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} sm={6}>
          <InputApp
            checked={form.values.notificarCadastroNovoCliente}
            id={ConfiguracaoDoSistemaFormField.NotificarCadastroNovoCliente}
            label="Notificar cadastro de novo cliente"
            name={ConfiguracaoDoSistemaFormField.NotificarCadastroNovoCliente}
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
