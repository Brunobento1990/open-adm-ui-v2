import { Stack, Typography } from '@mui/material'
import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import { ApiMethod } from '../../hook/useApi'
import type { Produto } from '../../types/ProdutoTypes'
import { ProdutoFormField } from '../../types/ProdutoTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

const ProdutoDropDownConfig = {
  Id: 'produtoId',
  Label: 'Produto',
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
      error={error}
      helperText={helperText}
      id={id}
      keyLabel={[ProdutoFormField.Descricao, ProdutoFormField.Referencia]}
      label={label}
      onBlur={onBlur}
      onChange={(_, produto) => onChange?.(id, produto)}
      method={ApiMethod.Get}
      readonly={readonly}
      required={required}
      value={value}
      utilizarURLSearch
      url={`${ApiRoutePath.Produto}${ApiResourceRoutePath.Dropdown}`}
      renderOption={(props: any, produto: any) => {
        const { key, ...optionProps } = props;
        return (
          <Stack key={key} {...optionProps} direction="row" spacing={1.25} sx={{ alignItems: 'center', height: '100%' }}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              {produto.descricao}
            </Typography>
          </Stack>
        );
      }}

    />
  )
}
