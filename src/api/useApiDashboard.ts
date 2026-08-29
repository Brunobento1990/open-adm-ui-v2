import { ApiMethod, useApi } from '../hook/useApi'
import type { Dashboard } from '../types/DashboardTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiDashboard() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Dashboard,
    naoRenderizarResposta: true,
    statusInicial: 'loading',
  })

  return {
    obter: {
      fetch: () => apiObter.action<Dashboard>(),
      loading: apiObter.loading,
    },
  }
}
