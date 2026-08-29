import { Icon } from '@iconify/react'
import { IconButton, Stack, Tooltip } from '@mui/material'
import type { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { useThemeApp } from '../../hook/useThemeApp'
import { BadgeApp } from '../BadegApp/BadgeApp'
import { ButtonApp, ButtonAppVariant } from '../ButtonApp/ButtonApp'
import { ModalChildren } from '../Modal/ModalChildren'
import { TextApp } from '../TextApp/TextApp'
import type { TypeColumns } from './tabelaComDragTypes'

type DefaultColunsProps = {
  alterarStatus?: (row: any) => Promise<void> | void
  editar?: (row: any) => void
  visualizar?: (row: any) => void
  loadingAlterarStatus?: boolean
}

type AtivarCellProps = {
  row: any
  alterarStatus: (row: any) => Promise<void> | void
  loading?: boolean
}

const DefaultColumnField = {
  Acoes: 'acoes',
  Ativo: 'ativo',
} as const

const DefaultColumnIcon = {
  Activate: 'solar:restart-linear',
  Edit: 'solar:pen-linear',
  Inactivate: 'solar:trash-bin-trash-linear',
  View: 'solar:eye-linear',
} as const

function AtivarCell({ row, alterarStatus, loading }: AtivarCellProps) {
  const [open, setOpen] = useState(false)
  const action = row.ativo ? 'inativar' : 'ativar'

  async function confirmar() {
    await alterarStatus(row)
    setOpen(false)
  }

  return (
    <>
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Tooltip title={row.ativo ? 'Inativar' : 'Ativar'}>
          <IconButton
            aria-label={`${action} registro`}
            disabled={loading}
            onClick={(event) => {
              event.stopPropagation()
              setOpen(true)
            }}
          >
            <Icon
              icon={row.ativo ? DefaultColumnIcon.Inactivate : DefaultColumnIcon.Activate}
              fontSize={19}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      <ModalChildren
        close={() => setOpen(false)}
        footerChildren={(
          <>
            <ButtonApp
              disabled={loading}
              onClick={() => setOpen(false)}
              variant={ButtonAppVariant.Outlined}
            >
              Cancelar
            </ButtonApp>
            <ButtonApp loading={loading} onClick={confirmar}>
              Confirmar
            </ButtonApp>
          </>
        )}
        fullWidth
        maxWidth="sm"
        open={open}
        titulo="Confirmar alteração"
      >
        <TextApp>Deseja realmente {action} este registro?</TextApp>
      </ModalChildren>
    </>
  )
}

export function DefaultColuns({
  alterarStatus,
  editar,
  loadingAlterarStatus,
  visualizar,
}: DefaultColunsProps): TypeColumns[] {
  const { cores } = useThemeApp()

  if (!alterarStatus && !editar && !visualizar) return []

  const columns: TypeColumns[] = []

  if (alterarStatus) {
    columns.push({
      field: DefaultColumnField.Ativo,
      headerName: 'Status',
      width: 110,
      sortable: true,
      cellRenderer: ({ data }: ICellRendererParams) => data && (
        <BadgeApp
          cor={data.ativo ? cores.success : cores.error}
          padding=".25rem .625rem"
          texto={data.ativo ? 'Ativo' : 'Inativo'}
        />
      ),
    })
  }

  columns.push({
      field: DefaultColumnField.Acoes,
      headerName: 'Ações',
      width: 150,
      sortable: false,
      cellRenderer: ({ data }: ICellRendererParams) => data && (
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          {editar && (
            <Tooltip title="Editar">
              <IconButton
                aria-label="editar registro"
                onClick={(event) => {
                  event.stopPropagation()
                  editar(data)
                }}
              >
                <Icon icon={DefaultColumnIcon.Edit} fontSize={19} />
              </IconButton>
            </Tooltip>
          )}
          {visualizar && (
            <Tooltip title="Visualizar">
              <IconButton
                aria-label="visualizar registro"
                onClick={(event) => {
                  event.stopPropagation()
                  visualizar(data)
                }}
              >
                <Icon icon={DefaultColumnIcon.View} fontSize={19} />
              </IconButton>
            </Tooltip>
          )}
          {alterarStatus && (
            <AtivarCell
              alterarStatus={alterarStatus}
              loading={loadingAlterarStatus}
              row={data}
            />
          )}
        </Stack>
      ),
    })

  return columns
}
