import type { PagarParcelaPayload, Parcela } from '../types/FaturaTypes'
import { ApiMethod, useApi } from '../hook/useApi'
import { ApiRoutePath, ParcelaApiRoutePath } from './apiRoutes'

export function useApiParcela() {
  const obterApi = useApi({ method: ApiMethod.Get, naoRenderizarResposta: true, url: `${ApiRoutePath.Parcela}${ParcelaApiRoutePath.Obter}` })
  const pagarApi = useApi({ method: ApiMethod.Put, url: `${ApiRoutePath.Parcela}${ParcelaApiRoutePath.Pagar}` })

  return {
    obter: {
      fetch: (id: string) => obterApi.action<Parcela>({ urlParams: `?id=${encodeURIComponent(id)}` }),
      loading: obterApi.loading,
    },
    pagar: {
      fetch: (payload: PagarParcelaPayload) => pagarApi.action<Parcela>({ body: payload, message: 'Parcela paga com sucesso' }),
      loading: pagarApi.loading,
    },
  }
}
