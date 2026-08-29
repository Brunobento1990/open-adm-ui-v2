export enum ClienteFormField {
  Cpf = 'cpf',
  Nome = 'nome',
  Telefone = 'telefone',
}

export interface Cliente {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao?: string
  nome: string
  cpf?: string
  telefone?: string
  ativo: boolean
}
