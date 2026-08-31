import { Icon } from '@iconify/react'
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import type { ICellRendererParams } from 'ag-grid-community'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiTabelaDePreco } from '../../../api/useApiTabelaDePreco'
import { ButtonApp } from '../../../components/ButtonApp/ButtonApp'
import { DividerApp } from '../../../components/DividerApp/DividerApp'
import { ProdutoDropDown } from '../../../components/DropDown/ProdutoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { useSnackbarApp } from '../../../components/Snackbar/useSnackbar'
import { TabelaComDrag, type TypeColumns } from '../../../components/Tabela/TabelaComDrag'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import type { Produto } from '../../../types/ProdutoTypes'
import {
  TabelaDePrecoFormField,
  TabelaDePrecoItemFormField,
  type TabelaDePreco,
  type TabelaDePrecoItem,
} from '../../../types/TabelaDePrecoTypes'

const TabelaDePrecoFormIcon = {
  Add: 'ic:round-plus',
  Remove: 'solar:trash-bin-trash-linear',
  Search: 'solar:magnifer-linear',
} as const

const tabelaDePrecoInitialValues: Partial<TabelaDePreco> = {
  [TabelaDePrecoFormField.Descricao]: '',
  [TabelaDePrecoFormField.Itens]: [],
}

const tabelaDePrecoValidationSchema = new YupAdapter()
  .string(TabelaDePrecoFormField.Descricao)
  .build()

function criarItem(): Partial<TabelaDePrecoItem> {
  return {
    [TabelaDePrecoItemFormField.Preco]: 0,
    [TabelaDePrecoItemFormField.Produto]: undefined,
    [TabelaDePrecoItemFormField.ProdutoId]: '',
  }
}

type TabelaDePrecoFormPageProps = {
  action: FormActionType
}

export function TabelaDePrecoFormPage({ action }: TabelaDePrecoFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiTabelaDePreco()
  const { navigate } = useNavigationApp()
  const { cores } = useThemeApp()
  const snack = useSnackbarApp()
  const readonly = action === FormAction.View
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto>()
  const [precoSelecionado, setPrecoSelecionado] = useState<number | ''>('')
  const [pesquisa, setPesquisa] = useState('')
  const form = useFormikAdapter<Partial<TabelaDePreco>>({
    initialValues: tabelaDePrecoInitialValues,
    validationSchema: tabelaDePrecoValidationSchema,
    onSubmit: async (values) => {
      const tabelaDePreco = {
        descricao: values.descricao,
        itens: values.itens?.map((item: TabelaDePrecoItem) => ({
          ...(item.id && { id: item.id }),
          preco: Number(item.preco),
          produtoId: item.produtoId,
        })) as TabelaDePrecoItem[],
      }
      const response = action === FormAction.Edit && id
        ? await atualizar.fetch(id, tabelaDePreco)
        : await criar.fetch(tabelaDePreco)

      if (response) navigate(PrivateRoutePath.TabelaDePreco)
    },
  })
  const itens = useMemo(() => form.values.itens ?? [], [form.values.itens])
  const formRef = useRef(form)
  const itensRef = useRef(itens)
  useEffect(() => {
    formRef.current = form
    itensRef.current = itens
  }, [form, itens])
  const itensFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase()
    if (!termo) return itens

    return itens.filter((item) =>
      item.produto?.descricao?.toLocaleLowerCase().includes(termo),
    )
  }, [itens, pesquisa])

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarTabelaDePreco() {
      const response = await obter.fetch(id as string)
      if (!response) return

      form.setValue({
        descricao: response.descricao,
        itens: response.itens,
      })
    }

    buscarTabelaDePreco()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  const colunasItens = useMemo<TypeColumns[]>(() => {
    function obterIndiceItem(item: TabelaDePrecoItem) {
      return itensRef.current.findIndex((itemAtual) =>
        (item.id && itemAtual.id === item.id) || itemAtual.produtoId === item.produtoId,
      )
    }

    function alterarItem(index: number, values: Partial<TabelaDePrecoItem>) {
      const itensAtuais = [...itensRef.current]
      itensAtuais[index] = { ...itensAtuais[index], ...values } as TabelaDePrecoItem
      formRef.current.setValue({ itens: itensAtuais })
    }

    function removerItem(index: number) {
      formRef.current.setValue({
        itens: itensRef.current.filter((_, itemIndex) => itemIndex !== index),
      })
    }

    return [
      {
        field: TabelaDePrecoItemFormField.Produto,
        headerName: 'Produto',
        sortable: false,
        flex: 1,
        minWidth: 220,
        cellRenderer: ({ data }: ICellRendererParams<TabelaDePrecoItem>) => data?.produto && (
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', height: '100%' }}>
            <Avatar
              alt={data.produto.descricao}
              src={data.produto.foto}
              variant="rounded"
              sx={{ height: 38, width: 38 }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant="body2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {data.produto.descricao}
              </Typography>
              <Typography
                color="text.primary"
                noWrap
                variant="body2"
                sx={{ mt: 0.25, opacity: 0.72 }}
              >
                {data.produto.categoria?.descricao}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        field: TabelaDePrecoItemFormField.Preco,
        headerName: 'Preço',
        sortable: false,
        width: 180,
        cellRenderer: ({ data }: ICellRendererParams<TabelaDePrecoItem>) => {
          if (!data) return null
          const index = obterIndiceItem(data)

          return (
            <Box sx={{ maxWidth: 150 }}>
              <InputApp
                disabled={readonly}
                id={`${TabelaDePrecoFormField.Itens}.${index}.${TabelaDePrecoItemFormField.Preco}`}
                onChange={(_, value) => alterarItem(index, { preco: Number(value) })}
                required
                startAdornment="R$"
                type={InputAppType.Currency}
                value={data.preco}
              />
            </Box>
          )
        },
      },
      {
        field: 'acoes',
        headerName: 'Ações',
        sortable: false,
        width: 78,
        maxWidth: 78,
        resizable: false,
        cellRenderer: ({ data }: ICellRendererParams<TabelaDePrecoItem>) => data && !readonly && (
          <Tooltip title="Remover produto">
            <IconButton
              aria-label="Remover produto"
              onClick={() => removerItem(obterIndiceItem(data))}
              size="small"
              sx={{
                color: cores.error,
              }}
            >
              <Icon icon={TabelaDePrecoFormIcon.Remove} />
            </IconButton>
          </Tooltip>
        ),
      },
    ]
  }, [cores.error, readonly])

  function adicionarItem() {
    if (!produtoSelecionado || precoSelecionado === '') return

    const itens = form.values.itens ?? []
    if (itens.some((item) => item.produtoId === produtoSelecionado.id)) return

    form.setValue({
      itens: [
        ...itens,
        {
          ...criarItem(),
          preco: Number(precoSelecionado),
          produto: produtoSelecionado,
          produtoId: produtoSelecionado.id,
        } as TabelaDePrecoItem,
      ],
    })
    setProdutoSelecionado(undefined)
    setPrecoSelecionado('')
  }

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.TabelaDePreco}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={6}>
          <InputApp
            disabled={readonly}
            error={form.error(TabelaDePrecoFormField.Descricao)}
            helperText={form.helperText(TabelaDePrecoFormField.Descricao)}
            id={TabelaDePrecoFormField.Descricao}
            label="Descrição"
            maxLength={150}
            name={TabelaDePrecoFormField.Descricao}
            onBlur={form.onBlur}
            onChange={form.onChange}
            placeholder="Informe a descrição"
            required
            type={InputAppType.Text}
            value={form.values.descricao}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>

      <Stack spacing={1.5}>
        <DividerApp>
          <Chip color="primary" label="Adicionar item" size="small" variant="outlined" />
        </DividerApp>

        {!readonly && (
          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12} md={6}>
              <ProdutoDropDown
                id={TabelaDePrecoItemFormField.ProdutoId}
                label="Produto"
                onChange={(_, produto) => {
                  if (
                    produto &&
                    (form.values.itens ?? []).some(
                      (item) => item.produtoId === produto.id,
                    )
                  ) {
                    snack.show('Este produto já foi adicionado à tabela de preço', 'error')
                    setProdutoSelecionado(undefined)
                    return
                  }

                  setProdutoSelecionado(produto)
                }}
                value={produtoSelecionado}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow xs={12} md={3}>
              <InputApp
                id={TabelaDePrecoItemFormField.Preco}
                label="Preço"
                onChange={(_, value) => setPrecoSelecionado(value === '' ? '' : Number(value))}
                placeholder="Informe o preço"
                startAdornment="R$"
                type={InputAppType.Currency}
                value={precoSelecionado}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow xs={12} md={3}>
              <ButtonApp
                disabled={!produtoSelecionado || precoSelecionado === '' ||
                  (form.values.itens ?? []).some(
                    (item) => item.produtoId === produtoSelecionado?.id,
                  )}
                fullWidth
                startIcon={<Icon icon={TabelaDePrecoFormIcon.Add} />}
                onClick={adicionarItem}
              >
                Adicionar
              </ButtonApp>
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
        )}

        {(form.values.itens?.length ?? 0) > 0 && (
          <DividerApp>
            <Chip color="primary" label="Produtos adicionados" size="small" />
          </DividerApp>
        )}

        {(form.values.itens?.length ?? 0) > 0 && (
          <Stack spacing={1.25}>
            <Box sx={{ maxWidth: 360 }}>
              <InputApp
                id="pesquisa-produto-tabela-preco"
                onChange={(_, value) => setPesquisa(String(value ?? ''))}
                placeholder="Pesquisar produto..."
                startAdornment={<Icon icon={TabelaDePrecoFormIcon.Search} />}
                type={InputAppType.Search}
                value={pesquisa}
              />
            </Box>

            <TabelaComDrag
              columns={colunasItens}
              headerHeight={38}
              height={'calc(100vh - 420px)'}
              rowHeight={60}
              rows={itensFiltrados}
            />
          </Stack>
        )}
      </Stack>
    </FormRoot.Form>
  )
}
