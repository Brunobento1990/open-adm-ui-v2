import { ApiMethod, useApi } from '../hook/useApi'
import type {
  CriarRepresentanteRequest,
  EditarRepresentanteRequest,
  Representante,
} from '../types/RepresentanteTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiRepresentante() {
  const apiCriar = useApi({ method: ApiMethod.Post, url: ApiRoutePath.Representante })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Representante,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.Representante })

  return {
    obter: {
      fetch: (id: string) =>
        apiObter.action<Representante>({
          urlParams: `/${encodeURIComponent(id)}`,
        }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: CriarRepresentanteRequest) =>
        apiCriar.action<Representante>({
          body: values,
          message: 'Representante criado com sucesso',
        }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (values: EditarRepresentanteRequest) =>
        apiAtualizar.action<Representante>({
          body: values,
          message: 'Representante atualizado com sucesso',
        }),
      loading: apiAtualizar.loading,
    },
  }
}
