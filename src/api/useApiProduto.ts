import { ApiMethod, useApi } from '../hook/useApi'
import type { Produto, ProdutoPayload, ProdutoTabelaDePreco } from '../types/ProdutoTypes'
import {
  ApiRoutePath,
  ProdutoApiRoutePath,
  TabelaDePrecoLegacyApiRoutePath,
} from './apiRoutes'

export function useApiProduto() {
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Produto}${ProdutoApiRoutePath.Criar}`,
  })
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Produto}${ProdutoApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Produto}${ProdutoApiRoutePath.Atualizar}`,
  })
  const apiObterTabelaDePreco = useApi({
    method: ApiMethod.Get,
    url: `/tabelas-de-precos${TabelaDePrecoLegacyApiRoutePath.ObterAtivaPorProduto}`,
    naoRenderizarResposta: true,
  })

  return {
    obter: {
      fetch: (id: string) => apiObter.action<Produto>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    criar: {
      fetch: (values: ProdutoPayload) => apiCriar.action<Produto>({
        body: values,
        message: 'Produto criado com sucesso',
      }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (values: ProdutoPayload) => apiAtualizar.action<Produto>({
        body: values,
        message: 'Produto atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
    obterTabelaDePreco: {
      fetch: (produtoId?: string) => apiObterTabelaDePreco.action<ProdutoTabelaDePreco>({
        urlParams: produtoId ? `?produtoId=${encodeURIComponent(produtoId)}` : undefined,
      }),
      loading: apiObterTabelaDePreco.loading,
    },
  }
}
