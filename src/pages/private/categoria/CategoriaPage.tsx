import { ApiRoutePath, CategoriaApiRoutePath } from '../../../api/apiRoutes'
import { AvatarApp } from '../../../components/AvatarApp/AvatarApp'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppJustifyContent
} from '../../../components/BoxApp/boxAppTypes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp } from '../../../components/TextApp/TextApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { CategoriaFormField, type Categoria } from '../../../types/CategoriaTypes'

const CategoriaTable = {
  Name: 'categorias',
} as const

export function CategoriaPage() {
  const columns: TypeColumns[] = [
    {
      field: CategoriaFormField.Descricao,
      headerName: 'Categoria',
      flex: 1,
      minWidth: 240,
      sortable: true,
      cellRenderer: ({ data }: { data: Categoria }) => (
        <BoxApp
          alignItems={BoxAppAlignItems.Center}
          display={BoxAppDisplay.Flex}
          //flexDirection={BoxAppFlexDirection.Column}
          gap="1rem"
          height="100%"
          justifyContent={BoxAppJustifyContent.Center}
        >
          <AvatarApp
            alt={`Categoria ${data.descricao}`}
            src={data.foto}
            sx={{ height: 48, width: 48 }}
            variant="rounded"
          >
            {data.descricao.charAt(0).toUpperCase()}
          </AvatarApp>
          <TextApp noWrap>{data.descricao}</TextApp>
        </BoxApp>
      ),
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={CategoriaTable.Name}
      orderBy={CategoriaFormField.Descricao}
      rowHeight={82}
      url={ApiRoutePath.Categoria}
      urlAdd={PrivateRoutePath.CategoriaAdicionar}
      urlDelete={`${ApiRoutePath.Categoria}${CategoriaApiRoutePath.Excluir}`}
      urlEdit={PrivateRoutePath.CategoriaEditar}
      urlView={PrivateRoutePath.CategoriaVisualizar}
    />
  )
}
