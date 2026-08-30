import { ApiMethod, useApi } from '../hook/useApi'
import type { MovimentoProdutoFormValues } from '../types/EstoqueTypes'
import { ApiRoutePath, EstoquesApiRoutePath } from './apiRoutes'

export function useApiMovimentoProduto() {
  const apiMovimentar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Estoque}${EstoquesApiRoutePath.Movimentar}`,
  })

  return {
    movimentar: {
      fetch: (values: Partial<MovimentoProdutoFormValues>) => apiMovimentar.action({
        body: values,
        message: 'Movimentação concluída com sucesso',
      }),
      loading: apiMovimentar.loading,
    },
  }
}
