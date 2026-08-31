const DateTimeLocale = {
  PtBr: 'pt-BR',
} as const

const TimeZonePattern = /(Z|[+-]\d{2}:\d{2})$/i

function normalizarDataUtc(value: string) {
  return TimeZonePattern.test(value) ? value : `${value}Z`
}

export function formatarDataHoraUtcLocal(value?: string) {
  if (!value) return ''

  const date = new Date(normalizarDataUtc(value))
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(DateTimeLocale.PtBr, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function formatarHoraUtcLocal(value?: string) {
  if (!value) return ''

  const date = new Date(normalizarDataUtc(value))
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(DateTimeLocale.PtBr, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
