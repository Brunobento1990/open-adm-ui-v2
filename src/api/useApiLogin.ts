import { ApiMethod, useApi } from '../hook/useApi'
import { useAuth } from '../hook/useAuth'
import type { AuthLoginResponse } from '../types/AuthTypes'
import type {
  EsqueciSenhaRequest,
  LoginRequest,
  CadastrarSenhaRequest,
} from '../types/LoginTypes'
import { ApiRoutePath, LoginApiRoutePath } from './apiRoutes'

export function useApiLogin() {
  const { login } = useAuth()
  const api = useApi({
    method: ApiMethod.Post,
    url: ApiRoutePath.Login,
    naoEnviarToken: true,
    naoRenderizarResposta: true,
  })

  async function action(values: LoginRequest) {
    const response = await api.action<AuthLoginResponse>({
      body: values,
    })

    if (response) {
      login(response)
    }
  }

  return {
    action,
    loading: api.loading,
  }
}

export function useApiEsqueciSenha() {
  const api = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Usuario}${LoginApiRoutePath.EsqueciSenha}`,
  })

  return {
    action: (values: EsqueciSenhaRequest, onSuccess?: () => void) => api.action({
      body: values,
      message: 'E-mail de recuperacao enviado com sucesso!',
      onSuccess,
    }),
    loading: api.loading,
  }
}

export function useApiCadastrarSenha() {
  const api = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Usuario}${LoginApiRoutePath.CadastrarSenha}`,
  })

  return {
    action: (
      values: CadastrarSenhaRequest,
      onSuccess: () => void,
    ) => api.action({
      body: values,
      message: 'Senha alterada com sucesso!',
      onSuccess,
    }),
    loading: api.loading,
  }
}
