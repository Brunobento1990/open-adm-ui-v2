const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
})

export function formatMoney(value: number) {
  return moneyFormatter.format(value)
}

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}
