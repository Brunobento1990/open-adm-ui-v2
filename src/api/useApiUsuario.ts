import type { TrocarSenhaRequest, Usuario, UsuarioSessao } from '../types/UsuarioTypes'
import { ApiMethod, useApi } from '../hook/useApi'
import { ApiRoutePath, UsuarioApiRoutePath } from './apiRoutes'

type LogoutResponse = {
  resultado: boolean
}

export function useApiMinhaConta() {
  return useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Usuario}${UsuarioApiRoutePath.MinhaConta}`,
  })
}

export function useApiUsuarioSessoes() {
  const api = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Usuario}${UsuarioApiRoutePath.Sessoes}`,
  })

  return {
    ...api,
    action: () => api.action<UsuarioSessao[]>(),
  }
}

export function useApiUsuarioLogout() {
  const api = useApi({
    method: ApiMethod.Put,
    naoDeslogarAoReceber401: true,
    naoRenderizarResposta: true,
    url: `${ApiRoutePath.Usuario}${UsuarioApiRoutePath.Logout}`,
  })

  return {
    ...api,
    action: () => api.action<LogoutResponse>(),
  }
}

export function useApiUsuarioLogoutSessao() {
  const api = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Usuario}${UsuarioApiRoutePath.Logout}`,
  })

  return {
    ...api,
    action: (sessaoId: string) => api.action<LogoutResponse>({
      urlParams: `/${sessaoId}`,
      message: 'Sessão encerrada com sucesso!',
    }),
  }
}

export function useApiUsuarioTrocarSenha() {
  const api = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Usuario}${UsuarioApiRoutePath.TrocarSenha}`,
  })

  return {
    ...api,
    action: (values: TrocarSenhaRequest, onSuccess: () => void) => api.action<LogoutResponse>({
      body: values,
      message: 'Senha alterada com sucesso!',
      onSuccess,
    }),
  }
}

export function useApiUsuario() {
  const apiCriar = useApi({ method: ApiMethod.Post, url: ApiRoutePath.Usuario })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Usuario,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.Usuario })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Usuario>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: Partial<Usuario>) => apiCriar.action<Usuario>({
        body: values,
        message: 'Usuário criado com sucesso. O e-mail para cadastro da primeira senha foi enviado.',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (id: string, values: Partial<Usuario>) => apiAtualizar.action<Usuario>({
        body: values,
        urlParams: `?id=${encodeURIComponent(id)}`,
        message: 'Usuário atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}

export type MinhaContaResponse = Usuario
