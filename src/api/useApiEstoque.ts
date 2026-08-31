import { ApiMethod, useApi } from '../hook/useApi'
import type {
  AtualizarEstoquesPayload,
  Estoque,
  EstoquesDoProduto,
} from '../types/EstoqueTypes'
import { ApiRoutePath, EstoquesApiRoutePath } from './apiRoutes'

export function useApiEstoque() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Estoque}${EstoquesApiRoutePath.Obter}`,
    naoRenderizarResposta: true,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Estoque}${EstoquesApiRoutePath.Atualizar}`,
  })
  const apiObterTodosDoProduto = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Estoque}${EstoquesApiRoutePath.ObterTodosDoProduto}`,
    naoRenderizarResposta: true,
  })
  const apiAtualizarTodos = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Estoque}${EstoquesApiRoutePath.AtualizarTodos}`,
  })
  return {
    obter: {
      fetch: (id: string) => apiObter.action<Estoque>({
        urlParams: `?id=${encodeURIComponent(id)}`,
      }),
      loading: apiObter.loading,
    },
    atualizar: {
      fetch: (values: Partial<Estoque>) => apiAtualizar.action({
        body: values,
        message: 'Estoque atualizado com sucesso',
      }),
      loading: apiAtualizar.loading,
    },
    obterTodosDoProduto: {
      fetch: (produtoId: string) => apiObterTodosDoProduto.action<EstoquesDoProduto>({
        urlParams: `?produtoId=${encodeURIComponent(produtoId)}`,
      }),
      loading: apiObterTodosDoProduto.loading,
    },
    atualizarTodos: {
      fetch: (values: AtualizarEstoquesPayload) => apiAtualizarTodos.action({
        body: values,
        message: 'Estoques atualizados com sucesso',
      }),
      loading: apiAtualizarTodos.loading,
    },
  }
}
