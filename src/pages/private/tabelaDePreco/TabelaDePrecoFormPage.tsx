import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiItemTabelaDePreco } from '../../../api/useApiItemTabelaDePreco'
import { useApiTabelaDePreco } from '../../../api/useApiTabelaDePreco'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppDisplay, BoxAppFlexDirection } from '../../../components/BoxApp/boxAppTypes'
import { ButtonApp } from '../../../components/ButtonApp/ButtonApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { useSnackbarApp } from '../../../components/Snackbar/useSnackbar'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import {
  TabelaDePrecoFormField,
  type CriarTabelaDePrecoPayload,
  type TabelaDePreco,
  type TabelaDePrecoCabecalhoValues,
  type TabelaDePrecoItem,
} from '../../../types/TabelaDePrecoTypes'
import { TabelaDePrecoCabecalhoFields } from './TabelaDePrecoCabecalhoFields'
import { TabelaDePrecoItemCard } from './TabelaDePrecoItemCard'
import { TabelaDePrecoItemEditor } from './TabelaDePrecoItemEditor'

const cabecalhoInitialValues: TabelaDePrecoCabecalhoValues = {
  ativaEcommerce: false,
  descricao: '',
}
const validationSchema = new YupAdapter()
  .string(TabelaDePrecoFormField.Descricao, 'Informe a descrição')
  .build()
const PesquisaItemField = 'pesquisaItemTabelaDePreco'

function chaveItem(item: TabelaDePrecoItem) {
  return `${item.produtoId}-${item.pesoId ?? ''}-${item.tamanhoId ?? ''}`
}

function itemPayload(item: TabelaDePrecoItem) {
  return {
    pesoId: item.pesoId ?? null,
    produtoId: item.produtoId,
    tamanhoId: item.tamanhoId ?? null,
    valorUnitarioAtacado: item.valorUnitarioAtacado,
    valorUnitarioVarejo: item.valorUnitarioVarejo,
  }
}

export function TabelaDePrecoFormPage({ action }: { action: FormActionType }) {
  if (action === FormAction.Create) return <TabelaDePrecoCreatePage />
  return <TabelaDePrecoEditPage readonly={action === FormAction.View} />
}

type CreateValues = TabelaDePrecoCabecalhoValues & { itensTabelaDePreco: TabelaDePrecoItem[] }

function TabelaDePrecoCreatePage() {
  const { criar } = useApiTabelaDePreco()
  const { navigate } = useNavigationApp()
  const snack = useSnackbarApp()
  const [itemEdicao, setItemEdicao] = useState<TabelaDePrecoItem>()
  const form = useFormikAdapter<CreateValues>({
    initialValues: { ...cabecalhoInitialValues, itensTabelaDePreco: [] },
    validationSchema,
    onSubmit: async (values) => {
      const payload: CriarTabelaDePrecoPayload = {
        ativaEcommerce: values.ativaEcommerce,
        descricao: values.descricao,
        itensTabelaDePreco: values.itensTabelaDePreco.map(itemPayload),
      }
      if (await criar.fetch(payload)) navigate(PrivateRoutePath.TabelaDePreco)
    },
  })

  function adicionarItem(item: TabelaDePrecoItem) {
    if (form.values.itensTabelaDePreco.some((atual) => chaveItem(atual) === chaveItem(item))) {
      snack.show('Este produto e variação já foram adicionados', 'error')
      return false
    }
    form.setValue({ itensTabelaDePreco: [...form.values.itensTabelaDePreco, item] })
    return true
  }

  function editarItem(item: TabelaDePrecoItem) {
    if (
      form.values.itensTabelaDePreco.some(
        (atual) => atual !== itemEdicao && chaveItem(atual) === chaveItem(item),
      )
    ) {
      snack.show('Este produto e variação já foram adicionados', 'error')
      return false
    }
    form.setValue({
      itensTabelaDePreco: form.values.itensTabelaDePreco.map((atual) =>
        chaveItem(atual) === chaveItem(itemEdicao as TabelaDePrecoItem) ? item : atual,
      ),
    })
    setItemEdicao(undefined)
    return true
  }

  return (
    <FormRoot.Form
      loading={criar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.TabelaDePreco}
    >
      <TabelaDePrecoCabecalhoFields form={form} />
      <SecaoTitulo>Adicionar item</SecaoTitulo>
      <TabelaDePrecoItemEditor onConfirmar={adicionarItem} textoButton="Adicionar item" />
      <ListaItens
        itens={form.values.itensTabelaDePreco}
        onEditar={setItemEdicao}
        onExcluir={(item) => {
          form.setValue({
            itensTabelaDePreco: form.values.itensTabelaDePreco.filter(
              (atual) => chaveItem(atual) !== chaveItem(item),
            ),
          })
          return true
        }}
      />
      <ModalChildren
        close={() => setItemEdicao(undefined)}
        fullWidth
        maxWidth="lg"
        open={Boolean(itemEdicao)}
        retirarFooter
        titulo="Editar item"
      >
        {itemEdicao && (
          <TabelaDePrecoItemEditor
            initialItem={itemEdicao}
            onConfirmar={editarItem}
            textoButton="Confirmar alteração"
          />
        )}
      </ModalChildren>
    </FormRoot.Form>
  )
}

function TabelaDePrecoEditPage({ readonly }: { readonly: boolean }) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, obter } = useApiTabelaDePreco()
  const itemApi = useApiItemTabelaDePreco()
  const { navigate } = useNavigationApp()
  const snack = useSnackbarApp()
  const [tabela, setTabela] = useState<TabelaDePreco>()
  const [itemModal, setItemModal] = useState<TabelaDePrecoItem | null>()
  const form = useFormikAdapter<TabelaDePrecoCabecalhoValues>({
    initialValues: cabecalhoInitialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (!id) return
      if (await atualizar.fetch({ id, ...values })) navigate(PrivateRoutePath.TabelaDePreco)
    },
  })

  async function carregar() {
    if (!id) return
    const response = await obter.fetch(id)
    if (!response) return
    setTabela(response)
    form.setValue({ ativaEcommerce: response.ativaEcommerce, descricao: response.descricao })
  }

  useEffect(() => {
    // O carregamento remoto inicializa o formulário e a lista de itens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function salvarItem(item: TabelaDePrecoItem) {
    if (!id) return false
    if (
      !item.id &&
      tabela?.itensTabelaDePreco.some((atual) => chaveItem(atual) === chaveItem(item))
    ) {
      snack.show('Este produto e variação já existem na tabela de preço', 'error')
      return false
    }
    const payload = {
      ...itemPayload(item),
      ...(item.id ? { id: item.id } : {}),
      tabelaDePrecoId: id,
    }
    const itemAtualizado = item.id
      ? await itemApi.atualizar.fetch(payload)
      : await itemApi.criar.fetch(payload)
    if (itemAtualizado) {
      setTabela((atual) =>
        atual
          ? {
              ...atual,
              itensTabelaDePreco: item.id
                ? atual.itensTabelaDePreco.map((itemAtual) =>
                    itemAtual.id === item.id
                      ? {
                          ...itemAtual,
                          valorUnitarioAtacado: itemAtualizado.valorUnitarioAtacado,
                          valorUnitarioVarejo: itemAtualizado.valorUnitarioVarejo,
                        }
                      : itemAtual,
                  )
                : [...atual.itensTabelaDePreco, itemAtualizado],
            }
          : atual,
      )
      setItemModal(undefined)
    }
    return Boolean(itemAtualizado)
  }

  async function excluirItem(item: TabelaDePrecoItem) {
    if (!item.id) return false
    const sucesso = await itemApi.excluir.fetch(item.id)
    if (sucesso) {
      setTabela((atual) =>
        atual
          ? {
              ...atual,
              itensTabelaDePreco: atual.itensTabelaDePreco.filter(
                (itemAtual) => itemAtual.id !== item.id,
              ),
            }
          : atual,
      )
    }
    return sucesso
  }

  const loadingItem = itemApi.criar.loading || itemApi.atualizar.loading || itemApi.excluir.loading

  return (
    <>
      <FormRoot.Form
        action={readonly ? FormAction.View : FormAction.Edit}
        loading={obter.loading || atualizar.loading}
        submit={form.onSubmit}
        textoButton="Salvar"
        urlVoltar={PrivateRoutePath.TabelaDePreco}
      >
        <TabelaDePrecoCabecalhoFields form={form} readonly={readonly} />
        <SecaoTitulo>Itens da tabela de preço</SecaoTitulo>
        {!readonly && (
          <BoxApp mb={2}>
            <TextApp color={TextAppColor.Secondary}>
              Adições, alterações e exclusões de itens são salvas imediatamente após a confirmação.
            </TextApp>
          </BoxApp>
        )}
        {!readonly && (
          <BoxApp mb={2}>
            <ButtonApp onClick={() => setItemModal(null)}>Adicionar novo item</ButtonApp>
          </BoxApp>
        )}
        <ListaItens
          itens={tabela?.itensTabelaDePreco ?? []}
          loading={loadingItem}
          onEditar={readonly ? undefined : setItemModal}
          onExcluir={readonly ? undefined : excluirItem}
        />
      </FormRoot.Form>
      <ModalChildren
        close={() => setItemModal(undefined)}
        fullWidth
        maxWidth="lg"
        open={itemModal !== undefined}
        retirarFooter
        titulo={itemModal ? 'Editar item' : 'Adicionar item'}
      >
        <TabelaDePrecoItemEditor
          bloquearIdentificacao={Boolean(itemModal)}
          key={itemModal?.id ?? 'novo-item'}
          initialItem={itemModal ?? undefined}
          loading={loadingItem}
          onConfirmar={salvarItem}
          textoButton={itemModal ? 'Confirmar alteração' : 'Confirmar adição'}
        />
      </ModalChildren>
    </>
  )
}

function ListaItens({
  itens,
  loading,
  onEditar,
  onExcluir,
}: {
  itens: TabelaDePrecoItem[]
  loading?: boolean
  onEditar?: (item: TabelaDePrecoItem) => void
  onExcluir?: (item: TabelaDePrecoItem) => Promise<boolean> | boolean
}) {
  const [pesquisa, setPesquisa] = useState('')
  if (itens.length === 0)
    return <TextApp color={TextAppColor.Secondary}>Nenhum item adicionado.</TextApp>

  const termo = pesquisa.trim().toLocaleLowerCase()
  const itensFiltrados = termo
    ? itens.filter((item) =>
        [
          item.produto?.descricao,
          item.produto?.categoria?.descricao,
          item.peso?.descricao,
          item.tamanho?.descricao,
        ].some((value) => value?.toLocaleLowerCase().includes(termo)),
      )
    : itens

  return (
    <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={1}>
      <BoxApp maxWidth={420}>
        <InputApp
          id={PesquisaItemField}
          onChange={(_, value) => setPesquisa(String(value ?? ''))}
          placeholder="Pesquisar por produto, categoria, peso ou tamanho..."
          startAdornment={<IconApp icon="solar:magnifer-linear" />}
          type={InputAppType.Search}
          value={pesquisa}
        />
      </BoxApp>
      {itensFiltrados.length === 0 ? (
        <TextApp color={TextAppColor.Secondary}>Nenhum item corresponde à pesquisa.</TextApp>
      ) : (
        itensFiltrados.map((item) => (
          <TabelaDePrecoItemCard
            item={item}
            key={item.id ?? chaveItem(item)}
            loading={loading}
            onEditar={onEditar ? () => onEditar(item) : undefined}
            onExcluir={onExcluir ? () => onExcluir(item) : undefined}
          />
        ))
      )}
    </BoxApp>
  )
}

function SecaoTitulo({ children }: { children: string }) {
  return (
    <BoxApp mb={1.5} mt={1}>
      <TextApp fontSize="1.1rem" weight={TextAppWeight.SemiBold}>
        {children}
      </TextApp>
    </BoxApp>
  )
}
