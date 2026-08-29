import { ApiMethod, useApi } from '../hook/useApi'
import type { Cliente } from '../types/ClienteTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiCliente() {
  const apiCriar = useApi({ method: ApiMethod.Post, url: ApiRoutePath.Cliente })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Cliente,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.Cliente })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Cliente>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: Partial<Cliente>) => apiCriar.action<Cliente>({
        body: values,
        message: 'Cliente criado com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (id: string, values: Partial<Cliente>) => apiAtualizar.action<Cliente>({
        body: values,
        urlParams: `?id=${encodeURIComponent(id)}`,
        message: 'Cliente atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}
