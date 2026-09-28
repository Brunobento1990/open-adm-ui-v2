import { ApiMethod, useApi } from '../hook/useApi'
import type { Cliente, HistoricoCliente } from '../types/ClienteTypes'
import { ApiRoutePath, ClienteRepresentanteApiRoutePath } from './apiRoutes'

export function useApiCliente() {
  const apiCriar = useApi({ method: ApiMethod.Post, url: ApiRoutePath.ClienteRepresentante })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.ClienteRepresentante,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.ClienteRepresentante })
  const apiHistorico = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.ClienteRepresentante}${ClienteRepresentanteApiRoutePath.Historico}`,
    naoRenderizarResposta: true,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Cliente>({ urlParams: `/${encodeURIComponent(id)}` }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: Partial<Cliente>) =>
        apiCriar.action<Cliente>({
          body: values,
          message: 'Cliente criado com sucesso',
        }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (id: string, values: Partial<Cliente>) =>
        apiAtualizar.action<Cliente>({
          body: values,
          urlParams: `/${encodeURIComponent(id)}`,
          message: 'Cliente atualizado com sucesso',
        }),
      loading: apiAtualizar.loading,
    },
    historico: {
      fetch: (clienteId: string) =>
        apiHistorico.action<HistoricoCliente>({
          urlParams: `?clienteId=${encodeURIComponent(clienteId)}`,
        }),
      loading: apiHistorico.loading,
    },
  }
}
