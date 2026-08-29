import { Icon } from '@iconify/react'
import { Box, Button, FormHelperText, Stack } from '@mui/material'
import type { ChangeEvent } from 'react'
import { useThemeApp } from '../../../hook/useThemeApp'
import { TextApp, TextAppColor } from '../../../components/TextApp/TextApp'

const ProdutoFoto = {
  Accept: 'image/*',
  Icon: 'solar:upload-linear',
  InputId: 'produto-foto-arquivo',
} as const

type ProdutoFotoFieldProps = {
  disabled?: boolean
  descricao?: string
  error?: boolean
  helperText?: string
  value?: string
  onChange: (value: string) => void | Promise<void>
}

export function ProdutoFotoField({
  descricao,
  disabled,
  error,
  helperText,
  onChange,
  value,
}: ProdutoFotoFieldProps) {
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
      <TextApp color={TextAppColor.Secondary}>Pré-visualização da foto</TextApp>
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
            alt={descricao || 'Foto do produto'}
            component="img"
            src={value}
            sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
          />
        ) : (
          <TextApp color={TextAppColor.Secondary}>Nenhuma foto selecionada</TextApp>
        )}
      </Box>
      {!disabled && (
        <Button component="label" startIcon={<Icon icon={ProdutoFoto.Icon} />} variant="outlined">
          Selecionar imagem
          <input
            accept={ProdutoFoto.Accept}
            hidden
            id={ProdutoFoto.InputId}
            onChange={selecionarArquivo}
            type="file"
          />
        </Button>
      )}
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </Stack>
  )
}
