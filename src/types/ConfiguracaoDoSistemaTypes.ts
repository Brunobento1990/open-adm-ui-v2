export enum ConfiguracaoDoSistemaFormField {
  EmailParaEnvioNotificacao = 'emailParaEnvioNotificacao',
  MensagemPedidoFinalizado = 'mensagemPedidoFinalizado',
  PedidoMinimoAtacado = 'pedidoMinimoAtacado',
  PedidoMinimoVarejo = 'pedidoMinimoVarejo',
  ListarProdutoSomenteComEstoque = 'listarProdutoSomenteComEstoque',
  VendaDeProdutoComEstoque = 'vendaDeProdutoComEstoque',
  NotificarCadastroNovoCliente = 'notificarCadastroNovoCliente',
  WhatsAppParaEnvioNotificacao = 'whatsAppParaEnvioNotificacao',
}

export interface ConfiguracaoDoSistema {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao: string
  numero: number
  emailParaEnvioNotificacao: string
  mensagemPedidoFinalizado?: string
  whatsAppParaEnvioNotificacao?: string
  pedidoMinimoAtacado?: number
  pedidoMinimoVarejo?: number
  listarProdutoSomenteComEstoque: boolean
  vendaDeProdutoComEstoque: boolean
  notificarCadastroNovoCliente: boolean
}

export type AtualizarConfiguracaoDoSistema = Pick<
  ConfiguracaoDoSistema,
  | 'emailParaEnvioNotificacao'
  | 'mensagemPedidoFinalizado'
  | 'whatsAppParaEnvioNotificacao'
  | 'pedidoMinimoAtacado'
  | 'pedidoMinimoVarejo'
  | 'listarProdutoSomenteComEstoque'
  | 'vendaDeProdutoComEstoque'
  | 'notificarCadastroNovoCliente'
>

export type ConfiguracaoDoSistemaForm = Omit<
  AtualizarConfiguracaoDoSistema,
  'pedidoMinimoAtacado' | 'pedidoMinimoVarejo'
> & {
  pedidoMinimoAtacado?: number | ''
  pedidoMinimoVarejo?: number | ''
}
