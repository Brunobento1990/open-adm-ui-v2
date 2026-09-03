import { ApiMethod, useApi } from '../hook/useApi'
import type { ConfiguracaoMercadoPago } from '../types/ConfiguracaoMercadoPagoTypes'
import { ApiRoutePath, ConfiguracaoMercadoPagoApiRoutePath } from './apiRoutes'

export function useApiConfiguracaoMercadoPago() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.ConfiguracaoMercadoPago}${ConfiguracaoMercadoPagoApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.ConfiguracaoMercadoPago}${ConfiguracaoMercadoPagoApiRoutePath.Atualizar}`,
  })

  return {
    obter: {
      fetch: () => apiObter.action<ConfiguracaoMercadoPago>(),
      loading: apiObter.loading,
    },
    atualizar: {
      fetch: (body: ConfiguracaoMercadoPago) =>
        apiAtualizar.action<ConfiguracaoMercadoPago>({
          body,
          message: 'Configuração do Mercado Pago atualizada com sucesso',
        }),
      loading: apiAtualizar.loading,
    },
  }
}
