export enum StatusConexaoWhatsAppEnum {
  Desconectado = 1,
  Conectando = 2,
  Conectado = 3,
}

export interface ConexaoWhatsAppResponse {
  status: StatusConexaoWhatsAppEnum
  naoHaInstancia: boolean
  pairingCode?: string
  base64?: string
  fotoPerfil?: string
}

export interface AtualizarConexaoWhatsAppResponse {
  status?: StatusConexaoWhatsAppEnum
  fotoPerfil?: string
}
