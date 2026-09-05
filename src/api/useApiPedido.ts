import { ApiMethod, useApi } from '../hook/useApi'
import type {
  Pedido,
  PedidoAtualizarStatusPayload,
  PedidoCobranca,
  PedidoCriarPayload,
  RelatorioPedidoListagem,
  RelatorioPedidoPayload,
} from '../types/PedidoTypes'
import { ApiRoutePath, PedidoApiRoutePath, PedidoCobrancaApiRoutePath } from './apiRoutes'

export function useApiPedido() {
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.PedidoAdm}${PedidoApiRoutePath.Criar}`,
  })
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
  const apiAtualizarStatus = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.AtualizarStatus}`,
  })
  const apiCobranca = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.PedidoCobranca}${PedidoCobrancaApiRoutePath.Cobranca}`,
    naoRenderizarResposta: true,
  })
  const apiRelatorioPorPeriodo = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.RelatorioPorPeriodo}`,
    naoRenderizarResposta: true,
  })
  const apiImprimirRelatorioPorPeriodo = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.RelatorioPorPeriodoImprimir}`,
    naoRenderizarResposta: true,
  })

  return {
    relatorioPorPeriodo: {
      fetch: (body: RelatorioPedidoPayload) =>
        apiRelatorioPorPeriodo.action<RelatorioPedidoListagem>({ body }),
      loading: apiRelatorioPorPeriodo.loading,
    },
    imprimirRelatorioPorPeriodo: {
      fetch: (body: RelatorioPedidoPayload) =>
        apiImprimirRelatorioPorPeriodo.action<Blob>({ body, responseType: 'blob' }),
      loading: apiImprimirRelatorioPorPeriodo.loading,
    },
    criar: {
      fetch: (body: PedidoCriarPayload) => apiCriar.action<{ result: boolean }>({
        body,
        message: 'Pedido criado com sucesso',
      }),
      loading: apiCriar.loading,
    },
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
    atualizarStatus: {
      fetch: ({ id, statusPedido }: PedidoAtualizarStatusPayload) =>
        apiAtualizarStatus.action({
          body: { pedidoId: id, statusPedido },
          message: 'Status atualizado com sucesso',
        }),
      loading: apiAtualizarStatus.loading,
    },
    cobranca: {
      fetch: (pedidoId: string) => apiCobranca.action<PedidoCobranca>({
        urlParams: `?pedidoId=${encodeURIComponent(pedidoId)}`,
      }),
      loading: apiCobranca.loading,
    },
  }
}
