import { ApiMethod, useApi } from '../hook/useApi'
import type {
  RelatorioVendaProdutoFormValues,
  RelatorioVendaProdutoPayload,
  RelatorioVendaProdutoResponse,
} from '../types/RelatorioVendaProdutoTypes'
import { ApiRoutePath, RelatorioVendaProdutoApiRoutePath } from './apiRoutes'

export function criarRelatorioVendaProdutoPayload(
  values: RelatorioVendaProdutoFormValues,
): RelatorioVendaProdutoPayload {
  return {
    ...values,
    dataFinal: values.dataFinal || null,
    dataInicial: values.dataInicial || null,
  }
}

export function useApiRelatorioVendaProduto() {
  const apiListar = useApi({
    method: ApiMethod.Post,
    url: ApiRoutePath.RelatorioVendaProduto,
    naoRenderizarResposta: true,
  })
  const apiImprimir = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.RelatorioVendaProduto}${RelatorioVendaProdutoApiRoutePath.Imprimir}`,
    naoRenderizarResposta: true,
  })

  return {
    listar: {
      fetch: (values: RelatorioVendaProdutoFormValues) =>
        apiListar.action<RelatorioVendaProdutoResponse>({
          body: criarRelatorioVendaProdutoPayload(values),
        }),
      loading: apiListar.loading,
    },
    imprimir: {
      fetch: (values: RelatorioVendaProdutoFormValues) =>
        apiImprimir.action<Blob>({
          body: criarRelatorioVendaProdutoPayload(values),
          responseType: 'blob',
        }),
      loading: apiImprimir.loading,
    },
  }
}
