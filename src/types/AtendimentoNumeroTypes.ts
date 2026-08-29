export enum TipoProvedorWhatsAppEnum {
  EvoltuionApi = 1,
  WuzApi = 2,
}

export enum AtendimentoNumeroFormField {
  Descricao = 'descricao',
  Numero = 'numero',
  TipoProvedorWhatsApp = 'tipoProvedorWhatsApp',
}

export interface AtendimentoNumeroForm {
  [AtendimentoNumeroFormField.Numero]: string
  [AtendimentoNumeroFormField.Descricao]: string
  [AtendimentoNumeroFormField.TipoProvedorWhatsApp]: TipoProvedorWhatsAppEnum
}
