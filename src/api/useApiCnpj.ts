import { ApiMethod, useApi } from '../hook/useApi'
import type { ConsultaCnpj } from '../types/ClienteVendaTypes'
import { ApiRoutePath, CnpjApiRoutePath } from './apiRoutes'

export function useApiCnpj() {
  const api = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Cnpj}${CnpjApiRoutePath.Consultar}`,
    naoRenderizarResposta: true,
  })

  return {
    consultar: {
      fetch: (cnpj: string) => api.action<ConsultaCnpj>({
        urlParams: `?cnpj=${encodeURIComponent(cnpj)}`,
      }),
      loading: api.loading,
    },
  }
}
