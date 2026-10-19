export enum ConfiguracaoPedidoFormField {
  EmailDeEnvio = 'emailDeEnvio',
  MensagemPedidoFinalizado = 'mensagemPedidoFinalizado',
  PedidoMinimoAtacado = 'pedidoMinimoAtacado',
  PedidoMinimoVarejo = 'pedidoMinimoVarejo',
  ListarProdutoSomenteComEstoque = 'listarProdutoSomenteComEstoque',
  VendaDeProdutoComEstoque = 'vendaDeProdutoComEstoque',
  WhatsApp = 'whatsApp',
}

export interface ConfiguracaoPedido {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao: string
  numero: number
  emailDeEnvio: string
  mensagemPedidoFinalizado?: string
  whatsApp?: string
  pedidoMinimoAtacado?: number
  pedidoMinimoVarejo?: number
  listarProdutoSomenteComEstoque: boolean
  vendaDeProdutoComEstoque: boolean
}

export type AtualizarConfiguracaoPedido = Pick<
  ConfiguracaoPedido,
  | 'emailDeEnvio'
  | 'mensagemPedidoFinalizado'
  | 'whatsApp'
  | 'pedidoMinimoAtacado'
  | 'pedidoMinimoVarejo'
  | 'listarProdutoSomenteComEstoque'
  | 'vendaDeProdutoComEstoque'
>

export type ConfiguracaoPedidoForm = Omit<
  AtualizarConfiguracaoPedido,
  'pedidoMinimoAtacado' | 'pedidoMinimoVarejo'
> & {
  pedidoMinimoAtacado?: number | ''
  pedidoMinimoVarejo?: number | ''
}
