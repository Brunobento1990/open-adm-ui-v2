export enum ClienteVendaFormField {
  Cnpj = 'cnpj',
  ConfirmarSenha = 'confirmarSenha',
  Cpf = 'cpf',
  Email = 'email',
  EnderecoUsuario = 'enderecoUsuario',
  Nome = 'nome',
  ReSenha = 'reSenha',
  Senha = 'senha',
  Telefone = 'telefone',
}

export enum EnderecoClienteVendaField {
  Bairro = 'bairro',
  Cep = 'cep',
  Complemento = 'complemento',
  Localidade = 'localidade',
  Logradouro = 'logradouro',
  Numero = 'numero',
  Uf = 'uf',
}

export type EnderecoClienteVenda = {
  id?: string
  cep?: string
  logradouro?: string
  bairro?: string
  localidade?: string
  complemento?: string
  numero?: string
  uf?: string
}

export type ClienteVenda = {
  id: string
  dataDeCriacao?: string
  dataDeAtualizacao?: string
  numero?: number
  nome: string
  email?: string
  telefone?: string
  cnpj?: string
  cpf?: string
  quantidadeDePedido?: number
  isAtacado?: boolean
  ativo: boolean
  senha?: string
  reSenha?: string
  enderecoUsuario?: EnderecoClienteVenda
}

export type AtualizarSenhaClienteVenda = {
  usuarioId: string
  senha: string
  confirmarSenha: string
}

export type ConsultaCnpj = {
  cnpj: string
  nome_fantasia: string
  razao_social: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  uf: string
  municipio: string
  ddd_telefone_1: string
}
