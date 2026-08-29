import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApiCliente } from '../../../api/useApiCliente'
import { ClienteFormFields } from '../../../components/Cliente/ClienteFormFields'
import {
  clienteInitialValues,
  clienteValidationSchema,
  prepararCliente,
} from '../../../components/Cliente/clienteFormConfig'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import type { Cliente } from '../../../types/ClienteTypes'
import { FormAction, type FormAction as FormActionType } from '../../../types/Form'

type ClienteFormPageProps = {
  action: FormActionType
}

export function ClienteFormPage({ action }: ClienteFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const { atualizar, criar, obter } = useApiCliente()
  const { navigate } = useNavigationApp()
  const readonly = action === FormAction.View
  const form = useFormikAdapter<Partial<Cliente>>({
    initialValues: clienteInitialValues,
    validationSchema: clienteValidationSchema,
    onSubmit: async (values) => {
      const cliente = prepararCliente(values)
      const response = action === FormAction.Edit && id
        ? await atualizar.fetch(id, cliente)
        : await criar.fetch(cliente)

      if (response) navigate(PrivateRoutePath.Cliente)
    },
  })

  useEffect(() => {
    if (action === FormAction.Create || !id) return

    async function buscarCliente() {
      const response = await obter.fetch(id as string)
      if (!response) return

      form.setValue({
        cpf: response.cpf ?? '',
        nome: response.nome,
        telefone: response.telefone ?? '',
      })
    }

    buscarCliente()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id])

  return (
    <FormRoot.Form
      action={action}
      loading={obter.loading || criar.loading || atualizar.loading}
      submit={form.onSubmit}
      textoButton="Salvar"
      urlVoltar={PrivateRoutePath.Cliente}
    >
      <ClienteFormFields form={form} readonly={readonly} />
    </FormRoot.Form>
  )
}
