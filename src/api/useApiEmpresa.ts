import { ApiMethod, useApi } from '../hook/useApi'
import type { Empresa } from '../types/EmpresaTypes'
import { ApiRoutePath } from './apiRoutes'

type ResultadoPadrao = {
  resultado: boolean
}

export function useApiEmpresa() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Empresa,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.Empresa })

  return {
    obter: {
      fetch: () => apiObter.action<Empresa>(),
      loading: apiObter.loading,
    },
    atualizar: {
      fetch: (values: Partial<Empresa>) => apiAtualizar.action<ResultadoPadrao>({
        body: values,
        message: 'Empresa atualizada com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}
