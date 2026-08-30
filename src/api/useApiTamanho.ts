import { ApiMethod, useApi } from '../hook/useApi'
import type { Tamanho, TamanhoPayload } from '../types/TamanhoTypes'
import { ApiRoutePath, TamanhoApiRoutePath } from './apiRoutes'

export function useApiTamanho() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Tamanho}${TamanhoApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Tamanho}${TamanhoApiRoutePath.Criar}`,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Tamanho}${TamanhoApiRoutePath.Atualizar}`,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Tamanho>({ urlParams: `?id=${encodeURIComponent(id)}` }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: TamanhoPayload) => apiCriar.action<Tamanho>({
        body: values,
        message: 'Tamanho criado com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (values: TamanhoPayload) => apiAtualizar.action<Tamanho>({
        body: values,
        message: 'Tamanho atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}
