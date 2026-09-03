import { ApiMethod, useApi } from '../hook/useApi'
import type { AtualizarSenhaClienteVenda, ClienteVenda } from '../types/ClienteVendaTypes'
import { ApiRoutePath, ClienteVendaApiRoutePath } from './apiRoutes'

export function useApiClienteVenda() {
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.ClienteVenda}${ClienteVendaApiRoutePath.Criar}`,
  })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.ClienteVenda}${ClienteVendaApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiAtivarInativar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.ClienteVenda}${ClienteVendaApiRoutePath.AtivarInativar}`,
  })
  const apiAtualizarSenha = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Usuario}${ClienteVendaApiRoutePath.AtualizarSenha}`,
  })

  return {
    criar: {
      fetch: (body: Partial<ClienteVenda>) => apiCriar.action<ClienteVenda>({
        body,
        message: 'Cliente criado com sucesso',
      }),
      loading: apiCriar.loading,
    },
    obter: {
      fetch: (id: string) => apiObter.action<ClienteVenda>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    ativarInativar: {
      fetch: (id: string) => apiAtivarInativar.action({
        urlParams: `?id=${encodeURIComponent(id)}`,
        message: 'Acesso do cliente atualizado com sucesso',
      }),
      loading: apiAtivarInativar.loading,
    },
    atualizarSenha: {
      fetch: (body: AtualizarSenhaClienteVenda) => apiAtualizarSenha.action({
        body,
        message: 'Senha atualizada com sucesso',
      }),
      loading: apiAtualizarSenha.loading,
    },
  }
}
