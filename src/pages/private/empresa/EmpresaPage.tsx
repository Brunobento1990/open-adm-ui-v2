import { useEffect } from 'react'
import { useApiEmpresa } from '../../../api/useApiEmpresa'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ImageUploadApp } from '../../../components/ImageUploadApp/ImageUploadApp'
import { FormRoot } from '../../../form'
import { useAuth } from '../../../hook/useAuth'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import { EmpresaFormField, type Empresa } from '../../../types/EmpresaTypes'
import { limparCnpj, limparTelefone } from '../../../utils/documentUtils'
import { imagemBase64Valida } from '../../../utils/imageUtils'

const empresaInitialValues: Partial<Empresa> = {
  [EmpresaFormField.RazaoSocial]: '',
  [EmpresaFormField.NomeFantasia]: '',
  [EmpresaFormField.Cnpj]: '',
  [EmpresaFormField.Telefone]: '',
  [EmpresaFormField.Logo]: '',
}

const empresaValidationSchema = new YupAdapter()
  .string(EmpresaFormField.RazaoSocial)
  .string(EmpresaFormField.NomeFantasia)
  .string(EmpresaFormField.Cnpj)
  .build()

const Logo = {
  InvalidMessage: 'Não foi possível processar a imagem selecionada. Selecione outra imagem.',
} as const

export function EmpresaPage() {
  const { atualizar, obter } = useApiEmpresa()
  const { atualizarEmpresa } = useAuth()
  const form = useFormikAdapter<Partial<Empresa>>({
    initialValues: empresaInitialValues,
    validationSchema: empresaValidationSchema,
    onSubmit: async (values) => {
      if (!imagemBase64Valida(values.logo)) {
        form.setError(EmpresaFormField.Logo, Logo.InvalidMessage)
        return
      }

      const response = await atualizar.fetch({
        razaoSocial: values.razaoSocial,
        nomeFantasia: values.nomeFantasia,
        cnpj: limparCnpj(values.cnpj),
        telefone: limparTelefone(values.telefone),
        logo: values.logo,
      })

      if (!response?.resultado) return

      const empresaAtualizada = await obter.fetch()
      if (!empresaAtualizada) return

      atualizarEmpresa(empresaAtualizada)
      form.setValue(empresaAtualizada)
    },
  })

  useEffect(() => {
    async function buscarEmpresa() {
      const response = await obter.fetch()
      if (!response) return

      form.setValue({
        razaoSocial: response.razaoSocial,
        nomeFantasia: response.nomeFantasia,
        cnpj: response.cnpj,
        telefone: response.telefone ?? '',
        logo: response.logo ?? '',
      })
    }

    buscarEmpresa()
    // A consulta deve ocorrer somente quando a tela for montada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FormRoot.Form
      loading={obter.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={8}>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12} md={6}>
              <InputApp
                error={form.error(EmpresaFormField.RazaoSocial)}
                helperText={form.helperText(EmpresaFormField.RazaoSocial)}
                id={EmpresaFormField.RazaoSocial}
                label="Razão social"
                maxLength={200}
                name={EmpresaFormField.RazaoSocial}
                onBlur={form.onBlur}
                onChange={form.onChange}
                placeholder="Informe a razão social"
                required
                type={InputAppType.Text}
                value={form.values.razaoSocial}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow xs={12} md={6}>
              <InputApp
                error={form.error(EmpresaFormField.NomeFantasia)}
                helperText={form.helperText(EmpresaFormField.NomeFantasia)}
                id={EmpresaFormField.NomeFantasia}
                label="Nome fantasia"
                maxLength={200}
                name={EmpresaFormField.NomeFantasia}
                onBlur={form.onBlur}
                onChange={form.onChange}
                placeholder="Informe o nome fantasia"
                required
                type={InputAppType.Text}
                value={form.values.nomeFantasia}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow xs={12} md={6}>
              <InputApp
                error={form.error(EmpresaFormField.Cnpj)}
                helperText={form.helperText(EmpresaFormField.Cnpj)}
                id={EmpresaFormField.Cnpj}
                label="CNPJ"
                maxLength={18}
                name={EmpresaFormField.Cnpj}
                onBlur={form.onBlur}
                onChange={form.onChange}
                placeholder="Informe o CNPJ"
                required
                type={InputAppType.Text}
                value={form.values.cnpj}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow xs={12} md={6}>
              <InputApp
                id={EmpresaFormField.Telefone}
                label="Telefone"
                maxLength={20}
                name={EmpresaFormField.Telefone}
                onBlur={form.onBlur}
                onChange={form.onChange}
                placeholder="Informe o telefone"
                type={InputAppType.Tel}
                value={form.values.telefone}
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={4}>
          <ImageUploadApp
            alt={form.values.nomeFantasia ? `Logo da ${form.values.nomeFantasia}` : 'Logo da empresa'}
            emptyLabel="Nenhuma logo selecionada"
            error={form.error(EmpresaFormField.Logo)}
            helperText={form.helperText(EmpresaFormField.Logo)}
            onChange={(value) => form.onChange(EmpresaFormField.Logo, value)}
            previewLabel="Pré-visualização da logo"
            value={form.values.logo}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
    </FormRoot.Form>
  )
}
