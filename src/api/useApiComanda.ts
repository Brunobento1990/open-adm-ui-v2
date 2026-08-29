import { ApiMethod, useApi } from '../hook/useApi'
import type {
  Comanda,
  ComandaCreateRequest,
  ComandaHistorico,
  ComandaItem,
  ComandaUpdateRequest,
} from '../types/ComandaTypes'
import { ComandaStatus } from '../types/ComandaTypes'
import { ApiRoutePath, ComandaApiRoutePath } from './apiRoutes'

type ResultadoPadrao = { resultado: boolean }

export function useApiComanda() {
  const apiCriar = useApi({ method: ApiMethod.Post, url: ApiRoutePath.Comanda })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.Comanda,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.Comanda })
  const apiStatus = useApi({ method: ApiMethod.Put, url: ApiRoutePath.Comanda })
  const apiAlternarCompartilhamento = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Comanda}${ComandaApiRoutePath.Compartilhamento}`,
  })
  const apiItens = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Comanda}${ComandaApiRoutePath.Itens}`,
    naoRenderizarResposta: true,
  })
  const apiHistoricos = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Comanda}${ComandaApiRoutePath.Historicos}`,
    naoRenderizarResposta: true,
  })
  const apiAdicionarItem = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Comanda}${ComandaApiRoutePath.Item}`,
  })
  const apiExcluirItem = useApi({
    method: ApiMethod.Delete,
    url: `${ApiRoutePath.Comanda}${ComandaApiRoutePath.Item}`,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Comanda>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: ComandaCreateRequest) => apiCriar.action<ResultadoPadrao>({
        body: values,
        message: 'Comanda criada com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (id: string, values: ComandaUpdateRequest) => apiAtualizar.action<ResultadoPadrao>({
        body: values,
        urlParams: `?id=${encodeURIComponent(id)}`,
        message: 'Comanda atualizada com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
    alterarStatus: {
      fetch: (id: string, status: ComandaStatus) => apiStatus.action<ResultadoPadrao>({
        urlParams: `/status/${encodeURIComponent(id)}/${status}`,
        message: 'Status da comanda atualizado com sucesso',
      }),
      loading: apiStatus.loading,
    },
    alternarCompartilhamento: {
      fetch: (id: string, ativar: boolean) => apiAlternarCompartilhamento.action<string | null>({
        urlParams: `?id=${encodeURIComponent(id)}`,
        message: `Compartilhamento público ${ativar ? 'ativado' : 'desativado'} com sucesso`,
      }),
      loading: apiAlternarCompartilhamento.loading,
    },
    obterItens: {
      fetch: (comandaId: string) => apiItens.action<ComandaItem[]>({
        urlParams: `?id=${encodeURIComponent(comandaId)}`,
      }),
      loading: apiItens.loading,
    },
    obterHistoricos: {
      fetch: (comandaId: string) => apiHistoricos.action<ComandaHistorico[]>({
        urlParams: `?id=${encodeURIComponent(comandaId)}`,
      }),
      loading: apiHistoricos.loading,
    },
    adicionarItem: {
      fetch: (
        comandaId: string,
        item: Pick<ComandaItem, 'produtoId' | 'quantidade' | 'desconto'>,
      ) => apiAdicionarItem.action<ResultadoPadrao>({
        body: item,
        urlParams: `?id=${encodeURIComponent(comandaId)}`,
        message: 'Produto adicionado à comanda com sucesso',
      }),
      loading: apiAdicionarItem.loading,
    },
    excluirItem: {
      fetch: (itemId: string) => apiExcluirItem.action<ResultadoPadrao>({
        urlParams: `?id=${encodeURIComponent(itemId)}`,
        message: 'Produto removido da comanda com sucesso',
      }),
      loading: apiExcluirItem.loading,
    },
  }
}
