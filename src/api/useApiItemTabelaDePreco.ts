import { ApiMethod, useApi } from '../hook/useApi'
import type { AtualizarPrecoPorPesoPayload } from '../types/PrecoPorPesoTypes'
import type { AtualizarPrecoPorTamanhoPayload } from '../types/PrecoPorTamanhoTypes'
import { ApiRoutePath, ItemTabelaDePrecoApiRoutePath } from './apiRoutes'

export function useApiItemTabelaDePreco() {
  const apiAtualizarPorPeso = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.ItemTabelaDePreco}${ItemTabelaDePrecoApiRoutePath.AtualizarPorPeso}`,
  })
  const apiAtualizarPorTamanho = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.ItemTabelaDePreco}${ItemTabelaDePrecoApiRoutePath.AtualizarPorTamanho}`,
  })

  return {
    atualizarPorTamanho: {
      fetch: (body: AtualizarPrecoPorTamanhoPayload) => apiAtualizarPorTamanho.action<{ resultado: boolean }>({
        body,
        message: 'Preços atualizados com sucesso',
      }),
      loading: apiAtualizarPorTamanho.loading,
    },
    atualizarPorPeso: {
      fetch: (body: AtualizarPrecoPorPesoPayload) => apiAtualizarPorPeso.action<{ resultado: boolean }>({
        body,
        message: 'Preços atualizados com sucesso',
      }),
      loading: apiAtualizarPorPeso.loading,
    },
  }
}
