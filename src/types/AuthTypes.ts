export interface FuncionarioAutenticado {
  id: string
  dataDeCriacao: string
  dataDeAtualizacao: string
  numero: number
  nome: string
  email: string
  telefone?: string | null
  avatar?: string | null
}

export interface AuthLoginResponse {
  token: string
  refreshToken: string
  usuario: FuncionarioAutenticado
}
