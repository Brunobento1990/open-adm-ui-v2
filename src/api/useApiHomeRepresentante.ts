import { ApiMethod, useApi } from '../hook/useApi'
import type { HomeRepresentante } from '../types/DashboardTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiHomeRepresentante() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.HomeRepresentante,
    naoRenderizarResposta: true,
    statusInicial: 'loading',
  })

  return {
    obter: {
      fetch: () => apiObter.action<HomeRepresentante>(),
      loading: apiObter.loading,
    },
  }
}
