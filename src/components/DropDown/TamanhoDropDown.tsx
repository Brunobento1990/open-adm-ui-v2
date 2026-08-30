import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import type { Tamanho } from '../../types/TamanhoTypes'
import { TamanhoFormField } from '../../types/TamanhoTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

const TamanhoDropDownConfig = {
  Id: 'tamanhoId',
  Label: 'Tamanho',
  Page: 1,
  PageSize: 100,
} as const

type TamanhoDropDownProps = {
  error?: boolean
  helperText?: string
  id?: string
  label?: string
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onChange?: (id: string, tamanho?: Tamanho) => void
  readonly?: boolean
  required?: boolean
  value?: Tamanho
}

export function TamanhoDropDown({
  error,
  helperText,
  id = TamanhoDropDownConfig.Id,
  label = TamanhoDropDownConfig.Label,
  onBlur,
  onChange,
  readonly,
  required,
  value,
}: TamanhoDropDownProps) {
  return (
    <DropDownAutoFetchOpenApp
      body={{
        asc: true,
        listarInativo: false,
        skip: TamanhoDropDownConfig.Page,
        take: TamanhoDropDownConfig.PageSize,
      }}
      error={error}
      helperText={helperText}
      id={id}
      keyLabel={TamanhoFormField.Descricao}
      label={label}
      onBlur={onBlur}
      onChange={(_, tamanho) => onChange?.(id, tamanho)}
      orderBy={TamanhoFormField.Descricao}
      readonly={readonly}
      required={required}
      value={value}
      url={`${ApiRoutePath.Tamanho}${ApiResourceRoutePath.Paginacao}`}
    />
  )
}
