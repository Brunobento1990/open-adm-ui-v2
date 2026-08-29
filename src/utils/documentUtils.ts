function somenteDigitos(value?: string): string | undefined {
  const valueLimpo = value?.replace(/\D/g, '')
  return valueLimpo || undefined
}

export function limparCpf(cpf?: string): string | undefined {
  return somenteDigitos(cpf)
}

export function limparCnpj(cnpj?: string): string | undefined {
  return somenteDigitos(cnpj)
}

export function limparTelefone(telefone?: string): string | undefined {
  return somenteDigitos(telefone)
}

export function formatarCpf(cpf?: string): string {
  const digits = somenteDigitos(cpf) ?? ''
  if (digits.length !== 11) return cpf ?? ''
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatarCnpj(cnpj?: string): string {
  const digits = somenteDigitos(cnpj) ?? ''
  if (digits.length !== 14) return cnpj ?? ''
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export function formatarTelefone(telefone?: string): string {
  const digits = somenteDigitos(telefone) ?? ''
  if (digits.length === 11) return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  return telefone ?? ''
}
