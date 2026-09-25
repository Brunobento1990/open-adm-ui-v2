export enum RepresentanteFormField {
  Id = 'id',
  Nome = 'nome',
  Cpf = 'cpf',
  Email = 'email',
  Telefone = 'telefone',
  Senha = 'senha',
  ConfirmacaoSenha = 'confirmacaoSenha',
}

export interface Representante {
  id: string
  numero: number
  dataDeCriacao: string
  dataDeAtualizacao: string
  nome: string
  cpf?: string
  email?: string
  telefone?: string
  ativo: boolean
}

export type RepresentanteFormValues = {
  nome: string
  cpf: string
  email: string
  telefone: string
  senha: string
  confirmacaoSenha: string
}

export type CriarRepresentanteRequest = {
  nome: string
  cpf?: string
  email?: string
  telefone?: string
  senha?: string
  confirmarSenha?: string
}

export type EditarRepresentanteRequest = {
  id: string
  nome: string
  cpf?: string
  email?: string
  telefone?: string
}
