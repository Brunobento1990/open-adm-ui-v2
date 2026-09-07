import { ApiMethod, useApi } from '../hook/useApi'
import type {
  LinkBioConfiguracao,
  LinkBioConfiguracaoPayload,
  LinkBioEventosFiltro,
  LinkBioIndicadores,
  LinkBioItem,
  LinkBioItemCreatePayload,
  LinkBioItemUpdatePayload,
} from '../types/LinkBioTypes'
import { ApiRoutePath, LinkBioApiRoutePath } from './apiRoutes'

const linkBioUrl = (path: LinkBioApiRoutePath) => `${ApiRoutePath.LinkBio}${path}`

function useSuccessAction(method: ApiMethod, url: string) {
  const api = useApi({ method, url })
  return {
    action: async (options?: Parameters<typeof api.action>[0]) => {
      let success = false
      await api.action({
        ...options,
        onSuccess: () => {
          success = true
        },
      })
      return success
    },
    loading: api.loading,
  }
}

export function useApiLinkBio() {
  const obterConfiguracaoApi = useApi({
    method: ApiMethod.Get,
    url: linkBioUrl(LinkBioApiRoutePath.Configuracao),
    naoRenderizarResposta: true,
    statusInicial: 'loading',
  })
  const salvarConfiguracaoApi = useApi({
    method: ApiMethod.Post,
    url: linkBioUrl(LinkBioApiRoutePath.CriarOuAtualizarConfiguracao),
  })

  const criarLinkApi = useApi({
    method: ApiMethod.Post,
    url: linkBioUrl(LinkBioApiRoutePath.Links),
  })
  const editarLinkApi = useApi({
    method: ApiMethod.Put,
    url: linkBioUrl(LinkBioApiRoutePath.Links),
  })
  const excluirLinkApi = useSuccessAction(ApiMethod.Delete, linkBioUrl(LinkBioApiRoutePath.Links))
  const alterarStatusApi = useSuccessAction(ApiMethod.Put, linkBioUrl(LinkBioApiRoutePath.Links))
  const alterarOrdemApi = useSuccessAction(ApiMethod.Put, linkBioUrl(LinkBioApiRoutePath.Ordem))
  const eventosApi = useApi({
    method: ApiMethod.Post,
    url: linkBioUrl(LinkBioApiRoutePath.Eventos),
    naoRenderizarResposta: true,
  })

  return {
    obterConfiguracao: {
      fetch: () => obterConfiguracaoApi.action<LinkBioConfiguracao | null>(),
      loading: obterConfiguracaoApi.loading,
    },
    salvarConfiguracao: {
      fetch: (body: LinkBioConfiguracaoPayload) =>
        salvarConfiguracaoApi.action<LinkBioConfiguracao>({
          body,
          message: 'Configuração salva com sucesso',
        }),
      loading: salvarConfiguracaoApi.loading,
    },

    criarLink: {
      fetch: (body: LinkBioItemCreatePayload) =>
        criarLinkApi.action<LinkBioItem>({ body, message: 'Link adicionado com sucesso' }),
      loading: criarLinkApi.loading,
    },
    editarLink: {
      fetch: (body: LinkBioItemUpdatePayload) =>
        editarLinkApi.action<LinkBioItem>({ body, message: 'Link atualizado com sucesso' }),
      loading: editarLinkApi.loading,
    },
    excluirLink: {
      fetch: (id: string) =>
        excluirLinkApi.action({
          urlParams: `/${encodeURIComponent(id)}`,
          message: 'Link excluído com sucesso',
        }),
      loading: excluirLinkApi.loading,
    },
    alterarStatus: {
      fetch: (id: string, ativo: boolean) =>
        alterarStatusApi.action({
          urlParams: `/${encodeURIComponent(id)}/status/${ativo}`,
          message: `Link ${ativo ? 'ativado' : 'desativado'} com sucesso`,
        }),
      loading: alterarStatusApi.loading,
    },
    alterarOrdem: {
      fetch: (id: string, ordem: number) =>
        alterarOrdemApi.action({ body: { id, ordem }, message: 'Ordem atualizada com sucesso' }),
      loading: alterarOrdemApi.loading,
    },
    eventos: {
      fetch: (body: LinkBioEventosFiltro) => eventosApi.action<LinkBioIndicadores>({ body }),
      loading: eventosApi.loading,
    },
  }
}
