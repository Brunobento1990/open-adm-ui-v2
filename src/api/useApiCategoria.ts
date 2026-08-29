import { ApiMethod, useApi } from '../hook/useApi'
import type {
  Categoria,
} from '../types/CategoriaTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiCategoria() {
  const apiCriar = useApi({ method: ApiMethod.Post, url: ApiRoutePath.Categoria })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Categoria,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.Categoria })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Categoria>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: Partial<Categoria>) =>
        apiCriar.action<Categoria>({ body: values, message: 'Categoria criada com sucesso' }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (id: string, values: Partial<Categoria>) =>
        apiAtualizar.action<Categoria>({
          body: values,
          urlParams: `?id=${encodeURIComponent(id)}`,
          message: 'Categoria atualizada com sucesso',
        }),
      loading: apiAtualizar.loading,
    },
  }
}
