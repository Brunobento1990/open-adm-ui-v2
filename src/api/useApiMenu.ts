import { ApiMethod, useApi } from '../hook/useApi'
import type { Menu } from '../types/MenuTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiMenu() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Menu,
    naoRenderizarResposta: true,
    statusInicial: 'loading',
  })

  return {
    obter: {
      fetch: () => apiObter.action<Menu[]>(),
      loading: apiObter.loading,
    },
  }
}
