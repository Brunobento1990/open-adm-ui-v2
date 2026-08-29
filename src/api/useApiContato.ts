import { ApiMethod, useApi } from '../hook/useApi'
import type { IContato } from '../types/ContatoTypes'
import { ApiRoutePath } from './apiRoutes'

const contatoQueryParam = 'id'

function getContatoUrlParams(id: string) {
  const queryParams = new URLSearchParams({
    [contatoQueryParam]: id,
  })

  return `?${queryParams.toString()}`
}

export function useApiContato() {
  const apiBuscar = useApi({
    method: ApiMethod.Get,
    url: `${ApiRoutePath.Contato}/obter`,
    naoRenderizarResposta: true,
  })

  const apiCadastrar = useApi({
    method: ApiMethod.Post,
    url: ApiRoutePath.Contato,
  })

  const apiEditar = useApi({
    method: ApiMethod.Put,
    url: ApiRoutePath.Contato,
  })

  async function buscar(id: string) {
    return apiBuscar.action<IContato>({
      urlParams: getContatoUrlParams(id),
    })
  }

  async function salvar(values: IContato, id?: string) {
    if (id) {
      return apiEditar.action<IContato>({
        body: values,
        message: 'Contato salvo com sucesso',
        urlParams: getContatoUrlParams(id),
      })
    }

    return apiCadastrar.action<IContato>({
      body: values,
      message: 'Contato cadastrado com sucesso',
    })
  }

  return {
    obter: {
      fetch: buscar,
      loading: apiBuscar.loading,
    },
    salvar: {
      fetch: salvar,
      loading: apiCadastrar.loading || apiEditar.loading,
    },
  }
}
