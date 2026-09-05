import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

type ClienteEcommerce = { id: string; nome: string }
type Props = {
  error?: boolean
  helperText?: string
  label?: string
  onChange: (value?: ClienteEcommerce) => void
  required?: boolean
  value?: ClienteEcommerce
}
export function ClienteEcommerceDropDown(props: Props) {
  return (
    <DropDownAutoFetchOpenApp
      error={props.error}
      helperText={props.helperText}
      id="usuarioId"
      keyLabel="nome"
      label={props.label ?? 'Cliente'}
      onChange={(_, value) => props.onChange(value)}
      required={props.required ?? true}
      url="usuarios/paginacao-drop-down"
      value={props.value}
    />
  )
}
