import { ApiMethod, useApi } from '../hook/useApi'
import type {
  Estoque,
  MovimentacaoEstoqueManualFormValues,
} from '../types/EstoqueTypes'
import { ApiResourceRoutePath, ApiRoutePath } from './apiRoutes'

export function useApiEstoque() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Estoque,
    naoRenderizarResposta: true,
  })
  const apiMovimentar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Estoque}${ApiResourceRoutePath.Movimentacao}`,
  })
  const apiMovimentarManualmente = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Estoque}${ApiResourceRoutePath.MovimentacaoManual}`,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Estoque>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    movimentar: {
      fetch: (values: Partial<Estoque>) => apiMovimentar.action({
        body: values,
        message: 'Estoque movimentado com sucesso',
      }),
      loading: apiMovimentar.loading,
    },
    movimentarManualmente: {
      fetch: (values: Partial<MovimentacaoEstoqueManualFormValues>) => apiMovimentarManualmente.action({
        body: values,
        message: 'Estoque movimentado com sucesso',
      }),
      loading: apiMovimentarManualmente.loading,
    },
  }
}
