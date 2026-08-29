import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  type PaperProps,
} from '@mui/material'
import { createContext, useContext, useEffect, useState } from 'react'
import { ApiResourceRoutePath, ApiRoutePath } from '../../api/apiRoutes'
import { ApiMethod, useApi } from '../../hook/useApi'
import type { Cliente } from '../../types/ClienteTypes'
import { ClienteCreateModal } from '../Cliente/ClienteCreateModal'
import { IconApp } from '../Icon/IconApp'

const ClienteMultiSelectIcon = {
  Add: 'solar:add-circle-linear',
} as const

const ClienteCreateContext = createContext<() => void>(() => undefined)

function ClienteOptionsPaper({ children, ...props }: PaperProps) {
  const openCreateModal = useContext(ClienteCreateContext)

  return (
    <Paper {...props}>
      {children}
      <Divider />
      <Button
        fullWidth
        onMouseDown={(event) => event.preventDefault()}
        onClick={openCreateModal}
        startIcon={<IconApp icon={ClienteMultiSelectIcon.Add} width="1.1rem" />}
        sx={{ justifyContent: 'flex-start', borderRadius: 0, px: 2, py: 1.25 }}
      >
        Novo cliente
      </Button>
    </Paper>
  )
}

type ClienteMultiSelectProps = {
  onChange: (clientes: Cliente[]) => void
  readonly?: boolean
  value: Cliente[]
}

type ClientePaginacao = { registros: Cliente[] }

export function ClienteMultiSelect({ onChange, readonly, value }: ClienteMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [options, setOptions] = useState<Cliente[]>([])
  const { action, loading } = useApi({
    method: ApiMethod.Post,
    url: `${ApiRoutePath.Cliente}${ApiResourceRoutePath.Paginacao}`,
    naoRenderizarResposta: true,
  })

  useEffect(() => {
    if (!open || readonly) return

    async function carregarClientes() {
      const response = await action<ClientePaginacao>({
        body: { asc: true, listarInativo: false, orderBy: 'nome', skip: 1, take: 100 },
      })
      if (response) setOptions(response.registros)
    }

    carregarClientes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, readonly])

  const availableOptions = Array.from(
    new Map([...value, ...options].map((cliente) => [cliente.id, cliente])).values(),
  )

  const clienteCriado = (cliente: Cliente) => {
    setOptions((current) => [
      cliente,
      ...current.filter((option) => option.id !== cliente.id),
    ])
    onChange(Array.from(
      new Map([...value, cliente].map((selected) => [selected.id, selected])).values(),
    ))
  }

  const openCreateModal = () => {
    setOpen(false)
    setCreateModalOpen(true)
  }

  return (
    <ClienteCreateContext.Provider value={openCreateModal}>
      <Autocomplete
        multiple
        disabled={readonly}
        getOptionLabel={(cliente) => cliente.nome}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        loading={loading}
        onChange={(_, clientes) => onChange(
          Array.from(new Map(clientes.map((cliente) => [cliente.id, cliente])).values()),
        )}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        options={availableOptions}
        slots={{
          paper: ClienteOptionsPaper,
        }}
        slotProps={{
          chip: {
            variant: 'outlined',
            color: 'primary',
          },
        }}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Clientes"
            placeholder="Selecione os clientes"
            size="small"
            slotProps={{
              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
              inputLabel: params.slotProps.inputLabel,
              htmlInput: params.slotProps.htmlInput,
            }}
          />
        )}
      />
      <ClienteCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSaved={clienteCriado}
      />
    </ClienteCreateContext.Provider>
  )
}
