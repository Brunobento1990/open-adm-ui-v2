import { useApiCliente } from '../../api/useApiCliente'
import { FormRoot } from '../../form'
import { useFormikAdapter } from '../../hook/useFormikAdapter'
import type { Cliente } from '../../types/ClienteTypes'
import { ModalChildren } from '../Modal/ModalChildren'
import { ClienteFormFields } from './ClienteFormFields'
import {
  clienteInitialValues,
  clienteValidationSchema,
  prepararCliente,
} from './clienteFormConfig'

type ClienteCreateModalProps = {
  open: boolean
  onClose: () => void
  onSaved: (cliente: Cliente) => void
}

export function ClienteCreateModal({ open, onClose, onSaved }: ClienteCreateModalProps) {
  const { criar } = useApiCliente()
  const form = useFormikAdapter<Partial<Cliente>>({
    initialValues: clienteInitialValues,
    validationSchema: clienteValidationSchema,
    onSubmit: async (values) => {
      const response = await criar.fetch(prepararCliente(values))
      if (!response) return

      onSaved(response)
      await form.limpar()
      onClose()
    },
  })

  const close = () => {
    if (criar.loading) return
    void form.limpar()
    onClose()
  }

  return (
    <ModalChildren
      close={close}
      fullWidth
      maxWidth="sm"
      open={open}
      titulo="Novo cliente"
      retirarFooter
    >
      <FormRoot.Form
        loading={criar.loading}
        padding="0"
        paddingFooter="1rem 0 0"
        stopPropagation
        submit={form.onSubmit}
        textoButton="Salvar"
      >
        <ClienteFormFields form={form} fullWidth />
      </FormRoot.Form>
    </ModalChildren>
  )
}
