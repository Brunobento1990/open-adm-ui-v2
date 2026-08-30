import { Stack } from '@mui/material'
import type { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { ApiRoutePath } from '../../../api/apiRoutes'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { PesoDropDown } from '../../../components/DropDown/PesoDropDown'
import { ProdutoDropDown } from '../../../components/DropDown/ProdutoDropDown'
import { TamanhoDropDown } from '../../../components/DropDown/TamanhoDropDown'
import type { MenuAppItem } from '../../../components/MenuApp/MenuApp'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { TableIndex } from '../../../components/Tabela/TableIndex'
import type { TypeColumns } from '../../../components/Tabela/tabelaComDragTypes'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import type { Estoque, EstoqueFiltro } from '../../../types/EstoqueTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'

const EstoqueTable = { Name: 'estoques' } as const

const EstoqueColumnField = {
  DataDeAtualizacao: 'dataDeAtualizacao',
  Peso: 'peso',
  Produto: 'produto',
  Quantidade: 'quantidade',
  QuantidadeDisponivel: 'quantidadeDisponivel',
  QuantidadeReservada: 'quantidadeReservada',
  Tamanho: 'tamanho',
} as const

export function EstoquePage() {
  const { cores } = useThemeApp()
  const [filtros, setFiltros] = useState<EstoqueFiltro>({})
  const [filtrosTemporarios, setFiltrosTemporarios] = useState<EstoqueFiltro>({})
  const [filtroRevision, setFiltroRevision] = useState(0)
  const [filtrosModalAberto, setFiltrosModalAberto] = useState(false)

  function abrirFiltros() {
    setFiltrosTemporarios(filtros)
    setFiltrosModalAberto(true)
  }

  function aplicarFiltros() {
    setFiltros(filtrosTemporarios)
    setFiltroRevision((current) => current + 1)
    setFiltrosModalAberto(false)
  }

  function limparFiltros() {
    setFiltros({})
    setFiltrosTemporarios({})
    setFiltroRevision((current) => current + 1)
    setFiltrosModalAberto(false)
  }

  function quantidadeBadge(value: number) {
    return (
      <BadgeApp
        cor={value > 0 ? cores.success : cores.warning}
        texto={String(value)}
        width="80px"
      />
    )
  }

  const columns: TypeColumns[] = [
    { field: EstoqueColumnField.Produto, headerName: 'Produto', flex: 1, minWidth: 220 },
    { field: EstoqueColumnField.Peso, headerName: 'Peso', minWidth: 120 },
    { field: EstoqueColumnField.Tamanho, headerName: 'Tamanho', minWidth: 120 },
    {
      field: EstoqueColumnField.Quantidade,
      headerName: 'Posição do estoque',
      minWidth: 180,
      cellRenderer: ({ data }: ICellRendererParams<Estoque>) => data && quantidadeBadge(data.quantidade),
    },
    {
      field: EstoqueColumnField.QuantidadeDisponivel,
      headerName: 'Qtd. disponível',
      minWidth: 170,
      cellRenderer: ({ data }: ICellRendererParams<Estoque>) => data && quantidadeBadge(data.quantidadeDisponivel),
    },
    {
      field: EstoqueColumnField.QuantidadeReservada,
      headerName: 'Qtd. reservada',
      minWidth: 170,
      cellRenderer: ({ data }: ICellRendererParams<Estoque>) => data && quantidadeBadge(data.quantidadeReservada),
    },
    {
      field: EstoqueColumnField.DataDeAtualizacao,
      headerName: 'Última movimentação',
      minWidth: 190,
      valueFormatter: ({ value }) => formatarDataHoraUtcLocal(value),
    },
  ]

  const menuItems: MenuAppItem[] = [
    {
      icon: 'solar:filter-linear',
      iconColor: cores.primary,
      label: 'Filtros',
      onClick: abrirFiltros,
    },
  ]

  const filtrosModal = (
    <ModalChildren
      action={aplicarFiltros}
      close={() => setFiltrosModalAberto(false)}
      footerChildren={(
        <Stack direction="row" spacing={1}>
          <ButtonApp onClick={limparFiltros} variant={ButtonAppVariant.Outlined}>
            Limpar filtros
          </ButtonApp>
          <ButtonApp onClick={aplicarFiltros}>
            Aplicar filtros
          </ButtonApp>
        </Stack>
      )}
      fullWidth
      maxWidth="sm"
      open={filtrosModalAberto}
      textoButton="Aplicar filtros"
      titulo="Filtros"
    >
      <Stack spacing={2}>
        <ProdutoDropDown
          onChange={(_, produto) => setFiltrosTemporarios((current) => ({
            ...current,
            produto,
            produtoId: produto?.id,
          }))}
          value={filtrosTemporarios.produto}
        />
        <TamanhoDropDown
          onChange={(_, tamanho) => setFiltrosTemporarios((current) => ({
            ...current,
            tamanho,
            tamanhoId: tamanho?.id,
          }))}
          value={filtrosTemporarios.tamanho}
        />
        <PesoDropDown
          onChange={(_, peso) => setFiltrosTemporarios((current) => ({
            ...current,
            peso,
            pesoId: peso?.id,
          }))}
          value={filtrosTemporarios.peso}
        />
      </Stack>
    </ModalChildren>
  )

  return (
    <>
      <TableIndex
        columns={columns}
        desabilitarColunaAtivo
        filtroComplementar={{
          pesoId: filtros.pesoId,
          produtoId: filtros.produtoId,
          tamanhoId: filtros.tamanhoId,
        }}
        menuItems={menuItems}
        nomeDaTabela={EstoqueTable.Name}
        orderBy="numero"
        refreshPai={filtroRevision}
        url={ApiRoutePath.Estoque}
        urlEdit={PrivateRoutePath.EstoqueMovimentacao}
      />
      {filtrosModal}
    </>
  )
}
