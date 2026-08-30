import { Avatar, Box, Stack, Typography } from '@mui/material'
import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import type { Produto } from '../../types/ProdutoTypes'
import { ProdutoFormField } from '../../types/ProdutoTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

const ProdutoDropDownConfig = {
  Id: 'produtoId',
  Label: 'Produto',
  Page: 1,
  PageSize: 100,
} as const

type ProdutoDropDownProps = {
  error?: boolean
  helperText?: string
  id?: string
  label?: string
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onChange?: (id: string, produto?: Produto) => void
  readonly?: boolean
  required?: boolean
  value?: Produto
}

export function ProdutoDropDown({
  error,
  helperText,
  id = ProdutoDropDownConfig.Id,
  label = ProdutoDropDownConfig.Label,
  onBlur,
  onChange,
  readonly,
  required,
  value,
}: ProdutoDropDownProps) {
  return (
    <DropDownAutoFetchOpenApp
      body={{
        asc: true,
        listarInativo: false,
        skip: ProdutoDropDownConfig.Page,
        take: ProdutoDropDownConfig.PageSize,
      }}
      error={error}
      helperText={helperText}
      id={id}
      keyLabel={[ProdutoFormField.Descricao, ProdutoFormField.Referencia]}
      label={label}
      onBlur={onBlur}
      onChange={(_, produto) => onChange?.(id, produto)}
      orderBy={ProdutoFormField.Descricao}
      readonly={readonly}
      required={required}
      value={value}
      url={`${ApiRoutePath.Produto}${ApiResourceRoutePath.Paginacao}`}
      renderOption={(props: any, produto: any) => {
        const { key, ...optionProps } = props;
        return (
          <Stack key={key} {...optionProps} direction="row" spacing={1.25} sx={{ alignItems: 'center', height: '100%' }}>
            <Avatar
              alt={produto.descricao}
              src={produto.foto}
              variant="rounded"
              sx={{ height: 38, width: 38 }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant="body2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {produto.descricao}
              </Typography>
              <Typography
                color="text.primary"
                noWrap
                variant="body2"
                sx={{ mt: 0.25, opacity: 0.72 }}
              >
                {produto.categoria?.descricao}
              </Typography>
            </Box>
          </Stack>
        );
      }}

    />
  )
}
