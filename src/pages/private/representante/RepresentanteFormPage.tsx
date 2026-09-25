import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiRepresentante } from '../../../api/useApiRepresentante'
import { RepresentanteFormFields } from '../../../components/Representante/RepresentanteFormFields'
import {
  prepararCriacaoRepresentante,
  prepararEdicaoRepresentante,
  representanteInitialValues,
  representanteValidationSchema,
} from '../../../components/Representante/representanteFormConfig'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'
import {
  RepresentanteFormField,
  type RepresentanteFormValues,
} from '../../../types/RepresentanteTypes'
import { formatarCpf, formatarTelefone } from '../../../utils/documentUtils'

type RepresentanteFormPageProps = {
  action: FormActionType
}

export function RepresentanteFormPage({ action }: RepresentanteFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiRepresentante()
  const { navigate } = useNavigationApp()
  const form = useFormikAdapter<RepresentanteFormValues>({
    initialValues: representanteInitialValues,
    validationSchema: representanteValidationSchema,
    onSubmit: async (values) => {
      if (action === FormAction.Create && values.senha !== values.confirmacaoSenha) {
        form.setError(RepresentanteFormField.ConfirmacaoSenha, 'As senhas não coincidem')
        return
      }

      const response =
        action === FormAction.Edit && id
          ? await atualizar.fetch(prepararEdicaoRepresentante(id, values))
          : await criar.fetch(prepararCriacaoRepresentante(values))

      if (response) navigate(PrivateRoutePath.Representante)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarRepresentante() {
      const response = await obter.fetch(id as string)
      if (!response) return

      form.setValue({
        nome: response.nome,
        cpf: formatarCpf(response.cpf),
        email: response.email ?? '',
        telefone: formatarTelefone(response.telefone),
      })
    }

    buscarRepresentante()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      responsiveMobileActions
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Representante}
    >
      <RepresentanteFormFields action={action} form={form} />
    </FormRoot.Form>
  )
}
