export enum ContatoFormField {
  Cpf = 'cpf',
  Email = 'email',
  Nome = 'nome',
  Telefone = 'telefone',
}

export interface IContato {
  id?: string
  [ContatoFormField.Nome]: string
  [ContatoFormField.Cpf]?: string | null
  [ContatoFormField.Telefone]?: string | null
  [ContatoFormField.Email]?: string | null
}
