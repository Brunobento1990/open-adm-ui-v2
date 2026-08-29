export interface Usuario {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao: string
  telefone: string
  email: string
  nome: string
  cpf: string
  ativo: boolean
}

export enum UsuarioFormField {
  Nome = 'nome',
  Email = 'email',
  Cpf = 'cpf',
  Telefone = 'telefone',
}

export interface UsuarioSessao {
  id: string
  dataDeCadastro: string
  dataDeAtualizacao?: string | null
  ultimaAtividadeEm?: string | null
  expiraEm: string
  enderecoIp?: string | null
  sistemaOperacional?: string | null
  navegador?: string | null
  dispositivo?: string | null
  sessaoId: string
  sessaoAtual: boolean
}
export enum TrocarSenhaFormField {
  SenhaAtual = 'senhaAtual',
  Senha = 'senha',
  ConfirmacaoSenha = 'confirmacaoSenha',
}

export interface TrocarSenhaRequest {
  [TrocarSenhaFormField.SenhaAtual]: string
  [TrocarSenhaFormField.Senha]: string
  [TrocarSenhaFormField.ConfirmacaoSenha]: string
}
