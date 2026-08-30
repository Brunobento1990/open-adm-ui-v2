import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiBanner } from '../../../api/useApiBanner'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ImageUploadApp } from '../../../components/ImageUploadApp/ImageUploadApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { BannerFormField, type Banner } from '../../../types/BannerTypes'
import { FormAction, type IFormTypes } from '../../../types/Form'
import { removerPrefixoBase64 } from '../../../utils/imageUtils'

const bannerInitialValues: Partial<Banner> = {
  [BannerFormField.Ativo]: true,
  [BannerFormField.Foto]: '',
  [BannerFormField.NovaFoto]: undefined,
}

export function BannerFormPage({ action }: IFormTypes) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiBanner()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<Banner>>({
    initialValues: bannerInitialValues,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        novaFoto: values.novaFoto
          ? removerPrefixoBase64(values.novaFoto)
          : undefined,
      }
      const response = action === FormAction.Edit
        ? await atualizar.fetch(payload)
        : await criar.fetch(payload)

      if (response) navigate(PrivateRoutePath.Banner)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarBanner() {
      const response = await obter.fetch(id as string)
      if (response) form.setValue(response)
    }

    buscarBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Banner}
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={8}>
          <ImageUploadApp
            alt="Banner"
            onChange={(value) => form.onChange(BannerFormField.NovaFoto, value)}
            previewLabel="Pré-visualização do banner"
            readonly={readonly}
            value={form.values.novaFoto || form.values.foto}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={4}>
          <InputApp
            checked={Boolean(form.values.ativo)}
            disabled={readonly}
            id={BannerFormField.Ativo}
            label="Ativo"
            name={BannerFormField.Ativo}
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
