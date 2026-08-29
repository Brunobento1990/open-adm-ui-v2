import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useState, type ReactNode } from 'react'
import { useApiDashboard } from '../../api/useApiDashboard'
import { useComandaStatus } from '../../hook/useComandaStatus'
import { BadgeApp } from '../../components/BadegApp/BadgeApp'
import { IconApp } from '../../components/Icon/IconApp'
import { useNavigationApp } from '../../hook/useNavigationApp'
import { useThemeApp } from '../../hook/useThemeApp'
import { PrivateRoutePath } from '../../routes/appRoutes'
import { ComandaStatus, ComandaStatusLabel } from '../../types/ComandaTypes'
import type {
  Dashboard,
  DashboardComandaAberta,
  DashboardComandaPorStatus,
} from '../../types/DashboardTypes'
import { formatMoney, formatNumber } from '../../utils/moneyUtils'

const DashboardIcon = {
  Comandas: 'solar:clipboard-list-linear',
  ValorAberto: 'solar:wallet-money-linear',
  Finalizadas: 'solar:check-circle-linear',
  Vendas: 'solar:chart-2-linear',
  ArrowRight: 'solar:alt-arrow-right-linear',
  Produto: 'solar:box-linear',
  Estoque: 'solar:danger-triangle-linear',
} as const

const DashboardText = {
  UnidadeSingular: 'unidade',
  UnidadePlural: 'unidades',
} as const

type SectionCardProps = {
  title: string
  action?: ReactNode
  children: ReactNode
}

function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ minWidth: 0, overflow: 'hidden', p: { xs: 2, sm: 2.5 } }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, minHeight: 32 }}
      >
        <Typography component="h2" variant="h6" noWrap>{title}</Typography>
        {action}
      </Stack>
      {children}
    </Paper>
  )
}

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Stack divider={<Divider flexItem />}>
      {Array.from({ length: rows }, (_, index) => (
        <Stack key={index} direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 1.25 }}>
          <Skeleton variant="rounded" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="45%" />
            <Skeleton width="70%" />
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}

export function HomePage() {
  const theme = useTheme()
  const { cores } = useThemeApp()
  const getComandaStatus = useComandaStatus()
  const { navigate } = useNavigationApp()
  const dashboardApi = useApiDashboard()
  const [dashboard, setDashboard] = useState<Dashboard>()

  useEffect(() => {
    void dashboardApi.obter.fetch().then((response) => {
      if (response) setDashboard(response)
    })
    // A consulta deve ocorrer somente na montagem da tela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loading = dashboardApi.obter.loading && !dashboard
  const statusColors = [cores.primary, cores.success, cores.warning, cores.error, cores.info]
  const totalComandasPorStatus = Math.max(
    1,
    (dashboard?.comandasPorStatus ?? []).reduce(
      (total, item) => total + item.quantidade,
      0,
    ),
  )

  const openComandas = () => navigate(PrivateRoutePath.Comanda)
  const openComanda = (comanda: DashboardComandaAberta) =>
    navigate(`${PrivateRoutePath.ComandaEditar}/${comanda.id}`)
  const statusLabel = (comanda: DashboardComandaAberta) =>
    ComandaStatusLabel[comanda.status] ?? String(comanda.status)
  const statusColor = (status: ComandaStatus) =>
    getComandaStatus(status).color ?? cores.primary

  const kpis = [
    {
      label: 'Comandas abertas',
      value: dashboard ? formatNumber(dashboard.comandasAbertas) : '',
      icon: DashboardIcon.Comandas,
      color: cores.primary,
      onClick: openComandas,
    },
    {
      label: 'Valor em aberto',
      value: dashboard ? formatMoney(dashboard.valorEmAberto) : '',
      icon: DashboardIcon.ValorAberto,
      color: cores.warning,
    },
    {
      label: 'Finalizadas hoje',
      value: dashboard ? formatNumber(dashboard.finalizadasHoje) : '',
      icon: DashboardIcon.Finalizadas,
      color: cores.success,
    },
    {
      label: 'Vendas no mês',
      value: dashboard ? formatMoney(dashboard.vendasNoMes) : '',
      icon: DashboardIcon.Vendas,
      color: cores.info,
    },
  ]

  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        maxWidth: 1600,
        mx: 'auto',
        minWidth: 0,
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        pr: { xs: 0, sm: 0.5 },
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
        {kpis.map((kpi) => (
          <Paper key={kpi.label} variant="outlined" sx={{ minWidth: 0, overflow: 'hidden' }}>
            <ButtonBase
              disabled={!kpi.onClick}
              onClick={kpi.onClick}
              sx={{
                width: '100%',
                minHeight: { xs: 104, sm: 112 },
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                textAlign: 'left',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75, lineHeight: 1.25 }}>
                  {kpi.label}
                </Typography>
                {loading ? (
                  <Skeleton sx={{ width: { xs: 76, sm: 105 } }} height={34} />
                ) : (
                  <Typography
                    component="p"
                    sx={{ fontSize: { xs: '1.15rem', sm: '1.4rem' }, fontWeight: 700, lineHeight: 1.25, overflowWrap: 'anywhere' }}
                  >
                    {kpi.value}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'grid', placeItems: 'center', flex: '0 0 auto', width: { xs: 30, sm: 36 }, height: { xs: 30, sm: 36 }, ml: 1, borderRadius: 1.5, color: kpi.color, bgcolor: alpha(kpi.color, 0.12) }}>
                <IconApp icon={kpi.icon} width="1.15rem" />
              </Box>
            </ButtonBase>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
        <SectionCard
          title="Comandas em aberto"
          action={<Button size="small" endIcon={<IconApp icon={DashboardIcon.ArrowRight} />} onClick={openComandas}>Ver todas</Button>}
        >
          {loading ? <ListSkeleton rows={4} /> : !dashboard?.comandasRecentes.length ? (
            <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
              Nenhuma comanda aberta no momento.
            </Typography>
          ) : (
            <Stack divider={<Divider flexItem />}>
              <Box sx={{ display: { xs: 'none', sm: 'grid' }, gridTemplateColumns: '110px minmax(180px, 1fr) 120px 130px 180px', gap: 2, px: 1.25, pb: 1, color: 'text.secondary' }}>
                {['Número', 'Identificação', 'Clientes', 'Valor', 'Status'].map((label) => (
                  <Typography key={label} variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
                ))}
              </Box>
              {dashboard.comandasRecentes.map((comanda) => (
                <ButtonBase key={comanda.id} onClick={() => openComanda(comanda)} sx={{ width: '100%', display: 'block', textAlign: 'left', borderRadius: 1 }}>
                  <Box sx={{ display: { xs: 'none', sm: 'grid' }, gridTemplateColumns: '110px minmax(180px, 1fr) 120px 130px 180px', alignItems: 'center', gap: 2, minHeight: 52, px: 1.25 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Nº {comanda.numero}</Typography>
                    <Typography variant="body2" noWrap>{comanda.identificacao}</Typography>
                    <Typography variant="body2" color="text.secondary">{formatNumber(comanda.quantidadeClientes)}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatMoney(comanda.valorTotal)}</Typography>
                    <BadgeApp cor={statusColor(comanda.status)} texto={statusLabel(comanda)} padding="4px 8px" maxWidth="170px" />
                  </Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' }, py: 1.25 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Comanda nº {comanda.numero}</Typography>
                      <BadgeApp cor={statusColor(comanda.status)} texto={statusLabel(comanda)} padding="3px 7px" fontSize="0.75rem" maxWidth="145px" />
                    </Stack>
                    <Typography variant="body2" noWrap sx={{ mt: 0.5 }}>{comanda.identificacao}</Typography>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">{formatNumber(comanda.quantidadeClientes)} clientes</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMoney(comanda.valorTotal)}</Typography>
                    </Stack>
                  </Box>
                </ButtonBase>
              ))}
            </Stack>
          )}
        </SectionCard>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
        <SectionCard title="Comandas — últimos 30 dias">
          {loading ? <ListSkeleton /> : (
            <Stack spacing={1.75}>
              {(dashboard?.comandasPorStatus ?? []).map((item, index) => (
                <StatusBar
                  key={item.status}
                  item={item}
                  color={
                    typeof item.status === 'number'
                      ? getComandaStatus(item.status as ComandaStatus).color
                      ?? statusColors[index % statusColors.length]
                      : statusColors[index % statusColors.length]
                  }
                  total={totalComandasPorStatus}
                />
              ))}
              {!dashboard?.comandasPorStatus.length && <Typography color="text.secondary" variant="body2">Nenhum status encontrado no período.</Typography>}
            </Stack>
          )}
        </SectionCard>

        <SectionCard title="Produtos mais consumidos (Qtd) — este mês">
          {loading ? <ListSkeleton /> : (
            <Stack divider={<Divider flexItem />}>
              {(dashboard?.produtosMaisConsumidos ?? []).map((produto) => (
                <Stack key={produto.produtoId} direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 1 }}>
                  <Avatar src={produto.urlFoto ?? undefined} alt={produto.descricao} variant="rounded" sx={{ width: 42, height: 42, bgcolor: alpha(cores.primary, 0.12), color: cores.primary }}>
                    <IconApp icon={DashboardIcon.Produto} />
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{produto.descricao}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatNumber(produto.quantidade)} {produto.quantidade === 1 ? DashboardText.UnidadeSingular : DashboardText.UnidadePlural}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ flexShrink: 0, fontWeight: 700 }}>{formatMoney(produto.valorTotal)}</Typography>
                </Stack>
              ))}
              {!dashboard?.produtosMaisConsumidos.length && <Typography color="text.secondary" variant="body2" sx={{ py: 1 }}>Nenhum consumo registrado neste mês.</Typography>}
            </Stack>
          )}
        </SectionCard>
      </Box>

      {!loading && dashboard?.estoqueBaixo && dashboard.estoqueBaixo.length > 0 && (
        <SectionCard
          title="Estoque baixo"
          action={<Button size="small" endIcon={<IconApp icon={DashboardIcon.ArrowRight} />} onClick={() => navigate(PrivateRoutePath.Estoque)}>Ver estoque</Button>}
        >
          <Stack divider={<Divider flexItem />}>
            {dashboard.estoqueBaixo.map((estoque) => (
              <Stack key={estoque.produtoId} direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 1 }}>
                <Box sx={{ display: 'grid', placeItems: 'center', width: 36, height: 36, flexShrink: 0, borderRadius: 1.5, bgcolor: alpha(cores.warning, 0.12), color: cores.warning }}>
                  <IconApp icon={DashboardIcon.Estoque} width="1.2rem" />
                </Box>
                <Typography variant="body2" noWrap sx={{ minWidth: 0, flex: 1, fontWeight: 600 }}>{estoque.nome}</Typography>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatNumber(estoque.quantidadeAtual)} em estoque</Typography>
                  {estoque.estoqueMinimo != null && <Typography variant="caption" color="text.secondary">Mínimo: {formatNumber(estoque.estoqueMinimo)}</Typography>}
                </Box>
              </Stack>
            ))}
          </Stack>
        </SectionCard>
      )}
      <Box sx={{ height: theme.spacing(2) }} />
    </Box>
  )
}

function StatusBar({ item, color, total }: { item: DashboardComandaPorStatus; color: string; total: number }) {
  const descricao = typeof item.status === 'number'
    ? ComandaStatusLabel[item.status as ComandaStatus] ?? String(item.status)
    : item.status
  const percentual = (item.quantidade / total) * 100

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" noWrap>{descricao}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {formatNumber(item.quantidade)} ({formatNumber(percentual)}%)
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={percentual}
        aria-label={`${descricao}: ${item.quantidade} (${formatNumber(percentual)}%)`}
        sx={{ height: 7, borderRadius: 4, bgcolor: alpha(color, 0.12), '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: color } }}
      />
    </Box>
  )
}
