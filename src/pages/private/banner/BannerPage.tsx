import { Box } from '@mui/material'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'

const BannerTable = {
  Name: 'banners',
} as const

export function BannerPage() {
  const { borderRadius } = useThemeApp()
  const columns: TypeColumns[] = [
    {
      field: 'foto',
      headerName: 'Foto',
      flex: 1,
      minWidth: 180,
      sortable: true,
      cellRenderer: ({ data }: { data: { foto?: string } }) => data.foto ? (
        <Box
          alt="Banner"
          component="img"
          src={data.foto}
          sx={{ borderRadius, height: 50, objectFit: 'contain', width: 100 }}
        />
      ) : null,
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={BannerTable.Name}
      url={ApiRoutePath.Banner}
      urlAdd={PrivateRoutePath.BannerAdicionar}
      urlEdit={PrivateRoutePath.BannerEditar}
      urlView={PrivateRoutePath.BannerVisualizar}
    />
  )
}
