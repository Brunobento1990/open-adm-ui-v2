import { ApiMethod, useApi } from '../hook/useApi'
import type { AtendimentoNumeroForm } from '../types/AtendimentoNumeroTypes'
import { ApiRoutePath } from './apiRoutes'

export function useApiAtendimentoNumero() {
  const apiBuscar = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.AtendimentoNumero,
    naoRenderizarResposta: true,
  })

  const apiSalvar = useApi({
    method: ApiMethod.Put,
    url: ApiRoutePath.AtendimentoNumero,
  })

  async function buscar() {
    return apiBuscar.action<AtendimentoNumeroForm>()
  }

  async function salvar(values: AtendimentoNumeroForm) {
    return apiSalvar.action<AtendimentoNumeroForm>({
      body: values,
      message: 'Telefone registrado com sucesso'
    })
  }

  return {
    obter: {
      fetch: buscar,
      loading: apiBuscar.loading
    },
    salvar: {
      fetch: salvar,
      loading: apiSalvar.loading
    },
  }
}
