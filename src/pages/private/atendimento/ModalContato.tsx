import { useEffect } from 'react'
import { useApiContato } from '../../../api/useApiContato'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import { ContatoFormField, type IContato } from '../../../types/ContatoTypes'
import { FormContato } from './FormContato'

type ModalContatoProps = {
  contatoId?: string
  open: boolean
  onClose: () => void
  onSaved?: (contato: IContato) => void
}

const contatoInitialValues: IContato = {
  [ContatoFormField.Nome]: '',
  [ContatoFormField.Cpf]: '',
  [ContatoFormField.Telefone]: '',
  [ContatoFormField.Email]: '',
}

const contatoValidationSchema = new YupAdapter()
  .string(ContatoFormField.Nome)
  .build()

export function ModalContato({
  contatoId,
  onSaved,
  open,
  onClose,
}: ModalContatoProps) {
  const { obter, salvar } = useApiContato()
  const form = useFormikAdapter<IContato>({
    initialValues: contatoInitialValues,
    validationSchema: contatoValidationSchema,
    onSubmit: async (values) => {
      const response = await salvar.fetch(values, contatoId)

      if (response) {
        onSaved?.(response)
        await form.limpar()
        onClose()
      }
    },
  })

  async function buscarContato(id: string) {
    const response = await obter.fetch(id)

    if (response) {
      form.setValue(response)
    }
  }

  useEffect(() => {
    if (!open) {
      void form.limpar()
      return
    }

    if (contatoId) {
      void buscarContato(contatoId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contatoId, open])

  return (
    <ModalChildren
      close={onClose}
      fullWidth
      maxWidth="sm"
      open={open}
      titulo={contatoId ? 'Editar contato' : 'Novo contato'}
      retirarFooter
    >
      <FormRoot.Form
        loading={obter.loading || salvar.loading}
        padding="0"
        paddingFooter="1rem 0 0"
        submit={form.onSubmit}
        textoButton="Salvar"
      >
        <FormContato form={form} />
      </FormRoot.Form>
    </ModalChildren>
  )
}
