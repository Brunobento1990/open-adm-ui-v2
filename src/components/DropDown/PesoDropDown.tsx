import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import { ApiMethod } from '../../hook/useApi'
import type { Peso } from '../../types/PesoTypes'
import { PesoFormField } from '../../types/PesoTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

const PesoDropDownConfig = {
  Id: 'pesoId',
  Label: 'Peso',
} as const

type PesoDropDownProps = {
  error?: boolean
  helperText?: string
  id?: string
  label?: string
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onChange?: (id: string, peso?: Peso) => void
  readonly?: boolean
  required?: boolean
  value?: Peso
}

export function PesoDropDown({
  error,
  helperText,
  id = PesoDropDownConfig.Id,
  label = PesoDropDownConfig.Label,
  onBlur,
  onChange,
  readonly,
  required,
  value,
}: PesoDropDownProps) {
  return (
    <DropDownAutoFetchOpenApp
      error={error}
      helperText={helperText}
      id={id}
      keyLabel={PesoFormField.Descricao}
      label={label}
      onBlur={onBlur}
      onChange={(_, peso) => onChange?.(id, peso)}
      method={ApiMethod.Get}
      readonly={readonly}
      required={required}
      value={value}
      utilizarURLSearch
      url={`${ApiRoutePath.Peso}${ApiResourceRoutePath.Dropdown}`}
    />
  )
}
