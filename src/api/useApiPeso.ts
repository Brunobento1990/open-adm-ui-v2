import { ApiMethod, useApi } from '../hook/useApi'
import type { Peso, PesoPayload } from '../types/PesoTypes'
import { ApiRoutePath, PesoApiRoutePath } from './apiRoutes'

export function useApiPeso() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Peso}${PesoApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Peso}${PesoApiRoutePath.Criar}`,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Peso}${PesoApiRoutePath.Atualizar}`,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Peso>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: PesoPayload) => apiCriar.action<Peso>({
        body: values,
        message: 'Peso criado com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (values: PesoPayload) => apiAtualizar.action<Peso>({
        body: values,
        message: 'Peso atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}
