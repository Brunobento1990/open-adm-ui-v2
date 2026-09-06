import { ApiMethod, useApi } from '../hook/useApi'
import type {
  AtualizarTabelaDePrecoPayload,
  CriarTabelaDePrecoPayload,
  TabelaDePreco,
  TabelaDePrecoItemPedido,
} from '../types/TabelaDePrecoTypes'
import { ApiRoutePath, TabelaDePrecoApiRoutePath } from './apiRoutes'

type TabelaDePrecoPrecoResponse = number | { preco: number }

export function useApiTabelaDePreco() {
  const apiListarItens = useApi({
    method: ApiMethod.Get,
    url: '/item-tabela-de-preco/obter-itens',
    naoRenderizarResposta: true,
  })
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.TabelaDePreco}${TabelaDePrecoApiRoutePath.Criar}`,
  })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.TabelaDePreco}${TabelaDePrecoApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.TabelaDePreco}${TabelaDePrecoApiRoutePath.Atualizar}`,
  })
  const apiObterPreco = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.TabelaDePreco}${TabelaDePrecoApiRoutePath.Item}`,
    naoRenderizarResposta: true,
  })
  const apiObterAtiva = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.TabelaDePreco}${TabelaDePrecoApiRoutePath.ObterAtiva}`,
    naoRenderizarResposta: true,
  })

  return {
    obterAtiva: {
      fetch: () => apiObterAtiva.action<TabelaDePreco>(),
      loading: apiObterAtiva.loading,
    },
    listarItens: {
      fetch: (tabelaDePrecoId: string) =>
        apiListarItens.action<TabelaDePrecoItemPedido[]>({
          urlParams: `?tabelaDePrecoId=${encodeURIComponent(tabelaDePrecoId)}`,
        }),
      loading: apiListarItens.loading,
    },
    obter: {
      fetch: (id: string) =>
        apiObter.action<TabelaDePreco>({
          urlParams: `?id=${encodeURIComponent(id)}`,
        }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: CriarTabelaDePrecoPayload) =>
        apiCriar.action<TabelaDePreco>({
          body: values,
          message: 'Tabela de preço criada com sucesso',
        }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (values: AtualizarTabelaDePrecoPayload) =>
        apiAtualizar.action<TabelaDePreco>({
          body: values,
          message: 'Tabela de preço atualizada com sucesso',
        }),
      loading: apiAtualizar.loading,
    },
    obterPreco: {
      fetch: async (tabelaDePrecoId: string, produtoId: string) => {
        const response = await apiObterPreco.action<TabelaDePrecoPrecoResponse>({
          urlParams: `?tabelaDePrecoId=${encodeURIComponent(tabelaDePrecoId)}&produtoId=${encodeURIComponent(produtoId)}`,
        })

        return typeof response === 'number' ? response : response?.preco
      },
      loading: apiObterPreco.loading,
    },
  }
}
