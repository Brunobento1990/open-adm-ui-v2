import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { useApiProduto } from '../../../api/useApiProduto'
import { CategoriaDropDown } from '../../../components/DropDown/CategoriaDropDown'
import { DropDownMultiSelectApp } from '../../../components/DropDown/DropDownMultiSelectApp'
import { ImageUploadApp } from '../../../components/ImageUploadApp/ImageUploadApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TabsApp } from '../../../components/TabsApp/TabsApp'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import type { Peso } from '../../../types/PesoTypes'
import { ProdutoFormField, type Produto, type ProdutoPayload, type ProdutoTabelaDePrecoItem } from '../../../types/ProdutoTypes'
import type { Tamanho } from '../../../types/TamanhoTypes'
import { imagemBase64Valida, removerPrefixoBase64 } from '../../../utils/imageUtils'

const ProdutoField = { MaxLength: 255 } as const
const ProdutoTab = {
  Produto: 0,
  Precos: 1,
} as const
const produtoTabs = [
  { label: 'Produto', value: ProdutoTab.Produto },
  { label: 'Preços', value: ProdutoTab.Precos },
]
const ProdutoFoto = {
  InvalidMessage: 'Não foi possível processar a imagem selecionada. Selecione outra imagem.',
} as const

const produtoInitialValues: Partial<Produto> = {
  categoriaId: '',
  descricao: '',
  especificacaoTecnica: '',
  novaFoto: '',
  pesos: [],
  referencia: '',
  tamanhos: [],
  vendaSomenteComEstoqueDisponivel: false,
  categoria: undefined,
  foto: '',
}

const produtoValidationSchema = new YupAdapter()
  .stringWithTests(
    ProdutoFormField.Descricao,
    [{
      name: 'maxLength',
      message: `A descrição deve ter no máximo ${ProdutoField.MaxLength} caracteres`,
      test: (value) => !value || value.length <= ProdutoField.MaxLength,
    }],
    'Informe a descrição',
  )
  .string(ProdutoFormField.CategoriaId)
  .build()

type ProdutoFormPageProps = { action: FormActionType }
type PrecoVariacaoProps = {
  descricao: string
  item: ProdutoTabelaDePrecoItem
  onChange: (values: Partial<ProdutoTabelaDePrecoItem>) => void
  readonly: boolean
}

function PrecoVariacao({ descricao, item, onChange, readonly }: PrecoVariacaoProps) {
  const variacaoId = item.pesoId ?? item.tamanhoId ?? item.id ?? 'produto'

  return (
    <PaperApp padding={{ xs: 1.5, sm: 2 }} variant="outlined">
      <StackApp spacing={1.5}>
        <TextApp weight={TextAppWeight.SemiBold}>{descricao}</TextApp>
        <FormRoot.FormRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <InputApp
              disabled={readonly}
              id={`preco-atacado-${variacaoId}`}
              label="Preço de atacado"
              onChange={(_, value) => onChange({ valorUnitarioAtacado: Number(value) })}
              startAdornment="R$"
              type={InputAppType.Currency}
              value={item.valorUnitarioAtacado}
            />
          </FormRoot.FormItemRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <InputApp
              disabled={readonly}
              id={`preco-varejo-${variacaoId}`}
              label="Preço de varejo"
              onChange={(_, value) => onChange({ valorUnitarioVarejo: Number(value) })}
              startAdornment="R$"
              type={InputAppType.Currency}
              value={item.valorUnitarioVarejo}
            />
          </FormRoot.FormItemRow>
        </FormRoot.FormRow>
      </StackApp>
    </PaperApp>
  )
}

export function ProdutoFormPage({ action }: ProdutoFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter, obterTabelaDePreco } = useApiProduto()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const [tab, setTab] = useState(0)
  const [tabelaDePrecoId, setTabelaDePrecoId] = useState<string>()
  const [tabelaDePrecoDescricao, setTabelaDePrecoDescricao] = useState('')
  const [itensTabelaDePreco, setItensTabelaDePreco] = useState<ProdutoTabelaDePrecoItem[]>([])
  const form = useFormikAdapter<Partial<Produto>>({
    initialValues: produtoInitialValues,
    validationSchema: produtoValidationSchema,
    onSubmit: async (values) => {
      if (!imagemBase64Valida(values.novaFoto)) {
        form.setError(ProdutoFormField.NovaFoto, ProdutoFoto.InvalidMessage)
        return
      }

      const payload: ProdutoPayload = {
        ...(action === FormAction.Edit && id ? { id } : {}),
        categoriaId: values.categoriaId,
        descricao: values.descricao,
        especificacaoTecnica: values.especificacaoTecnica,
        itensTabelaDePreco,
        novaFoto: values.novaFoto ? removerPrefixoBase64(values.novaFoto) : undefined,
        pesosIds: values.pesos?.map((peso: Peso) => peso.id) ?? [],
        referencia: values.referencia,
        tabelaDePrecoId,
        tamanhosIds: values.tamanhos?.map((tamanho: Tamanho) => tamanho.id) ?? [],
        vendaSomenteComEstoqueDisponivel: Boolean(values.vendaSomenteComEstoqueDisponivel),
      }
      const response = action === FormAction.Edit
        ? await atualizar.fetch(payload)
        : await criar.fetch(payload)
      if (response) navigate(PrivateRoutePath.Produto)
    },
  })

  useEffect(() => {
    async function iniciar() {
      const tabelaResponse = await obterTabelaDePreco.fetch(action === FormAction.Create ? undefined : id)
      if (tabelaResponse?.id) {
        setTabelaDePrecoId(tabelaResponse.id)
        setTabelaDePrecoDescricao(tabelaResponse.descricao)
        setItensTabelaDePreco(tabelaResponse.itensTabelaDePreco ?? [])
      }

      if (action === FormAction.Create || !id) return
      const response = await obter.fetch(id)
      if (response) {
        form.setValue({
          categoria: response.categoria,
          categoriaId: response.categoriaId,
          descricao: response.descricao,
          especificacaoTecnica: response.especificacaoTecnica ?? '',
          foto: response.foto ?? '',
          novaFoto: '',
          pesos: response.pesos ?? [],
          referencia: response.referencia ?? '',
          tamanhos: response.tamanhos ?? [],
          vendaSomenteComEstoqueDisponivel: response.vendaSomenteComEstoqueDisponivel,
        })
      }
    }

    iniciar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  function atualizarVariacoes<T extends Peso | Tamanho>(tipo: 'pesoId' | 'tamanhoId', values: T[]) {
    const ids = new Set(values.map((value) => value.id))
    setItensTabelaDePreco((current) => [
      ...current.filter((item) => !item[tipo] || ids.has(item[tipo])),
      ...values
        .filter((value) => !current.some((item) => item[tipo] === value.id))
        .map((value) => ({
          [tipo]: value.id,
          produtoId: id,
          valorUnitarioAtacado: 0,
          valorUnitarioVarejo: 0,
        })),
    ])
  }

  function atualizarItem(tipo: 'pesoId' | 'tamanhoId', variacaoId: string, values: Partial<ProdutoTabelaDePrecoItem>) {
    setItensTabelaDePreco((current) => current.map((item) =>
      item[tipo] === variacaoId ? { ...item, ...values } : item,
    ))
  }

  const loading = obter.loading || criar.loading || atualizar.loading || obterTabelaDePreco.loading

  return (
    <FormRoot.Form action={action} loading={loading} submit={form.onSubmit} textoButton="Salvar" urlVoltar={PrivateRoutePath.Produto}>
      <TabsApp
        ariaLabel="Seções do cadastro de produto"
        items={produtoTabs}
        onChange={setTab}
        value={tab}
      />

      {tab === ProdutoTab.Produto && (
        <StackApp spacing={2}>
        <FormRoot.FormRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <InputApp
              disabled={readonly}
              error={form.error(ProdutoFormField.Descricao)}
              helperText={form.helperText(ProdutoFormField.Descricao)}
              id={ProdutoFormField.Descricao}
              label="Descrição"
              maxLength={ProdutoField.MaxLength}
              onBlur={form.onBlur}
              onChange={form.onChange}
              required
              value={form.values.descricao}
            />
          </FormRoot.FormItemRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <InputApp disabled={readonly} id={ProdutoFormField.EspecificacaoTecnica} label="Especificação técnica" maxLength={ProdutoField.MaxLength} onChange={form.onChange} value={form.values.especificacaoTecnica} />
          </FormRoot.FormItemRow>
        </FormRoot.FormRow>
        <FormRoot.FormRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <InputApp disabled={readonly} id={ProdutoFormField.Referencia} label="Referência" maxLength={ProdutoField.MaxLength} onChange={form.onChange} value={form.values.referencia} />
          </FormRoot.FormItemRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <CategoriaDropDown
              error={form.error(ProdutoFormField.CategoriaId)}
              helperText={form.helperText(ProdutoFormField.CategoriaId)}
              onChange={(_, categoria) => form.setValue({ categoria, categoriaId: categoria?.id })}
              readonly={readonly}
              required
              value={form.values.categoria}
            />
          </FormRoot.FormItemRow>
        </FormRoot.FormRow>
        <FormRoot.FormRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <DropDownMultiSelectApp
              id={ProdutoFormField.Pesos}
              label="Pesos"
              onChange={(pesos) => { form.setValue({ pesos }); atualizarVariacoes('pesoId', pesos) }}
              readonly={readonly}
              url={`${ApiRoutePath.Peso}/list`}
              values={form.values.pesos ?? []}
            />
          </FormRoot.FormItemRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <DropDownMultiSelectApp
              id={ProdutoFormField.Tamanhos}
              label="Tamanhos"
              onChange={(tamanhos) => { form.setValue({ tamanhos }); atualizarVariacoes('tamanhoId', tamanhos) }}
              readonly={readonly}
              url={`${ApiRoutePath.Tamanho}/list`}
              values={form.values.tamanhos ?? []}
            />
          </FormRoot.FormItemRow>
        </FormRoot.FormRow>
        <FormRoot.FormRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <InputApp
              checked={Boolean(form.values.vendaSomenteComEstoqueDisponivel)}
              disabled={readonly}
              id={ProdutoFormField.VendaSomenteComEstoqueDisponivel}
              label="Venda somente com estoque disponível"
              onChange={form.onChange}
              type={InputAppType.Checkbox}
            />
          </FormRoot.FormItemRow>
        </FormRoot.FormRow>
        <FormRoot.FormRow>
          <FormRoot.FormItemRow xs={12} md={6}>
            <ImageUploadApp
              alt={form.values.descricao || 'Foto do produto'}
              error={form.error(ProdutoFormField.NovaFoto)}
              helperText={form.helperText(ProdutoFormField.NovaFoto)}
              onChange={(value) => form.onChange(ProdutoFormField.NovaFoto, value)}
              previewLabel="Pré-visualização da foto"
              readonly={readonly}
              value={form.values.novaFoto || form.values.foto}
            />
          </FormRoot.FormItemRow>
        </FormRoot.FormRow>
        </StackApp>
      )}

      {tab === ProdutoTab.Precos && (
        <StackApp spacing={2}>
        {tabelaDePrecoId ? (
          <>
            <TextApp color={TextAppColor.Primary} weight={TextAppWeight.SemiBold}>Tabela ativa: {tabelaDePrecoDescricao}</TextApp>
            {(form.values.pesos ?? []).map((peso) => {
              const item = itensTabelaDePreco.find((current) => current.pesoId === peso.id)
              return item && <PrecoVariacao descricao={`Peso: ${peso.descricao}`} item={item} key={`peso-${peso.id}`} onChange={(values) => atualizarItem('pesoId', peso.id, values)} readonly={readonly} />
            })}
            {(form.values.tamanhos ?? []).map((tamanho) => {
              const item = itensTabelaDePreco.find((current) => current.tamanhoId === tamanho.id)
              return item && <PrecoVariacao descricao={`Tamanho: ${tamanho.descricao}`} item={item} key={`tamanho-${tamanho.id}`} onChange={(values) => atualizarItem('tamanhoId', tamanho.id, values)} readonly={readonly} />
            })}
            {(form.values.pesos?.length ?? 0) === 0 && (form.values.tamanhos?.length ?? 0) === 0 && (
              <TextApp color={TextAppColor.Secondary}>Selecione pesos ou tamanhos para informar os preços.</TextApp>
            )}
          </>
        ) : <TextApp color={TextAppColor.Secondary}>Não há uma tabela de preço ativa.</TextApp>}
        </StackApp>
      )}
    </FormRoot.Form>
  )
}
