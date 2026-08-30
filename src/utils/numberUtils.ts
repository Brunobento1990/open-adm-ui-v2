export function obterNumeroOpcional(value?: number) {
  return value === undefined || String(value).trim() === ''
    ? undefined
    : Number(value)
}
