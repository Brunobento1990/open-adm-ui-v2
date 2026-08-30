import { ApiMethod, useApi } from '../hook/useApi'
import type { Banner, BannerPayload } from '../types/BannerTypes'
import { ApiRoutePath, BannerApiRoutePath } from './apiRoutes'

export function useApiBanner() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Banner}${BannerApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Banner}${BannerApiRoutePath.Criar}`,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Banner}${BannerApiRoutePath.Atualizar}`,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Banner>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: BannerPayload) => apiCriar.action<Banner>({
        body: values,
        message: 'Banner criado com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (values: BannerPayload) => apiAtualizar.action<Banner>({
        body: values,
        message: 'Banner atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
  }
}
