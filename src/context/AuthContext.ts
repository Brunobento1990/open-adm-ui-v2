import { createContext } from 'react'
import type { AuthLoginResponse, FuncionarioAutenticado } from '../types/AuthTypes'
import type { Empresa } from '../types/EmpresaTypes'

export type AuthContextValue = {
  empresa?: Empresa
  atualizarEmpresa: (empresa: Empresa) => void
  isLoggedIn: boolean
  login: (response: AuthLoginResponse) => void
  logout: () => void
  tokenJwt?: string
  usuario?: FuncionarioAutenticado
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
