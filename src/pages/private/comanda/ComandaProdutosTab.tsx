import { Alert, AlertTitle, Box, Stack, Typography } from '@mui/material'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useApiComanda } from '../../../api/useApiComanda'
import { useApiTabelaDePreco } from '../../../api/useApiTabelaDePreco'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { ComandaItensList } from '../../../components/Comanda/ComandaItensList'
import { ProdutoDropDown } from '../../../components/DropDown/ProdutoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { useSnackbarApp } from '../../../components/Snackbar/useSnackbar'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { ComandaItem } from '../../../types/ComandaTypes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import type { Produto } from '../../../types/ProdutoTypes'
import type { TabelaDePreco } from '../../../types/TabelaDePrecoTypes'

type ComandaProdutosTabProps = {
  action: FormActionType
  comandaId?: string
  itens: ComandaItem[]
  onIrParaGeral: () => void
  readonly: boolean
  setItens: Dispatch<SetStateAction<ComandaItem[]>>
  tabelaDePreco?: TabelaDePreco
}

export function ComandaProdutosTab({ action, comandaId, itens, onIrParaGeral, readonly, setItens, tabelaDePreco }: ComandaProdutosTabProps) {
  const { adicionarItem, excluirItem, obterItens } = useApiComanda()
  const { obterPreco } = useApiTabelaDePreco()
  const snack = useSnackbarApp()
  const { isCelular } = useThemeApp()
  const [produto, setProduto] = useState<Produto>()
  const [quantidade, setQuantidade] = useState<number | ''>(1)
  const [valorUnitario, setValorUnitario] = useState<number | ''>('')
  const [itemParaExcluir, setItemParaExcluir] = useState<ComandaItem>()

  useEffect(() => {
    if (!comandaId || action === FormAction.Create) return

    async function carregarItens() {
      const response = await obterItens.fetch(comandaId as string)
      if (response) setItens(response)
    }

    carregarItens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, comandaId])

  function limparProdutoSelecionado() {
    setProduto(undefined)
    setQuantidade(1)
    setValorUnitario('')
    window.setTimeout(() => document.getElementById('produtoId')?.focus(), 0)
  }

  async function adicionarProduto() {
    if (!produto || quantidade === '' || valorUnitario === '') return
    const novoItem = {
      produtoId: produto.id,
      quantidade: Number(quantidade),
      valorUnitario: Number(valorUnitario),
      desconto: 0,
    }

    if (action === FormAction.Edit && comandaId) {
      const response = await adicionarItem.fetch(comandaId, novoItem)
      if (response?.resultado) {
        limparProdutoSelecionado()
        const itensAtualizados = await obterItens.fetch(comandaId)
        if (itensAtualizados) setItens(itensAtualizados)
      }
      return
    }

    setItens((current) => [...current, {
      ...novoItem,
      produto,
      valorTotal: Math.max(0, novoItem.quantidade * novoItem.valorUnitario - novoItem.desconto),
    }])
    limparProdutoSelecionado()
  }

  async function confirmarExclusaoItem() {
    if (!itemParaExcluir?.id || !comandaId) return
    const response = await excluirItem.fetch(itemParaExcluir.id)
    if (!response?.resultado) return

    setItemParaExcluir(undefined)
    const itensAtualizados = await obterItens.fetch(comandaId)
    if (itensAtualizados) setItens(itensAtualizados)
  }

  return (
    <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ pb: { xs: 2, md: 0 } }}>
      {!readonly && !tabelaDePreco && (
        <Alert
          action={!isCelular ? <ButtonApp onClick={onIrParaGeral} variant={ButtonAppVariant.Outlined}>Ir para Geral</ButtonApp> : undefined}
          severity="warning"
          variant="outlined"
        >
          <AlertTitle>Tabela de preço não selecionada</AlertTitle>
          Selecione uma tabela de preço na aba Geral para pesquisar produtos e obter seus preços.
          {isCelular && <Box sx={{ mt: 1.25 }}><ButtonApp fullWidth onClick={onIrParaGeral} variant={ButtonAppVariant.Outlined}>Ir para Geral</ButtonApp></Box>}
        </Alert>
      )}
      {!readonly && (
        <Box sx={{ display: 'grid', gap: { xs: 1, md: 1.5 }, gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr)', md: 'minmax(300px, 1fr) 180px 210px auto' } }}>
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, minWidth: 0 }}>
            <ProdutoDropDown
              onChange={async (_, value) => {
                setProduto(value)
                setValorUnitario('')
                if (!value || !tabelaDePreco) return

                const preco = await obterPreco.fetch(tabelaDePreco.id, value.id)
                if (preco === undefined) {
                  setProduto(undefined)
                  snack.show('Não foi possível obter o preço deste produto', 'error')
                  return
                }
                setValorUnitario(preco)
              }}
              readonly={!tabelaDePreco || obterPreco.loading}
              value={produto}
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <InputApp id="quantidade" label="Quantidade" onChange={(_, value) => setQuantidade(value === '' ? '' : Number(value))} type={InputAppType.Number} value={quantidade} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <InputApp disabled id="valorUnitario" label="Valor unitário" startAdornment="R$" type={InputAppType.Currency} value={valorUnitario} />
          </Box>
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <ButtonApp
              disabled={!tabelaDePreco || !produto || valorUnitario === '' || obterPreco.loading || adicionarItem.loading}
              fullWidth
              loading={obterPreco.loading || adicionarItem.loading}
              onClick={adicionarProduto}
            >Adicionar produto</ButtonApp>
          </Box>
        </Box>
      )}
      <ComandaItensList
        itens={itens}
        loading={obterItens.loading}
        onRemove={!readonly ? (item, itemIndex) => {
          if (action === FormAction.Create) {
            setItens((current) => current.filter((_, index) => index !== itemIndex))
            return
          }
          setItemParaExcluir(item)
        } : undefined}
        removeLoading={excluirItem.loading}
      />
      <ModalChildren
        close={() => setItemParaExcluir(undefined)}
        footerChildren={(
          <Stack direction="row" spacing={1}>
            <ButtonApp onClick={() => setItemParaExcluir(undefined)} variant={ButtonAppVariant.Outlined}>Voltar</ButtonApp>
            <ButtonApp loading={excluirItem.loading} onClick={confirmarExclusaoItem}>Remover produto</ButtonApp>
          </Stack>
        )}
        maxWidth="xs"
        open={itemParaExcluir !== undefined}
        titulo="Remover produto"
      >
        <Typography>Confirma a remoção de '{itemParaExcluir?.produto.descricao ?? 'este produto'}' da comanda?</Typography>
      </ModalChildren>
    </Stack>
  )
}
