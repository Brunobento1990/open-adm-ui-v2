import { useState } from 'react'
import {
  ButtonApp,
  ButtonAppColor,
  ButtonAppVariant,
} from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { TextApp } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'

type ExcluirPedidoButtonProps = {
  loading?: boolean
  numero: number
  onConfirmar: () => Promise<boolean>
}

export function ExcluirPedidoButton({ loading, numero, onConfirmar }: ExcluirPedidoButtonProps) {
  const [modalAberto, setModalAberto] = useState(false)
  const { cores } = useThemeApp()

  async function confirmar() {
    if (await onConfirmar()) setModalAberto(false)
  }

  return (
    <>
      <IconButtonComTolltip
        aria-label={`Excluir pedido ${numero}`}
        disabled={loading}
        onClick={(event) => {
          event.stopPropagation()
          setModalAberto(true)
        }}
        tooltip="Excluir pedido"
      >
        <IconApp color={cores.error} icon="solar:trash-bin-trash-linear" />
      </IconButtonComTolltip>
      <ModalChildren
        close={() => setModalAberto(false)}
        footerChildren={
          <>
            <ButtonApp
              disabled={loading}
              onClick={() => setModalAberto(false)}
              variant={ButtonAppVariant.Outlined}
            >
              Cancelar
            </ButtonApp>
            <ButtonApp color={ButtonAppColor.Error} loading={loading} onClick={confirmar}>
              Excluir
            </ButtonApp>
          </>
        }
        fullWidth
        maxWidth="sm"
        open={modalAberto}
        titulo="Confirmar exclusão"
      >
        <TextApp>Deseja realmente excluir o pedido #{numero}?</TextApp>
      </ModalChildren>
    </>
  )
}
