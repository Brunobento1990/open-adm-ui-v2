export enum BannerFormField {
  Ativo = 'ativo',
  Foto = 'foto',
  NovaFoto = 'novaFoto',
}

export interface Banner {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao?: string
  foto: string
  novaFoto?: string
  ativo: boolean
}

export type BannerPayload = Partial<Banner>
