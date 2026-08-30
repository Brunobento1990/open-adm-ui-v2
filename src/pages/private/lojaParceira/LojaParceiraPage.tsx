import { Box } from '@mui/material'
import { ApiRoutePath, LojaParceiraApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { LojaParceiraFormField } from '../../../types/LojaParceiraTypes'
import { formatarTelefone } from '../../../utils/documentUtils'

const LojaParceiraTable = {
  Name: 'lojas-parceiras',
} as const

export function LojaParceiraPage() {
  const { borderRadius } = useThemeApp()
  const columns: TypeColumns[] = [
    {
      field: LojaParceiraFormField.Foto,
      headerName: 'Foto',
      minWidth: 130,
      cellRenderer: ({ data }: { data: { foto?: string } }) => data.foto ? (
        <Box
          alt="Logo da loja parceira"
          component="img"
          src={data.foto}
          sx={{ borderRadius, height: 50, objectFit: 'contain', width: 100 }}
        />
      ) : null,
    },
    {
      field: LojaParceiraFormField.Nome,
      headerName: 'Nome',
      flex: 1,
      minWidth: 220,
      sortable: true,
    },
    {
      field: LojaParceiraFormField.Contato,
      headerName: 'Contato',
      minWidth: 170,
      cellRenderer: ({ data }: { data: { contato?: string } }) => (
        formatarTelefone(data.contato)
      ),
    },
  ]

  return (
    <TableIndex
      columns={columns}
      nomeDaTabela={LojaParceiraTable.Name}
      orderBy={LojaParceiraFormField.Nome}
      url={ApiRoutePath.LojaParceira}
      urlAdd={PrivateRoutePath.LojaParceiraAdicionar}
      urlDelete={`${ApiRoutePath.LojaParceira}${LojaParceiraApiRoutePath.Excluir}`}
      urlEdit={PrivateRoutePath.LojaParceiraEditar}
      urlView={PrivateRoutePath.LojaParceiraVisualizar}
    />
  )
}
