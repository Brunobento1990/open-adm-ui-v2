import { useEffect } from 'react'
import { useApiPedido } from '../../../api/useApiPedido'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PedidoItemFormField, type PedidoItem } from '../../../types/PedidoTypes'

type PedidoEditarItemModalProps = {
  item?: PedidoItem
  onClose: () => void
  onSuccess: () => void
}

export function PedidoEditarItemModal({ item, onClose, onSuccess }: PedidoEditarItemModalProps) {
  const { editarItem } = useApiPedido()
  const form = useFormikAdapter({
    initialValues: {
      quantidade: '' as number | '',
    },
    validationSchema: new YupAdapter()
      .number(PedidoItemFormField.Quantidade, 'Informe uma quantidade válida')
      .build(),
    onSubmit: async (values) => {
      if (!item || values.quantidade === '') return
      const sucesso = await editarItem.fetch({
        id: item.id,
        quantidade: values.quantidade,
      })
      if (!sucesso) return
      form.limpar()
      onSuccess()
    },
  })

  useEffect(() => {
    if (!item) {
      form.limpar()
      return
    }
    form.setValue({ quantidade: item.quantidade })
    // O formulário deve ser sincronizado somente quando o item selecionado mudar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  return (
    <ModalChildren
      close={onClose}
      footerChildren={
        <>
          <ButtonApp onClick={onClose} variant={ButtonAppVariant.Outlined}>
            Cancelar
          </ButtonApp>
          <ButtonApp loading={editarItem.loading} onClick={form.onSubmit}>
            Salvar
          </ButtonApp>
        </>
      }
      fullWidth
      maxWidth="md"
      open={item !== undefined}
      titulo="Editar item do pedido"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12}>
          <InputApp disabled label="Produto" value={item?.produto?.descricao ?? ''} />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled
            label="Peso/Tamanho"
            value={item?.peso?.descricao ?? item?.tamanho?.descricao ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            disabled
            label="Valor unitário"
            startAdornment="R$"
            type={InputAppType.Currency}
            value={item?.valorUnitario ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            error={form.error(PedidoItemFormField.Quantidade)}
            helperText={form.helperText(PedidoItemFormField.Quantidade)}
            id={PedidoItemFormField.Quantidade}
            label="Quantidade"
            onChange={(_, value) =>
              form.onChange(PedidoItemFormField.Quantidade, value === '' ? '' : Number(value))
            }
            type={InputAppType.Number}
            value={form.values.quantidade ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </ModalChildren>
  )
}
