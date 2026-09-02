import { ApiMethod, useApi } from '../hook/useApi'
import { ApiRoutePath, PedidoApiRoutePath } from './apiRoutes'

export function useApiPedido() {
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
        return response?.resultado
      },
      loading: apiExcluir.loading,
    },
  }
}
