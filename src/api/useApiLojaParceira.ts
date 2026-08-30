import { ApiMethod, useApi } from '../hook/useApi'
import type {
  LojaParceira,
  LojaParceiraPayload,
} from '../types/LojaParceiraTypes'
import { ApiRoutePath, LojaParceiraApiRoutePath } from './apiRoutes'

export function useApiLojaParceira() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.LojaParceira}${LojaParceiraApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.LojaParceira}${LojaParceiraApiRoutePath.Criar}`,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.LojaParceira}${LojaParceiraApiRoutePath.Atualizar}`,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<LojaParceira>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: LojaParceiraPayload) => apiCriar.action<LojaParceira>({
        body: values,
        message: 'Loja parceira criada com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (values: LojaParceiraPayload) => apiAtualizar.action<LojaParceira>({
        body: values,
        message: 'Loja parceira atualizada com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}
