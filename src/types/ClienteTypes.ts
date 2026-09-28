export enum ClienteFormField {
  Cpf = 'cpf',
  Nome = 'nome',
  Telefone = 'telefone',
}

export interface Cliente {
  id: string
  dataDeCadastro?: string
  dataDeCriacao?: string
  dataDeAtualizacao?: string
  nome: string
  email?: string
  cpf?: string
  cnpj?: string
  telefone?: string
  enderecoUsuario?: EnderecoClienteVenda
  isAtacado?: boolean
  ativo: boolean
}

export interface HistoricoCliente {
  ultimaCompra: string | null
  ticketMedio: string | null
  produtoMaisComprado: string | null
  ultimoPedido: string | null
}
import type { EnderecoClienteVenda } from './ClienteVendaTypes'
