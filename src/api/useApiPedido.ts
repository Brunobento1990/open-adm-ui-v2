import { ApiMethod, useApi } from '../hook/useApi'
import type {
  Pedido,
  PedidoAtualizarStatusPayload,
  PedidoCobranca,
  PedidoCriarPayload,
  PedidoItemAdicionarPayload,
  PedidoItemAtualizarQuantidadePayload,
  RelatorioPedidoListagem,
  RelatorioPedidoPayload,
} from '../types/PedidoTypes'
import {
  ApiRoutePath,
  PedidoApiRoutePath,
  PedidoCobrancaApiRoutePath,
} from './apiRoutes'

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
  const apiExcluirItem = useApi({
    method: ApiMethod.Delete,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.Itens}`,
  })
  const apiAdicionarItem = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.Itens}`,
  })
  const apiEditarItem = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Pedido}${PedidoApiRoutePath.ItensQuantidade}`,
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
    excluirItem: {
      fetch: async (id: string) => {
        let sucesso = false
        await apiExcluirItem.action({
          urlParams: `?id=${encodeURIComponent(id)}`,
          message: 'Item excluído com sucesso',
          onSuccess: () => {
            sucesso = true
          },
        })
        return sucesso
      },
      loading: apiExcluirItem.loading,
    },
    adicionarItem: {
      fetch: async (body: PedidoItemAdicionarPayload) => {
        let sucesso = false
        await apiAdicionarItem.action({
          body,
          message: 'Item adicionado com sucesso',
          onSuccess: () => {
            sucesso = true
          },
        })
        return sucesso
      },
      loading: apiAdicionarItem.loading,
    },
    editarItem: {
      fetch: async (body: PedidoItemAtualizarQuantidadePayload) => {
        let sucesso = false
        await apiEditarItem.action({
          body,
          message: 'Item atualizado com sucesso',
          onSuccess: () => {
            sucesso = true
          },
        })
        return sucesso
      },
      loading: apiEditarItem.loading,
    },
    cobranca: {
      fetch: (pedidoId: string) => apiCobranca.action<PedidoCobranca>({
        urlParams: `?pedidoId=${encodeURIComponent(pedidoId)}`,
      }),
      loading: apiCobranca.loading,
    },
  }
}
