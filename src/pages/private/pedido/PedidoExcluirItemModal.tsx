import { useApiPedido } from '../../../api/useApiPedido'
import { ButtonApp, ButtonAppColor, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { TextApp } from '../../../components/TextApp/TextApp'
import type { PedidoItem } from '../../../types/PedidoTypes'

type PedidoExcluirItemModalProps = {
  item?: PedidoItem
  onClose: () => void
  onSuccess: () => void
}

export function PedidoExcluirItemModal({ item, onClose, onSuccess }: PedidoExcluirItemModalProps) {
  const { excluirItem } = useApiPedido()

  async function confirmar() {
    if (!item || !(await excluirItem.fetch(item.id))) return
    onSuccess()
  }

  return (
    <ModalChildren
      close={onClose}
      footerChildren={(
        <>
          <ButtonApp disabled={excluirItem.loading} onClick={onClose} variant={ButtonAppVariant.Outlined}>Cancelar</ButtonApp>
          <ButtonApp color={ButtonAppColor.Error} loading={excluirItem.loading} onClick={confirmar}>Excluir</ButtonApp>
        </>
      )}
      fullWidth
      maxWidth="sm"
      open={item !== undefined}
      titulo="Confirmar exclusão"
    >
      <TextApp>Deseja realmente excluir o item “{item?.produto?.descricao ?? 'selecionado'}”?</TextApp>
    </ModalChildren>
  )
}
