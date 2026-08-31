import { ApiMethod, useApi } from '../hook/useApi'
import type {
  ExtratoFinanceiro,
  TransacaoFinanceiraFiltro,
} from '../types/TransacaoFinanceiraTypes'
import { ApiRoutePath, TransacaoFinanceiraApiRoutePath } from './apiRoutes'

export function useApiTransacaoFinanceira() {
  const apiExtrato = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.TransacaoFinanceira}${TransacaoFinanceiraApiRoutePath.Periodo}`,
    naoRenderizarResposta: true,
  })

  return {
    extrato: {
      fetch: (filtro: TransacaoFinanceiraFiltro) => apiExtrato.action<ExtratoFinanceiro>({
        body: filtro,
      }),
      loading: apiExtrato.loading,
    },
  }
}
