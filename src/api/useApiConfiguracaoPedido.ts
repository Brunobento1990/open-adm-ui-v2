import { ApiMethod, useApi } from '../hook/useApi'
import type {
  AtualizarConfiguracaoPedido,
  ConfiguracaoPedido,
} from '../types/ConfiguracaoPedidoTypes'
import { ApiRoutePath, ConfiguracaoPedidoApiRoutePath } from './apiRoutes'

const configuracaoPedidoUrl = (path: ConfiguracaoPedidoApiRoutePath) =>
  `${ApiRoutePath.ConfiguracaoPedido}${path}`

export function useApiConfiguracaoPedido() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: configuracaoPedidoUrl(ConfiguracaoPedidoApiRoutePath.Obter),
    naoRenderizarErro: true,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: configuracaoPedidoUrl(ConfiguracaoPedidoApiRoutePath.Atualizar),
  })

  return {
    obter: {
      fetch: () => apiObter.action<ConfiguracaoPedido>(),
      loading: apiObter.loading,
    },
    atualizar: {
      fetch: (body: AtualizarConfiguracaoPedido) =>
        apiAtualizar.action<ConfiguracaoPedido>({
          body,
          message: 'Configuração atualizada com sucesso',
        }),
      loading: apiAtualizar.loading,
    },
  }
}
