import axios from 'axios'
import { ApiMethod, useApi } from '../hook/useApi'
import type { ComandaPublica } from '../types/ComandaTypes'
import { ApiRoutePath } from './apiRoutes'

export enum ComandaPublicaRequestStatus {
  Loading = 'loading',
  Success = 'success',
  NotFound = 'not-found',
  Error = 'error',
}

export function useApiComandaPublica() {
  const apiObter = useApi({
    method: ApiMethod.Get,
    url: ApiRoutePath.PublicoComanda,
    naoDeslogarAoReceber401: true,
    naoEnviarToken: true,
    naoRenderizarErro: true,
    naoRenderizarResposta: true,
    statusInicial: 'loading',
  })

  return {
    obter: {
      fetch: (
        idPublico: string | undefined,
        onError: (status: ComandaPublicaRequestStatus) => void,
      ) => {
        if (!idPublico) {
          onError(ComandaPublicaRequestStatus.NotFound)
          return Promise.resolve(undefined)
        }

        return apiObter.action<ComandaPublica>({
          urlParams: `/${encodeURIComponent(idPublico)}`,
          onError: (error) => onError(
            axios.isAxiosError(error) && error.response?.status === 404
              ? ComandaPublicaRequestStatus.NotFound
              : ComandaPublicaRequestStatus.Error,
          ),
        })
      },
      loading: apiObter.loading,
    },
  }
}
