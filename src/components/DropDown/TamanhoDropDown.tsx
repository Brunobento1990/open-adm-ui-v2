import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import { ApiMethod } from '../../hook/useApi'
import type { Tamanho } from '../../types/TamanhoTypes'
import { TamanhoFormField } from '../../types/TamanhoTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

const TamanhoDropDownConfig = {
  Id: 'tamanhoId',
  Label: 'Tamanho',
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
      error={error}
      helperText={helperText}
      id={id}
      keyLabel={TamanhoFormField.Descricao}
      label={label}
      onBlur={onBlur}
      onChange={(_, tamanho) => onChange?.(id, tamanho)}
      method={ApiMethod.Get}
      readonly={readonly}
      required={required}
      value={value}
      utilizarURLSearch
      url={`${ApiRoutePath.Tamanho}${ApiResourceRoutePath.Dropdown}`}
    />
  )
}
