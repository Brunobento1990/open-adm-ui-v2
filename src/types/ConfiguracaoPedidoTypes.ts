export enum ConfiguracaoPedidoFormField {
  EmailDeEnvio = 'emailDeEnvio',
  PedidoMinimoAtacado = 'pedidoMinimoAtacado',
  PedidoMinimoVarejo = 'pedidoMinimoVarejo',
  VendaDeProdutoComEstoque = 'vendaDeProdutoComEstoque',
  WhatsApp = 'whatsApp',
}

export interface ConfiguracaoPedido {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao: string
  numero: number
  emailDeEnvio: string
  whatsApp?: string
  pedidoMinimoAtacado?: number
  pedidoMinimoVarejo?: number
  vendaDeProdutoComEstoque: boolean
}

export type AtualizarConfiguracaoPedido = Pick<
  ConfiguracaoPedido,
  | 'emailDeEnvio'
  | 'whatsApp'
  | 'pedidoMinimoAtacado'
  | 'pedidoMinimoVarejo'
  | 'vendaDeProdutoComEstoque'
>

export type ConfiguracaoPedidoForm = Omit<
  AtualizarConfiguracaoPedido,
  'pedidoMinimoAtacado' | 'pedidoMinimoVarejo'
> & {
  pedidoMinimoAtacado?: number | ''
  pedidoMinimoVarejo?: number | ''
}
