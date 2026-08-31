import { ApiMethod, useApi } from '../hook/useApi'
import type { FaturaCriarPayload } from '../types/FaturaTypes'
import { ApiRoutePath, FaturaApiRoutePath } from './apiRoutes'

export function useApiFatura() {
  const api = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Fatura}${FaturaApiRoutePath.Criar}`,
  })

  return {
    criar: {
      fetch: (body: FaturaCriarPayload) =>
        api.action({
          body,
          message: 'Fatura criada com sucesso',
        }),
      loading: api.loading,
    },
  }
}
