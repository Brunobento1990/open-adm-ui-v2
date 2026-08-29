import type {
  CellRendererSelectorFunc,
  ColDef,
  SuppressKeyboardEventParams,
} from 'ag-grid-community'
import type { MouseEvent } from 'react'

export enum TableSortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type ISort = `${TableSortDirection}`

export interface ISortingTable {
  field: string
  sort: ISort
}

export interface TypeColumns extends ColDef {
  field: string
  headerName: string
  cellRenderer?: ColDef['cellRenderer'] | CellRendererSelectorFunc
  suppressKeyboardEvent?: (params: SuppressKeyboardEventParams) => boolean
}

export interface TabelaComDragProps {
  columns: TypeColumns[]
  rows: unknown[]
  sorting?: ISortingTable
  setSorting?: (sorting: ISortingTable) => void
  selecionarLinha?: (row: unknown, index: number) => void
  height?: number | string
  width?: number | string
  marginTop?: string
  getBackgroundColor?: (row: unknown) => Record<string, string | number> | undefined
  onDoubleClick?: (item: unknown, index: number, key?: string) => void
  onContextMenu?: (event: MouseEvent, row: unknown, index: number) => void
  loading?: boolean
  rowHeight?: number
  nomeDaTabela?: string
  chaveReset?: number
  suppressScrollOnNewData?: boolean
  suppressAnimationFrame?: boolean
  headerHeight?: number
  atualizarColunas?: (colunas: string) => void
}

export function mergeTabelaComDragColumns(
  storedColumns: TypeColumns[],
  originalColumns: TypeColumns[],
): TypeColumns[] {
  const mergedColumns = storedColumns.map((storedColumn) => {
    const originalColumn = originalColumns.find(
      (column) => column.field === storedColumn.field,
    )

    return {
      ...storedColumn,
      ...(originalColumn?.cellRenderer && {
        cellRenderer: originalColumn.cellRenderer,
      }),
      ...(originalColumn?.suppressKeyboardEvent && {
        suppressKeyboardEvent: originalColumn.suppressKeyboardEvent,
      }),
    }
  })

  const newColumns = originalColumns.filter(
    (column) => !storedColumns.some((storedColumn) => storedColumn.field === column.field),
  )

  return [...mergedColumns, ...newColumns]
}
