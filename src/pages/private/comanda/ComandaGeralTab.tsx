import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { ClienteMultiSelect } from '../../../components/DropDown/ClienteMultiSelect'
import { TabelaDePrecoDropDown } from '../../../components/DropDown/TabelaDePrecoDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { useComandaStatus } from '../../../hook/useComandaStatus'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { Cliente } from '../../../types/ClienteTypes'
import { ComandaFormField, type Comanda } from '../../../types/ComandaTypes'
import type { TabelaDePreco } from '../../../types/TabelaDePrecoTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney } from '../../../utils/moneyUtils'

type ComandaGeralTabProps = {
  clientes: Cliente[]
  comanda?: Comanda
  desconto: number
  identificacao: string
  loading: boolean
  observacao: string
  onClientesChange: (clientes: Cliente[]) => void
  onDescontoChange: (desconto: number) => void
  onIdentificacaoChange: (identificacao: string) => void
  onObservacaoChange: (observacao: string) => void
  onTabelaDePrecoChange: (tabelaDePreco?: TabelaDePreco) => void
  readonly: boolean
  tabelaDePreco?: TabelaDePreco
  valorSubtotal: number
}

export function ComandaGeralTab({
  clientes,
  comanda,
  desconto,
  identificacao,
  loading,
  observacao,
  onClientesChange,
  onDescontoChange,
  onIdentificacaoChange,
  onObservacaoChange,
  onTabelaDePrecoChange,
  readonly,
  tabelaDePreco,
  valorSubtotal,
}: ComandaGeralTabProps) {
  const { cores } = useThemeApp()
  const getStatus = useComandaStatus()

  const valorLiquido = readonly && comanda
    ? comanda.valorLiquido
    : valorSubtotal - desconto

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton height={32} sx={{ maxWidth: 320, width: '100%' }} variant="rounded" />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Skeleton height={56} sx={{ flex: 1 }} variant="rounded" />
          <Skeleton height={56} sx={{ flex: 1 }} variant="rounded" />
        </Stack>
        <Skeleton height={56} variant="rounded" />
        <Skeleton height={120} variant="rounded" />
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      {comanda && (
        <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Comanda nº {comanda.numero}</Typography>
              <Typography color="text.secondary" variant="caption">
                Criada em {formatarDataHoraUtcLocal(comanda.dataDeCadastro)}
              </Typography>
              {comanda.dataDeFechamento && (
                <Typography variant="caption" sx={{ color: cores.success, display: 'block' }}>
                  Fechada em {formatarDataHoraUtcLocal(comanda.dataDeFechamento)}
                </Typography>
              )}
              {comanda.dataDeCancelamento && (
                <Typography variant="caption" sx={{ color: cores.error, display: 'block' }}>
                  Cancelada em {formatarDataHoraUtcLocal(comanda.dataDeCancelamento)}
                </Typography>
              )}
            </Box>
            <BadgeApp cor={getStatus(comanda.status).color} padding="4px 10px" texto={getStatus(comanda.status).label} />
            <Stack direction="row" spacing={2.5}>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography color="text.secondary" sx={{ display: 'block' }} variant="caption">Valor total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatMoney(comanda.valorTotal)}</Typography>
              </Box>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography color="text.secondary" sx={{ display: 'block' }} variant="caption">Valor líquido</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatMoney(valorLiquido)}</Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      )}
      <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <InputApp
          disabled={readonly}
          id="identificacao"
          label="Identificação"
          maxLength={100}
          onChange={(_, value) => onIdentificacaoChange(String(value ?? ''))}
          required
          value={identificacao}
        />
        <TabelaDePrecoDropDown onChange={onTabelaDePrecoChange} readonly={readonly} value={tabelaDePreco} />
        <InputApp
          disabled={readonly}
          id={ComandaFormField.Desconto}
          label="Desconto da comanda"
          onChange={(_, value) => onDescontoChange(value === '' || value === undefined ? 0 : Number(value))}
          startAdornment="R$"
          type={InputAppType.Currency}
          value={desconto}
        />
      </Box>
      <ClienteMultiSelect onChange={onClientesChange} readonly={readonly} value={clientes} />
      <InputApp
        disabled={readonly}
        id="observacao"
        label="Observação"
        maxLength={1000}
        multiline
        onChange={(_, value) => onObservacaoChange(String(value ?? ''))}
        rows={4}
        value={observacao}
      />
    </Stack>
  )
}
