import { ApiMethod, useApi } from '../hook/useApi'
import { useSnackbarApp } from '../components/Snackbar/useSnackbar'
import type { AtualizarPrecoPorPesoPayload } from '../types/PrecoPorPesoTypes'
import type { AtualizarPrecoPorTamanhoPayload } from '../types/PrecoPorTamanhoTypes'
import type {
  SalvarTabelaDePrecoItemPayload,
  TabelaDePrecoItem,
} from '../types/TabelaDePrecoTypes'
import { ApiRoutePath, ItemTabelaDePrecoApiRoutePath } from './apiRoutes'

export function useApiItemTabelaDePreco() {
  const snack = useSnackbarApp()
  const apiCriar = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.ItemTabelaDePreco}${ItemTabelaDePrecoApiRoutePath.Criar}`,
  })
  const apiAtualizar = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.ItemTabelaDePreco}${ItemTabelaDePrecoApiRoutePath.Atualizar}`,
  })
  const apiExcluir = useApi({
    method: ApiMethod.Delete,
    url: `${ApiRoutePath.ItemTabelaDePreco}${ItemTabelaDePrecoApiRoutePath.Excluir}`,
    naoRenderizarResposta: true,
  })
  const apiAtualizarPorPeso = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.ItemTabelaDePreco}${ItemTabelaDePrecoApiRoutePath.AtualizarPorPeso}`,
  })
  const apiAtualizarPorTamanho = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.ItemTabelaDePreco}${ItemTabelaDePrecoApiRoutePath.AtualizarPorTamanho}`,
  })

  return {
    criar: {
      fetch: (body: SalvarTabelaDePrecoItemPayload) =>
        apiCriar.action<TabelaDePrecoItem>({ body, message: 'Item adicionado com sucesso' }),
      loading: apiCriar.loading,
    },
    atualizar: {
      fetch: (body: SalvarTabelaDePrecoItemPayload) =>
        apiAtualizar.action<TabelaDePrecoItem>({ body, message: 'Item atualizado com sucesso' }),
      loading: apiAtualizar.loading,
    },
    excluir: {
      fetch: async (id: string) => {
        const response = await apiExcluir.action<{ resultado: boolean }>({
          urlParams: `?id=${encodeURIComponent(id)}`,
        })
        const resultado = response?.resultado === true
        if (resultado) snack.show('Item excluído com sucesso', 'success')
        return resultado
      },
      loading: apiExcluir.loading,
    },
    atualizarPorTamanho: {
      fetch: (body: AtualizarPrecoPorTamanhoPayload) =>
        apiAtualizarPorTamanho.action<{ resultado: boolean }>({
          body,
          message: 'Preços atualizados com sucesso',
        }),
      loading: apiAtualizarPorTamanho.loading,
    },
    atualizarPorPeso: {
      fetch: (body: AtualizarPrecoPorPesoPayload) =>
        apiAtualizarPorPeso.action<{ resultado: boolean }>({
          body,
          message: 'Preços atualizados com sucesso',
        }),
      loading: apiAtualizarPorPeso.loading,
    },
  }
}
