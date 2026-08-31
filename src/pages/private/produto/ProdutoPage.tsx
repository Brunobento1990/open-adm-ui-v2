import type { ICellRendererParams } from 'ag-grid-community'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { AvatarApp } from '../../../components/AvatarApp/AvatarApp'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppJustifyContent,
} from '../../../components/BoxApp/boxAppTypes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp } from '../../../components/TextApp/TextApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import type { Produto } from '../../../types/ProdutoTypes'

const ProdutoTable = {
  Name: 'produtos',
} as const

const ProdutoColumnField = {
  Categoria: 'categoria.descricao',
  Descricao: 'descricao',
  Referencia: 'referencia',
} as const

export function ProdutoPage() {
  const columns: TypeColumns[] = [
    {
      field: ProdutoColumnField.Descricao,
      headerName: 'Produto',
      flex: 1,
      minWidth: 240,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<Produto>) => data && (
        <BoxApp
          alignItems={BoxAppAlignItems.Center}
          display={BoxAppDisplay.Flex}
          gap="1rem"
          height="100%"
          justifyContent={BoxAppJustifyContent.Center}
        >
          <AvatarApp
            alt={`Produto ${data.descricao}`}
            src={data.foto}
            sx={{ height: 30, width: 30 }}
            variant="rounded"
          >
            {data.descricao.charAt(0).toUpperCase()}
          </AvatarApp>
          <TextApp noWrap>{data.descricao}</TextApp>
        </BoxApp>
      ),
    },
    {
      field: ProdutoColumnField.Referencia,
      headerName: 'Referência',
      minWidth: 140,
      sortable: true,
    },
    {
      field: ProdutoColumnField.Categoria,
      headerName: 'Categoria',
      minWidth: 180,
      sortable: true,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={ProdutoTable.Name}
      orderBy={ProdutoColumnField.Descricao}
      rowHeight={66}
      url={ApiRoutePath.Produto}
      urlAdd={PrivateRoutePath.ProdutoAdicionar}
      urlEdit={PrivateRoutePath.ProdutoEditar}
      urlView={PrivateRoutePath.ProdutoVisualizar}
    />
  )
}
