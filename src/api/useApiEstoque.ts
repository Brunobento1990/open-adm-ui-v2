import { ApiMethod, useApi } from '../hook/useApi'
import type { Estoque } from '../types/EstoqueTypes'
import { ApiRoutePath, EstoquesApiRoutePath } from './apiRoutes'

export function useApiEstoque() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Estoque}${EstoquesApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Estoque}${EstoquesApiRoutePath.Atualizar}`,
  })
  return {
    obter: {
      fetch: (id: string) => apiObter.action<Estoque>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    atualizar: {
      fetch: (values: Partial<Estoque>) => apiAtualizar.action({
        body: values,
        message: 'Estoque atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}
