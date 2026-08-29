import { ApiMethod, useApi } from '../hook/useApi'
import type { ClienteUltimoPedidoPaginacao } from '../types/ClienteUltimoPedidoTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiClienteUltimoPedido() {
  const api = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.UltimosPedidos,
    naoRenderizarResposta: true,
    statusInicial: 'loading',
  })

  return {
    listar: {
      fetch: (page: number, isJuridico: boolean, search = '') => api.action<ClienteUltimoPedidoPaginacao>({
        urlParams: `?page=${page}&isJuridico=${isJuridico}&search=${encodeURIComponent(search)}`,
      }),
      loading: api.loading,
    },
  }
}
