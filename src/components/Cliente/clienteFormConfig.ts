import { YupAdapter } from '../../lib/YupAdapter'
import { ClienteFormField, type Cliente } from '../../types/ClienteTypes'
import { limparCpf, limparTelefone } from '../../utils/documentUtils'

export const clienteInitialValues: Partial<Cliente> = {
  [ClienteFormField.Cpf]: '',
  [ClienteFormField.Nome]: '',
  [ClienteFormField.Telefone]: '',
}

export const clienteValidationSchema = new YupAdapter()
  .string(ClienteFormField.Nome)
  .build()

export function prepararCliente(values: Partial<Cliente>): Partial<Cliente> {
  return {
    cpf: limparCpf(values.cpf),
    nome: values.nome,
    telefone: limparTelefone(values.telefone),
  }
}
