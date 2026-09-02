import { ApiMethod, useApi } from '../hook/useApi'
import type {
  FaturaBaixaAutomaticaPayload,
  FaturaCriarPayload,
  ResultadoPadrao,
} from '../types/FaturaTypes'
import { ApiRoutePath, FaturaApiRoutePath } from './apiRoutes'

export function useApiFatura() {
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Fatura}${FaturaApiRoutePath.Criar}`,
  })
  const apiBaixaAutomatica = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Fatura}${FaturaApiRoutePath.BaixaAutomatica}`,
  })
  const apiBonificar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Fatura}${FaturaApiRoutePath.Bonificar}`,
  })

  return {
    criar: {
      fetch: (body: FaturaCriarPayload) =>
        apiCriar.action({
          body,
          message: 'Fatura criada com sucesso',
        }),
      loading: apiCriar.loading,
    },
    baixarAutomaticamente: {
      fetch: (body: FaturaBaixaAutomaticaPayload) =>
        apiBaixaAutomatica.action<ResultadoPadrao>({
          body,
          message: 'Fatura baixada com sucesso',
        }),
      loading: apiBaixaAutomatica.loading,
    },
    bonificar: {
      fetch: (pedidoId: string) =>
        apiBonificar.action<ResultadoPadrao>({
          body: { pedidoId },
          message: 'Pedido bonificado com sucesso',
        }),
      loading: apiBonificar.loading,
    },
  }
}
