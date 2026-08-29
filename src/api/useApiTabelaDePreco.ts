import { ApiMethod, useApi } from '../hook/useApi'
import type {
  TabelaDePreco,
} from '../types/TabelaDePrecoTypes'
import { ApiRoutePath, TabelaDePrecoApiRoutePath } from './apiRoutes'

type TabelaDePrecoPrecoResponse = number | { preco: number }

export function useApiTabelaDePreco() {
  const apiCriar = useApi({ method: ApiMethod.Post, url: ApiRoutePath.TabelaDePreco })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.TabelaDePreco,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({ method: ApiMethod.Put, url: ApiRoutePath.TabelaDePreco })
  const apiObterPreco = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.TabelaDePreco}${TabelaDePrecoApiRoutePath.Item}`,
    naoRenderizarResposta: true,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<TabelaDePreco>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: Partial<TabelaDePreco>) => apiCriar.action<TabelaDePreco>({
        body: values,
        message: 'Tabela de preço criada com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (id: string, values: Partial<TabelaDePreco>) =>
        apiAtualizar.action<TabelaDePreco>({
          body: values,
          urlParams: `?id=${encodeURIComponent(id)}`,
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
