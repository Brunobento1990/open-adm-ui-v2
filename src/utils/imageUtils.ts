const ImageDataUrl = {
  Base64Marker: ';base64,',
  Base64Prefix: 'data:image/',
  Separator: ',',
} as const

export function removerPrefixoBase64(value: string) {
  const separatorIndex = value.indexOf(ImageDataUrl.Separator)
  return separatorIndex >= 0 ? value.slice(separatorIndex + 1) : value
}

export function imagemBase64Valida(value?: string) {
  if (!value || !value.startsWith(ImageDataUrl.Base64Prefix)) return true

  const separatorIndex = value.indexOf(ImageDataUrl.Separator)
  return value.includes(ImageDataUrl.Base64Marker)
    && separatorIndex < value.length - 1
}
