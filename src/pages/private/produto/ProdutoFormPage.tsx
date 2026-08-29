import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiProduto } from '../../../api/useApiProduto'
import { CategoriaDropDown } from '../../../components/DropDown/CategoriaDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import {
  ProdutoFormField,
  type Produto,
} from '../../../types/ProdutoTypes'
import { ProdutoFotoField } from './ProdutoFotoField'

const produtoInitialValues: Partial<Produto> = {
  [ProdutoFormField.CategoriaId]: '',
  [ProdutoFormField.Descricao]: '',
  [ProdutoFormField.PosicaoDeEstoque]: undefined,
  [ProdutoFormField.Referencia]: '',
  [ProdutoFormField.UrlFoto]: '',
  categoria: undefined,
}

function criarProdutoValidationSchema() {
  return new YupAdapter()
    .string(ProdutoFormField.Descricao)
    .string(ProdutoFormField.CategoriaId)
    .build()
}

const ProdutoFotoSource = {
  Base64Prefix: 'data:image/',
  InvalidMessage: 'Não foi possível processar a imagem selecionada. Selecione outra imagem.',
} as const

function fotoValida(value?: string) {
  if (!value) return true

  if (!value.startsWith(ProdutoFotoSource.Base64Prefix)) return true

  const base64SeparatorIndex = value.indexOf(',')
  return value.includes(';base64,') && base64SeparatorIndex < value.length - 1
}

type ProdutoFormPageProps = {
  action: FormActionType
}

export function ProdutoFormPage({ action }: ProdutoFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiProduto()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<Produto>>({
    initialValues: produtoInitialValues,
    validationSchema: criarProdutoValidationSchema(),
    onSubmit: async (values) => {
      if (!fotoValida(values.urlFoto)) {
        form.setError(ProdutoFormField.UrlFoto, ProdutoFotoSource.InvalidMessage)
        return
      }

      const produto = {
        categoriaId: values.categoriaId,
        descricao: values.descricao,
        referencia: values.referencia,
        urlFoto: values.urlFoto,
        ...(action === FormAction.Create &&
          values.posicaoDeEstoque !== undefined &&
          String(values.posicaoDeEstoque).trim() !== '' && {
            posicaoDeEstoque: Number(values.posicaoDeEstoque),
          }),
      }
      const response = action === FormAction.Edit && id
        ? await atualizar.fetch(id, produto)
        : await criar.fetch(produto)

      if (response) navigate(PrivateRoutePath.Produto)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarProduto() {
      const response = await obter.fetch(id as string)
      if (!response) return

      form.setValue({
        categoriaId: response.categoriaId,
        categoria: response.categoria,
        descricao: response.descricao,
        referencia: response.referencia ?? '',
        urlFoto: response.urlFoto ?? '',
      })
    }

    buscarProduto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Produto}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={8}>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12} md={8}>
              <InputApp
                disabled={readonly}
                error={form.error(ProdutoFormField.Descricao)}
                helperText={form.helperText(ProdutoFormField.Descricao)}
                id={ProdutoFormField.Descricao}
                label="Descrição"
                maxLength={150}
                name={ProdutoFormField.Descricao}
                onBlur={form.onBlur}
                onChange={form.onChange}
                placeholder="Informe a descrição"
                required
                type={InputAppType.Text}
                value={form.values.descricao}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow xs={12} md={4}>
              <InputApp
                disabled={readonly}
                id={ProdutoFormField.Referencia}
                label="Referência"
                maxLength={100}
                name={ProdutoFormField.Referencia}
                onBlur={form.onBlur}
                onChange={form.onChange}
                placeholder="Informe a referência"
                type={InputAppType.Text}
                value={form.values.referencia}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12} md={6}>
              <CategoriaDropDown
                error={form.error(ProdutoFormField.CategoriaId)}
                helperText={form.helperText(ProdutoFormField.CategoriaId)}
                id={ProdutoFormField.CategoriaId}
                onBlur={form.onBlur}
                onChange={(_, categoria) => {
                  form.setValue({
                    categoria,
                    categoriaId: categoria?.id,
                  })
                }}
                readonly={readonly}
                required
                value={form.values.categoria}
              />
            </FormRoot.FormItemRow>
            {action === FormAction.Create && (
              <FormRoot.FormItemRow xs={12} md={6}>
                <InputApp
                  error={form.error(ProdutoFormField.PosicaoDeEstoque)}
                  helperText={form.helperText(ProdutoFormField.PosicaoDeEstoque)}
                  id={ProdutoFormField.PosicaoDeEstoque}
                  label="Posição de estoque"
                  name={ProdutoFormField.PosicaoDeEstoque}
                  onBlur={form.onBlur}
                  onChange={form.onChange}
                  placeholder="Informe a posição de estoque"
                  type={InputAppType.Number}
                  value={form.values.posicaoDeEstoque ?? ''}
                />
              </FormRoot.FormItemRow>
            )}
          </FormRoot.FormRow>

        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={4}>
          <ProdutoFotoField
            descricao={form.values.descricao}
            disabled={readonly}
            error={form.error(ProdutoFormField.UrlFoto)}
            helperText={form.helperText(ProdutoFormField.UrlFoto)}
            onChange={(value) => form.onChange(ProdutoFormField.UrlFoto, value)}
            value={form.values.urlFoto}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
