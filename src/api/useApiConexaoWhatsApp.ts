import { ApiMethod, useApi } from '../hook/useApi'
import type { ConexaoWhatsAppResponse } from '../types/ConexaoWhatsAppTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiConexaoWhatsApp() {
  const apiBuscar = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.ConexaoWhatsApp,
    naoRenderizarResposta: true,
  })

  async function buscar() {
    return apiBuscar.action<ConexaoWhatsAppResponse>()
  }

  return {
    obter: {
      fetch: buscar,
      loading: apiBuscar.loading,
    },
  }
}
