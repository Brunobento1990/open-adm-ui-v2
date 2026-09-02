import { ApiMethod, useApi } from '../hook/useApi'
import type { EnderecoParceiro } from '../types/ParceiroTypes'
import { ApiRoutePath, CepApiRoutePath } from './apiRoutes'

export function useApiCep() {
  const api = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Cep}${CepApiRoutePath.Consultar}`,
    naoRenderizarResposta: true,
  })

  return {
    consultar: {
      fetch: (cep: string) => api.action<EnderecoParceiro>({
        urlParams: `?cep=${encodeURIComponent(cep)}`,
      }),
      loading: api.loading,
    },
  }
}
