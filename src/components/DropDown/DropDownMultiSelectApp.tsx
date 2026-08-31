import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { ApiMethod, useApi } from '../../hook/useApi'

type MultiSelectItem = {
  id: string
  descricao: string
}

type DropDownMultiSelectAppProps<T extends MultiSelectItem> = {
  id: string
  label: string
  onChange: (values: T[]) => void
  readonly?: boolean
  url: string
  values: T[]
}

export function DropDownMultiSelectApp<T extends MultiSelectItem>({
  id,
  label,
  onChange,
  readonly,
  url,
  values,
}: DropDownMultiSelectAppProps<T>) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<T[]>([])
  const { action, loading } = useApi({
    method: ApiMethod.Get,
    url,
    naoRenderizarResposta: true,
  })

  useEffect(() => {
    if (!open || readonly) return

    async function carregar() {
      const response = await action<T[]>()
      if (response) setOptions(response)
    }

    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, readonly])

  return (
    <Autocomplete
      disabled={readonly}
      getOptionLabel={(option) => option.descricao}
      id={id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={loading}
      multiple
      onChange={(_, newValues) => onChange(newValues)}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
        />
      )}
      slotProps={{
        chip: {
          size: 'small',
          variant: 'outlined',
          color: 'primary'
        },
      }}
      value={values}
    />
  )
}
