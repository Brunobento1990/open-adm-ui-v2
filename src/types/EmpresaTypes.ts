export enum EmpresaFormField {
  RazaoSocial = 'razaoSocial',
  NomeFantasia = 'nomeFantasia',
  Cnpj = 'cnpj',
  Telefone = 'telefone',
  Logo = 'logo',
}

export interface Empresa {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao?: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  telefone?: string
  logo?: string
  ativo: boolean
}
