import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import type { ClienteVenda } from '../../types/ClienteVendaTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

type ClienteRepresentanteDropDownProps = {
  error?: boolean
  helperText?: string
  label?: string
  onChange: (value?: ClienteVenda) => void
  required?: boolean
  value?: ClienteVenda
}

export function ClienteRepresentanteDropDown(props: ClienteRepresentanteDropDownProps) {
  return (
    <DropDownAutoFetchOpenApp
      body={{ asc: true, skip: 1, take: 100 }}
      error={props.error}
      helperText={props.helperText}
      id="usuarioId"
      keyLabel="nome"
      label={props.label ?? 'Cliente'}
      onChange={(_, value) => props.onChange(value)}
      orderBy="nome"
      required={props.required ?? true}
      url={`${ApiRoutePath.ClienteRepresentante}${ApiResourceRoutePath.Paginacao}`}
      value={props.value}
    />
  )
}
