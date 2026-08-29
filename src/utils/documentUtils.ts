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
