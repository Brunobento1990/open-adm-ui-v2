export enum LojaParceiraFormField {
  Contato = 'contato',
  Endereco = 'endereco',
  Facebook = 'facebook',
  Foto = 'foto',
  Instagram = 'instagram',
  Nome = 'nome',
  NovaFoto = 'novaFoto',
}

export interface LojaParceira {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao?: string
  numero: number
  ativo: boolean
  nome: string
  nomeFoto?: string
  foto?: string
  novaFoto?: string
  instagram?: string
  facebook?: string
  endereco?: string
  contato?: string
}

export type LojaParceiraPayload = Partial<LojaParceira>
