import { ApiMethod, useApi } from '../hook/useApi'
import type { Mensalidade } from '../types/MensalidadeTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiMensalidade() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Mensalidade,
    naoRenderizarResposta: true,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Mensalidade>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
  }
}
