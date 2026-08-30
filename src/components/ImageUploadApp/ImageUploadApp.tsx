import { Icon } from '@iconify/react'
import { Box, Button, FormHelperText, Stack } from '@mui/material'
import { useId, type ChangeEvent } from 'react'
import { useThemeApp } from '../../hook/useThemeApp'
import { TextApp, TextAppColor } from '../TextApp/TextApp'

const ImageUpload = {
  Accept: 'image/*',
  ButtonLabel: 'Selecionar imagem',
  EmptyLabel: 'Nenhuma imagem selecionada',
  Icon: 'solar:upload-linear',
  PreviewLabel: 'Pré-visualização da imagem',
} as const

type ImageUploadAppProps = {
  accept?: string
  alt: string
  buttonLabel?: string
  emptyLabel?: string
  error?: boolean
  helperText?: string
  onChange: (value: string) => void | Promise<void>
  previewLabel?: string
  readonly?: boolean
  value?: string
}

export function ImageUploadApp({
  accept = ImageUpload.Accept,
  alt,
  buttonLabel = ImageUpload.ButtonLabel,
  emptyLabel = ImageUpload.EmptyLabel,
  error,
  helperText,
  onChange,
  previewLabel = ImageUpload.PreviewLabel,
  readonly,
  value,
}: ImageUploadAppProps) {
  const inputId = useId()
  const { borderRadius, cores } = useThemeApp()

  function selecionarArquivo(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0]
    if (!arquivo) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result)
    }
    reader.readAsDataURL(arquivo)
    event.target.value = ''
  }

  return (
    <Stack spacing={1}>
      <TextApp color={TextAppColor.Secondary}>{previewLabel}</TextApp>
      <Box
        sx={{
          alignItems: 'center',
          border: '1px dashed',
          borderColor: cores.divider,
          borderRadius,
          display: 'flex',
          height: 180,
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {value ? (
          <Box
            alt={alt}
            component="img"
            src={value}
            sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
          />
        ) : (
          <TextApp color={TextAppColor.Secondary}>{emptyLabel}</TextApp>
        )}
      </Box>
      {!readonly && (
        <Button
          component="label"
          htmlFor={inputId}
          startIcon={<Icon icon={ImageUpload.Icon} />}
          variant="outlined"
        >
          {buttonLabel}
          <input
            accept={accept}
            hidden
            id={inputId}
            onChange={selecionarArquivo}
            type="file"
          />
        </Button>
      )}
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </Stack>
  )
}
