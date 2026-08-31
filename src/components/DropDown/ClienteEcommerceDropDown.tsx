import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

type ClienteEcommerce = { id: string; nome: string }
type Props = {
  error?: boolean
  helperText?: string
  onChange: (value?: ClienteEcommerce) => void
  value?: ClienteEcommerce
}
export function ClienteEcommerceDropDown(props: Props) {
  return (
    <DropDownAutoFetchOpenApp
      error={props.error}
      helperText={props.helperText}
      id="usuarioId"
      keyLabel="nome"
      label="Cliente"
      onChange={(_, value) => props.onChange(value)}
      required
      url="usuarios/paginacao-drop-down"
      value={props.value}
    />
  )
}
