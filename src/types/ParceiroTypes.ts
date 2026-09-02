export enum RedeSocialTipo {
  Facebook = 1,
  Instagram = 2,
}

export const redeSocialOpcoes = [
  { id: RedeSocialTipo.Facebook, descricao: 'Facebook' },
  { id: RedeSocialTipo.Instagram, descricao: 'Instagram' },
] as const

export enum ParceiroFormField {
  Cnpj = 'cnpj',
  Logo = 'logo',
  NomeFantasia = 'nomeFantasia',
  RazaoSocial = 'razaoSocial',
}

export enum EnderecoParceiroField {
  Bairro = 'bairro',
  Cep = 'cep',
  Complemento = 'complemento',
  Localidade = 'localidade',
  Logradouro = 'logradouro',
  Numero = 'numero',
  Uf = 'uf',
}

export interface EnderecoParceiro {
  id?: string
  cep: string
  logradouro: string
  localidade: string
  bairro: string
  numero: string
  complemento: string
  uf: string
}

export interface TelefoneParceiro {
  id?: string
  telefone: string
}

export interface RedeSocialParceiro {
  id?: string
  dataDeCriacao?: string
  dataDeAtualizacao?: string
  numero?: number
  link: string
  redeSocialEnum?: RedeSocialTipo
}

export interface Parceiro {
  id?: string
  dataDeCriacao?: string
  dataDeAtualizacao?: string
  numero?: number
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  logo?: string
  telefones: TelefoneParceiro[]
  redesSociais: RedeSocialParceiro[]
  enderecoParceiro?: EnderecoParceiro
}
