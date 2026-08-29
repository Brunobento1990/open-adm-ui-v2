import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import type { TabelaDePreco } from '../../types/TabelaDePrecoTypes'
import { TabelaDePrecoFormField } from '../../types/TabelaDePrecoTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

type TabelaDePrecoDropDownProps = {
  error?: boolean
  helperText?: string
  onChange: (tabela?: TabelaDePreco) => void
  readonly?: boolean
  value?: TabelaDePreco
}

export function TabelaDePrecoDropDown(props: TabelaDePrecoDropDownProps) {
  return (
    <DropDownAutoFetchOpenApp
      body={{ asc: true, listarInativo: false, skip: 1, take: 100 }}
      error={props.error}
      helperText={props.helperText}
      id="tabelaDePrecoId"
      keyLabel={TabelaDePrecoFormField.Descricao}
      label="Tabela de preço"
      onChange={(_, value) => props.onChange(value)}
      orderBy={TabelaDePrecoFormField.Descricao}
      readonly={props.readonly}
      required
      value={props.value}
      url={`${ApiRoutePath.TabelaDePreco}${ApiResourceRoutePath.Paginacao}`}
    />
  )
}
