export enum LoginFormField {
  Email = 'email',
  Senha = 'senha',
}

export interface LoginRequest {
  [LoginFormField.Email]: string
  [LoginFormField.Senha]: string
}

export interface EsqueciSenhaRequest {
  [LoginFormField.Email]: string
}

export enum CadastrarSenhaFormField {
  Senha = 'senha',
  ConfirmacaoSenha = 'confirmacaoSenha',
}

export interface CadastrarSenhaFormValues {
  [CadastrarSenhaFormField.Senha]: string
  [CadastrarSenhaFormField.ConfirmacaoSenha]: string
}

export interface CadastrarSenhaRequest {
  codigo: string
  [CadastrarSenhaFormField.Senha]: string
  [CadastrarSenhaFormField.ConfirmacaoSenha]: string
}
