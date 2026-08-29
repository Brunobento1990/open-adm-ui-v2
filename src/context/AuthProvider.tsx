import type { ReactNode } from 'react'
import { useState } from 'react'
import { keysLocalStorage } from '../configs/keysLocalStorage'
import { useLocalStorageApp } from '../hook/useLocalStorageApp'
import { useNavigationApp } from '../hook/useNavigationApp'
import { PrivateRoutePath, PublicRoutePath } from '../routes/appRoutes'
import type { AuthLoginResponse, FuncionarioAutenticado } from '../types/AuthTypes'
import type { Empresa } from '../types/EmpresaTypes'
import { AuthContext } from './AuthContext'

type AuthProviderProps = {
  children?: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { navigate } = useNavigationApp()
  const { getItem, removeItem, setItem } = useLocalStorageApp()
  const [tokenJwt, setTokenJwt] = useState(() => getItem<string>(keysLocalStorage.jwt))
  const [usuario, setUsuario] = useState(() =>
    getItem<FuncionarioAutenticado>(keysLocalStorage.usuario, true),
  )
  const [empresa, setEmpresa] = useState(() =>
    getItem<Empresa>(keysLocalStorage.empresa, true),
  )
  function login(response: AuthLoginResponse) {
    setItem(keysLocalStorage.jwt, response.token)
    setItem(keysLocalStorage.refreshToken, response.refreshToken)
    setItem(keysLocalStorage.usuario, response.usuario, true)

    setTokenJwt(response.token)
    setUsuario(response.usuario)

    navigate(PrivateRoutePath.Dashboard)
  }

  function logout() {
    removeItem(keysLocalStorage.jwt)
    removeItem(keysLocalStorage.refreshToken)
    removeItem(keysLocalStorage.usuario)
    removeItem(keysLocalStorage.empresa)

    setTokenJwt(undefined)
    setUsuario(undefined)
    setEmpresa(undefined)

    navigate(PublicRoutePath.Login)
  }

  function atualizarEmpresa(empresaAtualizada: Empresa) {
    setItem(keysLocalStorage.empresa, empresaAtualizada, true)
    setEmpresa(empresaAtualizada)
  }

  return (
    <AuthContext.Provider
      value={{
        atualizarEmpresa,
        empresa,
        isLoggedIn: Boolean(tokenJwt),
        login,
        logout,
        tokenJwt,
        usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
