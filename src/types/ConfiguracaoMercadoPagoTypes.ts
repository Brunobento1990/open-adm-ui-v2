export enum ConfiguracaoMercadoPagoFormField {
  AccessToken = 'accessToken',
  CobrarCnpj = 'cobrarCnpj',
  CobrarCpf = 'cobrarCpf',
  PublicKey = 'publicKey',
  UrlWebHook = 'urlWebHook',
}

export type ConfiguracaoMercadoPago = {
  publicKey: string
  accessToken: string
  urlWebHook?: string
  cobrarCpf: boolean
  cobrarCnpj: boolean
}
