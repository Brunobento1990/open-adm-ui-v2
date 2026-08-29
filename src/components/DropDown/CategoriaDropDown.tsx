import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import type { Categoria } from '../../types/CategoriaTypes'
import { CategoriaFormField } from '../../types/CategoriaTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

const CategoriaDropDownConfig = {
  Id: 'categoriaId',
  Label: 'Categoria',
  Page: 1,
  PageSize: 20,
} as const

type CategoriaDropDownProps = {
  error?: boolean
  helperText?: string
  id?: string
  label?: string
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onChange?: (id: string, categoria?: Categoria) => void
  readonly?: boolean
  required?: boolean
  value?: Categoria
}

export function CategoriaDropDown({
  error,
  helperText,
  id = CategoriaDropDownConfig.Id,
  label = CategoriaDropDownConfig.Label,
  onBlur,
  onChange,
  readonly,
  required,
  value,
}: CategoriaDropDownProps) {
  return (
    <DropDownAutoFetchOpenApp
      body={{
        asc: true,
        listarInativo: false,
        skip: CategoriaDropDownConfig.Page,
        take: CategoriaDropDownConfig.PageSize,
      }}
      error={error}
      helperText={helperText}
      id={id}
      keyLabel={CategoriaFormField.Descricao}
      label={label}
      onBlur={onBlur}
      onChange={(_, categoria) => onChange?.(id, categoria)}
      orderBy={CategoriaFormField.Descricao}
      readonly={readonly}
      required={required}
      value={value}
      url={`${ApiRoutePath.Categoria}${ApiResourceRoutePath.Paginacao}`}
    />
  )
}
