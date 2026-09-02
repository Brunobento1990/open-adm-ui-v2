import { ApiMethod, useApi } from '../hook/useApi'
import type { Pedido } from '../types/PedidoTypes'
import { ApiRoutePath, PedidoApiRoutePath } from './apiRoutes'

export function useApiPedido() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiDownload = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.Download}`,
    naoRenderizarResposta: true,
  })
  const apiExcluir = useApi({
    method: ApiMethod.Delete,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.Excluir}`,
  })

  return {
    obter: {
      fetch: (pedidoId: string) => apiObter.action<Pedido>({
        urlParams: `?pedidoId=${encodeURIComponent(pedidoId)}`,
      }),
      loading: apiObter.loading,
    },
    download: {
      fetch: (pedidoId: string) =>
        apiDownload.action<Blob>({
          urlParams: `?pedidoId=${encodeURIComponent(pedidoId)}`,
          responseType: 'blob',
        }),
      loading: apiDownload.loading,
    },
    excluir: {
      fetch: async (id: string) => {
        const response = await apiExcluir.action<{ resultado: boolean }>({
          urlParams: `?id=${encodeURIComponent(id)}`,
        })
        return response?.resultado ?? false
      },
      loading: apiExcluir.loading,
    },
  }
}
