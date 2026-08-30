import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiLojaParceira } from '../../../api/useApiLojaParceira'
import { ImageUploadApp } from '../../../components/ImageUploadApp/ImageUploadApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type IFormTypes } from '../../../types/Form'
import {
  LojaParceiraFormField,
  type LojaParceira,
} from '../../../types/LojaParceiraTypes'
import { formatarTelefone, limparTelefone } from '../../../utils/documentUtils'
import { removerPrefixoBase64 } from '../../../utils/imageUtils'

const LojaParceiraField = {
  MaxLength: 255,
} as const

const lojaParceiraInitialValues: Partial<LojaParceira> = {
  [LojaParceiraFormField.Contato]: '',
  [LojaParceiraFormField.Endereco]: '',
  [LojaParceiraFormField.Facebook]: '',
  [LojaParceiraFormField.Foto]: '',
  [LojaParceiraFormField.Instagram]: '',
  [LojaParceiraFormField.Nome]: '',
  [LojaParceiraFormField.NovaFoto]: undefined,
}

const lojaParceiraValidationSchema = new YupAdapter()
  .stringWithTests(
    LojaParceiraFormField.Nome,
    [{
      name: 'maxLength',
      message: `O nome deve ter no máximo ${LojaParceiraField.MaxLength} caracteres`,
      test: (value) => !value || value.length <= LojaParceiraField.MaxLength,
    }],
    'Informe o nome da loja',
  )
  .build()

export function LojaParceiraFormPage({ action }: IFormTypes) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiLojaParceira()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<LojaParceira>>({
    initialValues: lojaParceiraInitialValues,
    validationSchema: lojaParceiraValidationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        contato: limparTelefone(values.contato),
        novaFoto: values.novaFoto
          ? removerPrefixoBase64(values.novaFoto)
          : undefined,
      }
      const response = action === FormAction.Edit
        ? await atualizar.fetch(payload)
        : await criar.fetch(payload)

      if (response) navigate(PrivateRoutePath.LojaParceira)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarLojaParceira() {
      const response = await obter.fetch(id as string)
      if (!response) return

      form.setValue({
        ...response,
        contato: formatarTelefone(response.contato),
      })
    }

    buscarLojaParceira()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.LojaParceira}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            error={form.error(LojaParceiraFormField.Nome)}
            focus
            helperText={form.helperText(LojaParceiraFormField.Nome)}
            id={LojaParceiraFormField.Nome}
            label="Nome"
            maxLength={LojaParceiraField.MaxLength}
            name={LojaParceiraFormField.Nome}
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            value={form.values.nome}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            id={LojaParceiraFormField.Contato}
            label="Contato"
            name={LojaParceiraFormField.Contato}
            onBlur={form.onBlur}
            onChange={form.onChange}
            type={InputAppType.Tel}
            value={form.values.contato}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            id={LojaParceiraFormField.Facebook}
            label="Link do Facebook"
            maxLength={LojaParceiraField.MaxLength}
            name={LojaParceiraFormField.Facebook}
            onBlur={form.onBlur}
            onChange={form.onChange}
            type={InputAppType.Url}
            value={form.values.facebook}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            id={LojaParceiraFormField.Instagram}
            label="Link do Instagram"
            maxLength={LojaParceiraField.MaxLength}
            name={LojaParceiraFormField.Instagram}
            onBlur={form.onBlur}
            onChange={form.onChange}
            type={InputAppType.Url}
            value={form.values.instagram}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            disabled={readonly}
            id={LojaParceiraFormField.Endereco}
            label="Endereço"
            maxLength={LojaParceiraField.MaxLength}
            name={LojaParceiraFormField.Endereco}
            onBlur={form.onBlur}
            onChange={form.onChange}
            value={form.values.endereco}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <ImageUploadApp
            alt={form.values.nome ? `Logo da ${form.values.nome}` : 'Logo da loja parceira'}
            emptyLabel="Nenhuma logo selecionada"
            onChange={(value) => form.onChange(LojaParceiraFormField.NovaFoto, value)}
            previewLabel="Pré-visualização da logo"
            readonly={readonly}
            value={form.values.novaFoto || form.values.foto}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
