import { ApiRoutePath, TabelaDePrecoApiRoutePath } from '../../api/apiRoutes'
import type { ItemCatalogoRepresentante } from '../../types/TabelaDePrecoTypes'
import { DropDownAutoFetchOpenApp } from './DropDownAutoFetchOpenApp'

const ItemCatalogoRepresentanteDropDownConfig = {
  Id: 'itemTabelaDePrecoId',
  Label: 'Produto',
  Page: 0,
  PageSize: 100,
} as const

type ItemCatalogoRepresentanteDropDownProps = {
  onChange: (item?: ItemCatalogoRepresentante) => void
  readonly?: boolean
  tabelaDePrecoId?: string
  value?: ItemCatalogoRepresentante
}

export function ItemCatalogoRepresentanteDropDown({
  onChange,
  readonly,
  tabelaDePrecoId,
  value,
}: ItemCatalogoRepresentanteDropDownProps) {
  return (
    <DropDownAutoFetchOpenApp
      body={{
        asc: true,
        skip: ItemCatalogoRepresentanteDropDownConfig.Page,
        tabelaDePrecoId,
        take: ItemCatalogoRepresentanteDropDownConfig.PageSize,
      }}
      id={ItemCatalogoRepresentanteDropDownConfig.Id}
      keyLabel="descricao"
      label={ItemCatalogoRepresentanteDropDownConfig.Label}
      onChange={(_, item) => onChange(item)}
      readonly={readonly || !tabelaDePrecoId}
      value={value}
      url={`${ApiRoutePath.TabelaDePrecoRepresentante}${TabelaDePrecoApiRoutePath.ItensPaginacao}`}
    />
  )
}
