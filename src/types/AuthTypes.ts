import type { Empresa } from './EmpresaTypes'
import type { Usuario } from './UsuarioTypes'

export interface AuthLoginResponse {
  tokenJwt: string
  usuario: Usuario
  empresa: Empresa
}
