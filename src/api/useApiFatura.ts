import { ApiMethod, useApi } from '../hook/useApi'
import type {
  FaturaBaixaAutomaticaPayload,
  FaturaCriarPayload,
  FaturaNegociarPayload,
  FaturaRenegociarPayload,
  FaturaSugestaoParcelamento,
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
  const apiNegociar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Fatura}${FaturaApiRoutePath.Negociar}`,
  })
  const apiSugerirParcelamento = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Fatura}${FaturaApiRoutePath.SugerirParcelamento}`,
  })
  const apiRenegociar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Fatura}${FaturaApiRoutePath.Renegociar}`,
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
    negociar: {
      fetch: (body: FaturaNegociarPayload) =>
        apiNegociar.action<ResultadoPadrao>({
          body,
          message: 'Cobrança parcelada com sucesso',
        }),
      loading: apiNegociar.loading,
    },
    sugerirParcelamento: {
      fetch: (faturaId: string) => apiSugerirParcelamento.action<FaturaSugestaoParcelamento>({
        urlParams: `?faturaId=${encodeURIComponent(faturaId)}`,
      }),
      loading: apiSugerirParcelamento.loading,
    },
    renegociar: {
      fetch: (body: FaturaRenegociarPayload) => apiRenegociar.action<ResultadoPadrao>({
        body,
        message: 'Fatura renegociada com sucesso',
      }),
      loading: apiRenegociar.loading,
    },
  }
}
