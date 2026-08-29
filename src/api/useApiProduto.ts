import { ApiMethod, useApi } from '../hook/useApi'
import type { Produto } from '../types/ProdutoTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiProduto() {
  const apiCriar = useApi({ method: ApiMethod.Post, url: ApiRoutePath.Produto })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Produto,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.Produto })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Produto>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: Partial<Produto>) => apiCriar.action<Produto>({
        body: values,
        message: 'Produto criado com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (id: string, values: Partial<Produto>) => apiAtualizar.action<Produto>({
        body: values,
        urlParams: `?id=${encodeURIComponent(id)}`,
        message: 'Produto atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}
