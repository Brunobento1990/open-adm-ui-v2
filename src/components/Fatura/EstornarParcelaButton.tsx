import { createContext, useContext, useState, type ReactNode } from 'react'
import { ApiRoutePath, ParcelaApiRoutePath } from '../../api/apiRoutes'
import { ApiMethod, useApi } from '../../hook/useApi'
import { ButtonApp, ButtonAppVariant } from '../ButtonApp/ButtonApp'
import { IconApp } from '../Icon/IconApp'
import { IconButtonComTolltip } from '../IconButtonComTolltip/IconButtonComTolltip'
import { ModalChildren } from '../Modal/ModalChildren'
import { TextApp } from '../TextApp/TextApp'

type EstornarParcelaButtonProps = {
  parcelaId: string
}

const EstornarParcelaIcon = 'mage:reload-reverse'
const EstornoParcelaContext = createContext<() => void>(() => undefined)

type EstornoParcelaProviderProps = {
  children: ReactNode
  onEstornada: () => void
}

export function EstornoParcelaProvider({
  children,
  onEstornada,
}: EstornoParcelaProviderProps) {
  return (
    <EstornoParcelaContext.Provider value={onEstornada}>
      {children}
    </EstornoParcelaContext.Provider>
  )
}

export function EstornarParcelaButton({ parcelaId }: EstornarParcelaButtonProps) {
  const [modalAberto, setModalAberto] = useState(false)
  const onEstornada = useContext(EstornoParcelaContext)
  const estornarApi = useApi({
    method: ApiMethod.Put,
    url: `${ApiRoutePath.Parcela}${ParcelaApiRoutePath.Estornar}`,
  })

  async function confirmar() {
    const response = await estornarApi.action({
      message: 'Pagamentos estornados com sucesso',
      urlParams: `?parcelaId=${encodeURIComponent(parcelaId)}`,
    })

    if (response === undefined) return
    setModalAberto(false)
    onEstornada()
  }

  return (
    <>
      <IconButtonComTolltip
        aria-label="estornar pagamentos da parcela"
        onClick={(event) => {
          event.stopPropagation()
          setModalAberto(true)
        }}
        tooltip="Estornar"
      >
        <IconApp icon={EstornarParcelaIcon} />
      </IconButtonComTolltip>

      <ModalChildren
        close={() => setModalAberto(false)}
        footerChildren={(
          <>
            <ButtonApp
              disabled={estornarApi.loading}
              onClick={() => setModalAberto(false)}
              variant={ButtonAppVariant.Outlined}
            >
              Cancelar
            </ButtonApp>
            <ButtonApp loading={estornarApi.loading} onClick={confirmar}>
              Confirmar
            </ButtonApp>
          </>
        )}
        fullWidth
        maxWidth="sm"
        open={modalAberto}
        titulo="Estornar pagamentos"
      >
        <TextApp>
          Confirma o estorno de todos os pagamentos desta parcela?
        </TextApp>
      </ModalChildren>
    </>
  )
}
