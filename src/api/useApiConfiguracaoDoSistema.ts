import { ApiMethod, useApi } from '../hook/useApi'
import type {
  AtualizarConfiguracaoDoSistema,
  ConfiguracaoDoSistema,
} from '../types/ConfiguracaoDoSistemaTypes'
import { ApiRoutePath, ConfiguracaoDoSistemaApiRoutePath } from './apiRoutes'

const configuracaoDoSistemaUrl = (path: ConfiguracaoDoSistemaApiRoutePath) =>
  `${ApiRoutePath.ConfiguracaoDoSistema}${path}`

export function useApiConfiguracaoDoSistema() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: configuracaoDoSistemaUrl(ConfiguracaoDoSistemaApiRoutePath.Obter),
    naoRenderizarErro: true,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: configuracaoDoSistemaUrl(ConfiguracaoDoSistemaApiRoutePath.Atualizar),
  })

  return {
    obter: {
      fetch: () => apiObter.action<ConfiguracaoDoSistema>(),
      loading: apiObter.loading,
    },
    atualizar: {
      fetch: (body: AtualizarConfiguracaoDoSistema) =>
        apiAtualizar.action<ConfiguracaoDoSistema>({
          body,
          message: 'Configuração atualizada com sucesso',
        }),
      loading: apiAtualizar.loading,
    },
  }
}
