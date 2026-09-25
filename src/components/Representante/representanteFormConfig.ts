import { YupAdapter } from '../../lib/YupAdapter'
import {
  RepresentanteFormField,
  type CriarRepresentanteRequest,
  type EditarRepresentanteRequest,
  type RepresentanteFormValues,
} from '../../types/RepresentanteTypes'
import { limparCpf, limparTelefone } from '../../utils/documentUtils'

export const representanteInitialValues: RepresentanteFormValues = {
  [RepresentanteFormField.Nome]: '',
  [RepresentanteFormField.Cpf]: '',
  [RepresentanteFormField.Email]: '',
  [RepresentanteFormField.Telefone]: '',
  [RepresentanteFormField.Senha]: '',
  [RepresentanteFormField.ConfirmacaoSenha]: '',
}

export const representanteValidationSchema = new YupAdapter()
  .string(RepresentanteFormField.Nome, 'Informe o nome')
  .optionalEmail(RepresentanteFormField.Email)
  .build()

function normalizarCampos(values: RepresentanteFormValues) {
  return {
    nome: values.nome.trim(),
    cpf: limparCpf(values.cpf),
    email: values.email.trim() || undefined,
    telefone: limparTelefone(values.telefone),
  }
}

export function prepararCriacaoRepresentante(
  values: RepresentanteFormValues,
): CriarRepresentanteRequest {
  return {
    ...normalizarCampos(values),
    senha: values.senha || undefined,
    confirmarSenha: values.confirmacaoSenha || undefined,
  }
}

export function prepararEdicaoRepresentante(
  id: string,
  values: RepresentanteFormValues,
): EditarRepresentanteRequest {
  return {
    id,
    ...normalizarCampos(values),
  }
}
