import { CircularProgress, Stack } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
    themeQuartz,
    type ColDef,
    type ColumnState,
    type GridApi
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useEffect, useMemo, useRef } from 'react'
import { TextApp } from '../TextApp/TextApp'
import {
    TableSortDirection,
    type TabelaComDragProps,
    type TypeColumns,
} from './tabelaComDragTypes'

export type { ISort, ISortingTable, TypeColumns } from './tabelaComDragTypes'

function EmptyTableOverlay() {
    return <TextApp>Não há registros</TextApp>
}

function LoadingTableOverlay() {
    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <CircularProgress size={18} />
            <TextApp>Carregando...</TextApp>
        </Stack>
    )
}

function getStoredColumnState(tableName?: string): ColumnState[] | undefined {
    if (!tableName) return undefined

    try {
        const storedColumns = localStorage.getItem(tableName)
        if (!storedColumns) return undefined
        const parsedColumns: unknown = JSON.parse(storedColumns)
        if (
            !Array.isArray(parsedColumns) ||
            !parsedColumns.every((column) => column && typeof column.colId === 'string')
        ) {
            localStorage.removeItem(tableName)
            return undefined
        }
        return parsedColumns as ColumnState[]
    } catch {
        localStorage.removeItem(tableName)
        return undefined
    }
}

export function TabelaComDrag(props: TabelaComDragProps) {
    const theme = useTheme()
    const gridRef = useRef<AgGridReact>(null)
    const primeiroRender = useRef(true)

    useEffect(() => {
        if (primeiroRender.current) {
            primeiroRender.current = false
            return
        }
        if (props.nomeDaTabela) localStorage.removeItem(props.nomeDaTabela)
        gridRef.current?.api?.resetColumnState()
        // nomeDaTabela identifica o storage; somente chaveReset deve disparar a limpeza.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.chaveReset])

    function atualizarColunas(api: GridApi) {
        if (!props.nomeDaTabela) return

        const colunas = JSON.stringify(api.getColumnState())
        localStorage.setItem(props.nomeDaTabela, colunas)
        props.atualizarColunas?.(colunas)
    }

    const columns = useMemo<ColDef[]>(() => {
        const addHeaderTooltip = (column: TypeColumns): ColDef => ({
            ...column,
            cellClass: 'ag-center-cols-cell',
            headerTooltip: column.sortable ? `Ordenar por ${column.headerName}` : undefined,
        })

        return props.columns.map(addHeaderTooltip)
    }, [props.columns])

    const gridTheme = useMemo(() => themeQuartz.withParams({
        accentColor: theme.palette.primary.main,
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderRadius: theme.shape.borderRadius,
        browserColorScheme: theme.palette.mode,
        cellTextColor: theme.palette.text.primary,
        chromeBackgroundColor: theme.palette.background.paper,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.body2.fontSize,
        foregroundColor: theme.palette.text.primary,
        headerBackgroundColor: theme.palette.background.paper,
        headerFontFamily: theme.typography.fontFamily,
        headerFontSize: theme.typography.body2.fontSize,
        headerFontWeight: 700,
        headerTextColor: theme.palette.text.primary,
        oddRowBackgroundColor: alpha(theme.palette.text.primary, 0.015),
        rowHoverColor: alpha(theme.palette.primary.main, 0.08),
        selectedRowBackgroundColor: alpha(theme.palette.primary.main, 0.12),
        wrapperBorder: true,
        wrapperBorderRadius: theme.shape.borderRadius,
    }), [theme])

    return (
        <div
            onContextMenu={(event) => event.preventDefault()}
            style={{
                width: props.width ?? '100%',
                height: props.height ?? '100%',
                marginTop: props.marginTop,
            }}
        >
            <style>
                {`
          .ag-center-cols-cell {
            display: flex;
            align-items: center;
            justify-content: start;
            user-select: text;
          }
        `}
            </style>
            <AgGridReact
                ref={gridRef}
                columnDefs={columns}
                getRowId={(params) => String(
                    params.data?.id ?? params.data?.key ?? params.data?.produtoId ?? JSON.stringify(params.data),
                )}
                getRowStyle={(params) => props.getBackgroundColor?.(params.data)}
                headerHeight={props.headerHeight ?? 40}
                loading={props.loading}
                loadingOverlayComponent={LoadingTableOverlay}
                maintainColumnOrder
                noRowsOverlayComponent={EmptyTableOverlay}
                onGridReady={(event) => {
                    const storedColumnState = getStoredColumnState(props.nomeDaTabela)
                    if (storedColumnState?.length) {
                        event.api.applyColumnState({
                            state: storedColumnState,
                            applyOrder: true,
                        })
                    }
                }}
                onCellContextMenu={(event) => {
                    if (!props.onContextMenu || !event.event) return
                    event.event.preventDefault()
                    event.event.stopPropagation()
                    props.onContextMenu(
                        event.event as unknown as React.MouseEvent,
                        event.data,
                        event.rowIndex ?? 0,
                    )
                }}
                onColumnMoved={(event) => {
                    if (!event.finished || !props.nomeDaTabela || !event.source?.startsWith('ui')) return
                    atualizarColunas(event.api)
                }}
                onColumnResized={(event) => {
                    if (!event.finished || !props.nomeDaTabela || !event.source?.startsWith('ui')) return
                    atualizarColunas(event.api)
                }}
                onRowClicked={(event) => {
                    if (!props.selecionarLinha || event.event?.defaultPrevented) return
                    props.selecionarLinha(event.data, event.rowIndex ?? 0)
                }}
                onRowDoubleClicked={(event) => {
                    props.onDoubleClick?.(event.data, event.rowIndex ?? 0)
                }}
                onSortChanged={(event) => {
                    if (!props.setSorting || !props.sorting) return
                    const sortedColumn = event.api.getColumnState().find((column) => column.sort)
                    if (!sortedColumn) return

                    props.setSorting({
                        field: sortedColumn.colId,
                        sort: sortedColumn.sort === TableSortDirection.Desc
                            ? TableSortDirection.Desc
                            : TableSortDirection.Asc,
                    })
                }}
                rowData={props.rows}
                rowHeight={props.rowHeight}
                suppressAnimationFrame={props.suppressAnimationFrame}
                suppressDragLeaveHidesColumns
                suppressScrollOnNewData={props.suppressScrollOnNewData}
                theme={gridTheme}
            />
        </div>
    )
}
