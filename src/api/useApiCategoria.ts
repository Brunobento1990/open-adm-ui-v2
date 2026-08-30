import { ApiMethod, useApi } from '../hook/useApi'
import type { Categoria, CategoriaPayload } from '../types/CategoriaTypes'
import { ApiRoutePath, CategoriaApiRoutePath } from './apiRoutes'

export function useApiCategoria() {
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Categoria}${CategoriaApiRoutePath.Criar}`,
  })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Categoria}${CategoriaApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Categoria}${CategoriaApiRoutePath.Atualizar}`,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Categoria>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: CategoriaPayload) =>
        apiCriar.action<Categoria>({ body: values, message: 'Categoria criada com sucesso' }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (values: CategoriaPayload) =>
        apiAtualizar.action<Categoria>({
          body: values,
          message: 'Categoria atualizada com sucesso',
        }),
      loading: apiAtualizar.loading,
    },
  }
}
