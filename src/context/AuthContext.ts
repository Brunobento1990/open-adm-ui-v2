import { createContext } from 'react'
import type { AuthLoginResponse } from '../types/AuthTypes'
import type { Empresa } from '../types/EmpresaTypes'
import type { Usuario } from '../types/UsuarioTypes'

export type AuthContextValue = {
  empresa?: Empresa
  atualizarEmpresa: (empresa: Empresa) => void
  isLoggedIn: boolean
  login: (response: AuthLoginResponse) => void
  logout: () => void
  tokenJwt?: string
  usuario?: Usuario
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
