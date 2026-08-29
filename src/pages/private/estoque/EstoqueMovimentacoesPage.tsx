import { Icon } from '@iconify/react'
import { Avatar, Stack } from '@mui/material'
import type { ICellRendererParams } from 'ag-grid-community'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { TextApp, TextAppColor } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  TipoMovimentacaoEstoqueCorEnum,
  TipoMovimentacaoEstoqueEnum,
  TipoMovimentacaoEstoqueIconeEnum,
  TipoMovimentacaoEstoqueLabel,
  type MovimentacaoEstoque,
} from '../../../types/EstoqueTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'

const EstoqueMovimentacoesTable = {
  Name: 'movimentacoes-de-estoque',
} as const

const EstoqueMovimentacaoColumnField = {
  Categoria: 'estoque.produto.categoria.descricao',
  DataDeCadastro: 'dataDeCadastro',
  Produto: 'estoque.produto.descricao',
  Quantidade: 'quantidade',
  Referencia: 'estoque.produto.referencia',
  TipoMovimentacao: 'tipoMovimentacao',
} as const

export function EstoqueMovimentacoesPage() {
  const { cores } = useThemeApp()
  const tipoMovimentacaoCor = {
    [TipoMovimentacaoEstoqueCorEnum.Entrada]: cores.success,
    [TipoMovimentacaoEstoqueCorEnum.Saida]: cores.error,
  } as const
  const columns: TypeColumns[] = [
    {
      field: EstoqueMovimentacaoColumnField.Produto,
      headerName: 'Produto',
      flex: 1,
      minWidth: 220,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<MovimentacaoEstoque>) => data?.estoque.produto && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar
            alt={data.estoque.produto.descricao}
            src={data.estoque.produto.urlFoto}
            sx={{ height: 30, width: 30 }}
          />
          <TextApp>{data.estoque.produto.descricao}</TextApp>
        </Stack>
      ),
    },
    {
      field: EstoqueMovimentacaoColumnField.Referencia,
      headerName: 'Referência',
      minWidth: 160,
      sortable: true,
    },
    {
      field: EstoqueMovimentacaoColumnField.Categoria,
      headerName: 'Categoria',
      minWidth: 180,
      sortable: true,
    },
    {
      field: EstoqueMovimentacaoColumnField.TipoMovimentacao,
      headerName: 'Tipo',
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams<MovimentacaoEstoque>) => {
        if (!data) return null

        const entrada = data.tipoMovimentacao === TipoMovimentacaoEstoqueEnum.Entrada
        const icon = entrada
          ? TipoMovimentacaoEstoqueIconeEnum.Entrada
          : TipoMovimentacaoEstoqueIconeEnum.Saida
        const color = tipoMovimentacaoCor[entrada
          ? TipoMovimentacaoEstoqueCorEnum.Entrada
          : TipoMovimentacaoEstoqueCorEnum.Saida]

        return (
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', color }}>
            <Icon icon={icon} fontSize={20} />
            <TextApp color={TextAppColor.Inherit}>
              {TipoMovimentacaoEstoqueLabel[data.tipoMovimentacao]}
            </TextApp>
          </Stack>
        )
      },
    },
    {
      field: EstoqueMovimentacaoColumnField.Quantidade,
      headerName: 'Quantidade',
      minWidth: 140,
      sortable: true,
    },
    {
      field: EstoqueMovimentacaoColumnField.DataDeCadastro,
      headerName: 'Data',
      minWidth: 180,
      sortable: true,
      valueFormatter: ({ value }) => formatarDataHoraUtcLocal(value),
    },
  ]

  return (
    <TableIndex
      columns={columns}
      desabilitarColunaAtivo
      nomeDaTabela={EstoqueMovimentacoesTable.Name}
      url={ApiRoutePath.MovimentacaoEstoque}
      urlAdd={PrivateRoutePath.EstoqueMovimentacao}
    />
  )
}
