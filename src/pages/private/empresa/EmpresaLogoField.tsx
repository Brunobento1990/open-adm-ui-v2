import { Icon } from '@iconify/react'
import { Box, Button, FormHelperText, Stack } from '@mui/material'
import type { ChangeEvent } from 'react'
import { TextApp, TextAppColor } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'

const EmpresaLogo = {
  Accept: 'image/*',
  Icon: 'solar:upload-linear',
  InputId: 'empresa-logo-arquivo',
} as const

type EmpresaLogoFieldProps = {
  error?: boolean
  helperText?: string
  nomeFantasia?: string
  onChange: (value: string) => void | Promise<void>
  value?: string
}

export function EmpresaLogoField({
  error,
  helperText,
  nomeFantasia,
  onChange,
  value,
}: EmpresaLogoFieldProps) {
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
      <TextApp color={TextAppColor.Secondary}>Pré-visualização da logo</TextApp>
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
            alt={nomeFantasia ? `Logo da ${nomeFantasia}` : 'Logo da empresa'}
            component="img"
            src={value}
            sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
          />
        ) : (
          <TextApp color={TextAppColor.Secondary}>Nenhuma logo selecionada</TextApp>
        )}
      </Box>
      <Button component="label" startIcon={<Icon icon={EmpresaLogo.Icon} />} variant="outlined">
        Selecionar imagem
        <input
          accept={EmpresaLogo.Accept}
          hidden
          id={EmpresaLogo.InputId}
          onChange={selecionarArquivo}
          type="file"
        />
      </Button>
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </Stack>
  )
}
