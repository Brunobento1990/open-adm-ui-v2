import { ApiMethod, useApi } from '../hook/useApi'
import type { Parceiro } from '../types/ParceiroTypes'
import { ApiRoutePath, ParceiroApiRoutePath } from './apiRoutes'

const parceiroUrl = (path: ParceiroApiRoutePath) => `${ApiRoutePath.Parceiro}${path}`

export function useApiParceiro() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: parceiroUrl(ParceiroApiRoutePath.Obter),
    naoRenderizarResposta: true,
  })
  const apiEditar = useApi({ method: ApiMethod.Put, url: parceiroUrl(ParceiroApiRoutePath.Editar) })
  const apiExcluirRedeSocial = useApi({ method: ApiMethod.Delete, url: parceiroUrl(ParceiroApiRoutePath.RedeSocial) })
  const apiExcluirTelefone = useApi({ method: ApiMethod.Delete, url: parceiroUrl(ParceiroApiRoutePath.Telefone) })

  return {
    obter: {
      fetch: () => apiObter.action<Parceiro>(),
      loading: apiObter.loading,
    },
    editar: {
      fetch: (body: Partial<Parceiro>) => apiEditar.action<Parceiro>({ body }),
      loading: apiEditar.loading,
    },
    excluirRedeSocial: {
      fetch: async (redeSocialId: string) => {
        let sucesso = false
        await apiExcluirRedeSocial.action({
          urlParams: `?redeSocialId=${encodeURIComponent(redeSocialId)}`,
          onSuccess: () => { sucesso = true },
        })
        return sucesso
      },
      loading: apiExcluirRedeSocial.loading,
    },
    excluirTelefone: {
      fetch: async (telefoneId: string) => {
        let sucesso = false
        await apiExcluirTelefone.action({
          urlParams: `?telefoneId=${encodeURIComponent(telefoneId)}`,
          onSuccess: () => { sucesso = true },
        })
        return sucesso
      },
      loading: apiExcluirTelefone.loading,
    },
  }
}
