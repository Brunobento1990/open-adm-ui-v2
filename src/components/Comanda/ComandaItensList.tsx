import { Icon } from '@iconify/react'
import { Avatar, Box, IconButton, Paper, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { useThemeApp } from '../../hook/useThemeApp'
import type { ComandaItem } from '../../types/ComandaTypes'
import { formatMoney, formatNumber } from '../../utils/moneyUtils'

type ComandaItensListProps = {
  emptyMessage?: string
  itens: ComandaItem[]
  loading?: boolean
  onRemove?: (item: ComandaItem, index: number) => void
  removeLoading?: boolean
  showSummary?: boolean
}

export function ComandaItensList({
  emptyMessage = 'Nenhum produto adicionado.',
  itens,
  loading = false,
  onRemove,
  removeLoading = false,
  showSummary = true,
}: ComandaItensListProps) {
  const { cores } = useThemeApp()
  const resumo = itens.reduce((resultado, item) => ({
    quantidade: resultado.quantidade + Number(item.quantidade),
    total: resultado.total + item.valorTotal,
  }), { quantidade: 0, total: 0 })

  if (loading) {
    return <Stack spacing={1}>{[1, 2, 3].map((item) => <Skeleton key={item} height={80} variant="rounded" />)}</Stack>
  }

  return (
    <Stack spacing={1}>
      {showSummary && itens.length > 0 && (
        <Typography color="text.secondary" sx={{ mb: 0.5, textAlign: { xs: 'left', md: 'right' } }} variant="body2">
          {itens.length} produtos · {formatNumber(resumo.quantidade)} unidades ·{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>{formatMoney(resumo.total)}</Box>
        </Typography>
      )}
      {itens.map((item, itemIndex) => (
        <Paper key={item.id || `${item.produtoId}-${itemIndex}`} variant="outlined" sx={{ p: { xs: 1.25, md: 1.5 } }}>
          <Box sx={{ alignItems: 'center', display: 'grid', gap: { xs: '4px 10px', md: '4px 16px' }, gridTemplateColumns: { xs: '44px minmax(0, 1fr) auto', md: '48px minmax(0, 1fr) auto' }, minWidth: 0 }}>
            <Avatar alt={item.produto.descricao} src={item.produto.foto} variant="rounded" sx={{ gridRow: '1 / span 2', height: { xs: 44, md: 48 }, width: { xs: 44, md: 48 } }} />
            <Box sx={{ gridColumn: 2, minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 600 }}>{item.produto.descricao}</Typography>
            </Box>
            <Box sx={{ gridColumn: 2, gridRow: 2, minWidth: 0 }}>
              <Typography color="text.secondary" variant="body2">{formatNumber(item.quantidade)} × {formatMoney(item.valorUnitario)}</Typography>
            </Box>
            <Box sx={{ gridColumn: 3, gridRow: 2, textAlign: 'right', whiteSpace: 'nowrap' }}>
              <Typography color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }} variant="caption">Total</Typography>
              <Typography sx={{ fontWeight: 700 }}>{formatMoney(item.valorTotal)}</Typography>
            </Box>
            {onRemove && (
              <Tooltip title="Remover produto">
                <IconButton
                  disabled={removeLoading}
                  onClick={() => onRemove(item, itemIndex)}
                  size="small"
                  sx={{ color: cores.error, gridColumn: 3, gridRow: 1 }}
                >
                  <Icon icon="solar:trash-bin-trash-linear" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Paper>
      ))}
      {itens.length === 0 && <Typography color="text.secondary">{emptyMessage}</Typography>}
    </Stack>
  )
}
