import { useEffect, useState } from 'react'
import { useApiPedido } from '../../../api/useApiPedido'
import { useApiTabelaDePreco } from '../../../api/useApiTabelaDePreco'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { PesoDropDown } from '../../../components/DropDown/PesoDropDown'
import { ProdutoDropDown } from '../../../components/DropDown/ProdutoDropDown'
import { TamanhoDropDown } from '../../../components/DropDown/TamanhoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PedidoItemFormField, type PedidoItemForm } from '../../../types/PedidoTypes'
import type { TabelaDePrecoItemPedido } from '../../../types/TabelaDePrecoTypes'

type PedidoAdicionarItemModalProps = {
  pedidoId?: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PedidoAdicionarItemModal({
  pedidoId,
  open,
  onClose,
  onSuccess,
}: PedidoAdicionarItemModalProps) {
  const { adicionarItem } = useApiPedido()
  const { listarItens, obterAtiva } = useApiTabelaDePreco()
  const [itensTabelaDePreco, setItensTabelaDePreco] = useState<TabelaDePrecoItemPedido[]>([])
  const itemForm = useFormikAdapter<PedidoItemForm>({
    initialValues: { quantidade: 1 },
    validationSchema: new YupAdapter()
      .string(PedidoItemFormField.ProdutoId, 'Selecione o produto')
      .number(PedidoItemFormField.Quantidade, 'Informe a quantidade')
      .number(PedidoItemFormField.ValorUnitario, 'Preço não encontrado', 0)
      .build(),
    onSubmit: async (values) => {
      if (
        !pedidoId ||
        !values.produtoId ||
        values.quantidade === undefined ||
        values.valorUnitario === undefined
      )
        return
      const sucesso = await adicionarItem.fetch({
        pedidoId,
        produtoId: values.produtoId,
        pesoId: values.pesoId,
        tamanhoId: values.tamanhoId,
        quantidade: values.quantidade,
        valorUnitario: values.valorUnitario,
      })
      if (!sucesso) return
      itemForm.limpar()
      onSuccess()
    },
  })
  const carregandoPreco = obterAtiva.loading || listarItens.loading

  useEffect(() => {
    if (!open) return
    async function carregarTabelaDePreco() {
      itemForm.limpar()
      const tabelaDePreco = await obterAtiva.fetch()
      if (!tabelaDePreco?.id) {
        setItensTabelaDePreco([])
        return
      }
      const itens = await listarItens.fetch(tabelaDePreco.id)
      setItensTabelaDePreco(itens ?? [])
    }
    carregarTabelaDePreco()
    // A tabela de preço é carregada somente ao abrir o modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function atualizarItem(values: Partial<PedidoItemForm>) {
    const item = { ...itemForm.values, ...values }
    const preco = itensTabelaDePreco.find(
      (current) =>
        current.produtoId === item.produtoId &&
        (current.pesoId ?? undefined) === item.pesoId &&
        (current.tamanhoId ?? undefined) === item.tamanhoId,
    )
    itemForm.setValue({ ...values, valorUnitario: preco?.valorUnitarioVarejo })
  }

  return (
    <ModalChildren
      close={onClose}
      footerChildren={
        <>
          <ButtonApp onClick={onClose} variant={ButtonAppVariant.Outlined}>
            Cancelar
          </ButtonApp>
          <ButtonApp loading={adicionarItem.loading} onClick={itemForm.onSubmit}>
            Adicionar
          </ButtonApp>
        </>
      }
      fullWidth
      maxWidth="md"
      open={open}
      titulo="Adicionar item ao pedido"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <ProdutoDropDown
            error={itemForm.error(PedidoItemFormField.ProdutoId)}
            helperText={itemForm.helperText(PedidoItemFormField.ProdutoId)}
            onChange={(_, produto) => atualizarItem({ produto, produtoId: produto?.id })}
            readonly={carregandoPreco}
            value={itemForm.values.produto}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <PesoDropDown
            onChange={(_, peso) => atualizarItem({ peso, pesoId: peso?.id })}
            readonly={carregandoPreco}
            value={itemForm.values.peso}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <TamanhoDropDown
            onChange={(_, tamanho) => atualizarItem({ tamanho, tamanhoId: tamanho?.id })}
            readonly={carregandoPreco}
            value={itemForm.values.tamanho}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            error={itemForm.error(PedidoItemFormField.Quantidade)}
            helperText={itemForm.helperText(PedidoItemFormField.Quantidade)}
            id={PedidoItemFormField.Quantidade}
            label="Quantidade"
            onChange={(_, value) =>
              itemForm.onChange(PedidoItemFormField.Quantidade, Number(value))
            }
            type={InputAppType.Number}
            value={itemForm.values.quantidade ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled
            error={itemForm.error(PedidoItemFormField.ValorUnitario)}
            helperText={itemForm.helperText(PedidoItemFormField.ValorUnitario)}
            id={PedidoItemFormField.ValorUnitario}
            label="Valor unitário"
            startAdornment="R$"
            type={InputAppType.Currency}
            value={itemForm.values.valorUnitario ?? ''}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </ModalChildren>
  )
}
