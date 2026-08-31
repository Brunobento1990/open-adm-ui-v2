import { useState } from 'react'
import { useApiEstoque } from '../../../api/useApiEstoque'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import type { Estoque } from '../../../types/EstoqueTypes'

type ProdutoEstoqueModalProps = {
  produtoId: string
}

function obterLabelVariacao(estoque: Estoque) {
  if (estoque.peso && estoque.tamanho) return `Peso: ${estoque.peso} · Tamanho: ${estoque.tamanho}`
  if (estoque.peso) return `Peso: ${estoque.peso}`
  if (estoque.tamanho) return `Tamanho: ${estoque.tamanho}`
  return 'Produto sem variação'
}

export function ProdutoEstoqueModal({ produtoId }: ProdutoEstoqueModalProps) {
  const { atualizarTodos, obterTodosDoProduto } = useApiEstoque()
  const [open, setOpen] = useState(false)
  const [estoques, setEstoques] = useState<Estoque[]>([])

  async function abrir() {
    const response = await obterTodosDoProduto.fetch(produtoId)
    if (!response) return
    setEstoques(response.dados ?? [])
    setOpen(true)
  }

  function fechar() {
    setOpen(false)
    setEstoques([])
  }

  function atualizarQuantidade(index: number, quantidade: number) {
    setEstoques((current) => current.map((estoque, estoqueIndex) =>
      estoqueIndex === index ? { ...estoque, quantidade } : estoque,
    ))
  }

  async function salvar() {
    const response = await atualizarTodos.fetch({
      dados: estoques.map(({ id, quantidade }) => ({ id, quantidade })),
    })
    if (response !== undefined) fechar()
  }

  return (
    <>
      <ButtonApp
        loading={obterTodosDoProduto.loading}
        onClick={abrir}
        variant={ButtonAppVariant.Outlined}
      >
        Estoque
      </ButtonApp>
      <ModalChildren
        close={fechar}
        footerChildren={(
          <ButtonApp loading={atualizarTodos.loading} onClick={salvar}>
            Salvar
          </ButtonApp>
        )}
        fullWidth
        maxWidth="md"
        open={open}
        titulo={`Estoque produto: ${estoques[0]?.produto ?? ''}`}
      >
        {estoques.length === 0 ? (
          <TextApp>Não há posições de estoque para este produto.</TextApp>
        ) : (
          <FormRoot.FormRow>
            {estoques.map((estoque, index) => (
              <FormRoot.FormItemRow key={estoque.id} xs={12} md={4}>
                <TextApp weight={TextAppWeight.Medium}>{obterLabelVariacao(estoque)}</TextApp>
                <InputApp
                  id={`estoque-${estoque.id}`}
                  onChange={(_, value) => atualizarQuantidade(index, Number(value))}
                  type={InputAppType.Number}
                  value={estoque.quantidade}
                />
              </FormRoot.FormItemRow>
            ))}
          </FormRoot.FormRow>
        )}
      </ModalChildren>
    </>
  )
}
