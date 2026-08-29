import { Pagination, Stack } from '@mui/material'
import { keysLocalStorage } from '../../configs/keysLocalStorage'
import { useLocalStorageApp } from '../../hook/useLocalStorageApp'
import { useThemeApp } from '../../hook/useThemeApp'
import { DropDownApp } from '../DropDown/DropDownApp'
import { TextApp } from '../TextApp/TextApp'

const opcoesDeQuantidadePorPagina = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(
  (quantidade) => ({
    id: quantidade,
    label: quantidade.toString(),
  }),
)

const FooterTableField = {
  QuantidadePorPagina: 'quantidadePorPagina',
} as const

type FooterTableProps = {
  length: number
  totalDeRegistros: number
  quantidadePagina: number
  quantidadePorPagina: number
  pagina: number
  setPagina: (newPage: number) => void
  setQuantidadePorPagina: (newPage: number) => void
}

export function FooterTable({
  length,
  pagina,
  quantidadePagina,
  quantidadePorPagina,
  setPagina,
  setQuantidadePorPagina,
  totalDeRegistros,
}: FooterTableProps) {
  const { setItem } = useLocalStorageApp()
  const { isCelular } = useThemeApp()

  function changeQuantidadePorPagina(value?: number) {
    if (!value) return
    const newValue = Number(value)
    setItem(keysLocalStorage.quantidadePorPagina, newValue.toString())
    setQuantidadePorPagina(newValue)
  }

  if (isCelular) {
    return (
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <DropDownApp
          id={FooterTableField.QuantidadePorPagina}
          keyLabel="label"
          label=""
          onChange={(_, value) => changeQuantidadePorPagina(value)}
          value={opcoesDeQuantidadePorPagina.find(
            (option) => option.id === quantidadePorPagina,
          )}
          values={opcoesDeQuantidadePorPagina}
          width="80px"
        />
        <Pagination
          boundaryCount={0}
          color="primary"
          count={quantidadePagina}
          onChange={(_, newPage) => setPagina(newPage)}
          page={pagina}
          shape="rounded"
          siblingCount={0}
          size="small"
          variant="outlined"
        />
      </Stack>
    )
  }

  return (
    <Stack spacing={0.5} sx={{ width: '100%' }}>
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: 'center' }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center' }}
          >
            <TextApp fontSize="12px">Registros por página:</TextApp>
            <DropDownApp
              id={FooterTableField.QuantidadePorPagina}
              keyLabel="label"
              label=""
              onChange={(_, value) => changeQuantidadePorPagina(value)}
              value={opcoesDeQuantidadePorPagina.find(
                (option) => option.id === quantidadePorPagina,
              )}
              values={opcoesDeQuantidadePorPagina}
              width="100px"
            />
          </Stack>
          <TextApp fontSize="12px">
            Exibindo {length} registros de {totalDeRegistros}
          </TextApp>
        </Stack>

        <Pagination
          color="primary"
          count={quantidadePagina}
          onChange={(_, newPage) => setPagina(newPage)}
          page={pagina}
          shape="rounded"
          size="small"
          variant="outlined"
        />
      </Stack>
    </Stack>
  )
}
