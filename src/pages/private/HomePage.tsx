import { useEffect, useState, type ReactNode } from 'react'
import { useApiDashboard } from '../../api/useApiDashboard'
import { AvatarApp as Avatar } from '../../components/AvatarApp/AvatarApp'
import { BoxApp as Box } from '../../components/BoxApp/BoxApp'
import { DividerApp as Divider } from '../../components/DividerApp/DividerApp'
import { IconApp } from '../../components/Icon/IconApp'
import { PaperApp as Paper } from '../../components/PaperApp/PaperApp'
import { ProgressApp as LinearProgress } from '../../components/ProgressApp/ProgressApp'
import { SkeletonApp as Skeleton } from '../../components/SkeletonApp/SkeletonApp'
import { StackApp as Stack } from '../../components/StackApp/StackApp'
import { TextApp as Typography } from '../../components/TextApp/TextApp'
import { useThemeApp } from '../../hook/useThemeApp'
import { useNavigationApp } from '../../hook/useNavigationApp'
import { PrivateRoutePath } from '../../routes/appRoutes'
import type {
  Dashboard,
  DashboardProdutoVendido,
  DashboardStatusPedido,
} from '../../types/DashboardTypes'
import {
  PedidoStatusColorMap,
  PedidoStatusLabel,
} from '../../types/PedidoTypes'
import { formatMoney, formatNumber } from '../../utils/moneyUtils'

const DashboardIcon = {
  Acesso: 'solar:login-3-linear',
  ArrowDown: 'solar:arrow-down-linear',
  ArrowUp: 'solar:arrow-up-linear',
  Clientes: 'solar:users-group-rounded-linear',
  Cobranca: 'solar:wallet-money-linear',
  Estoque: 'solar:box-linear',
  Pedido: 'solar:cart-large-2-linear',
  Produto: 'solar:bag-4-linear',
  Reservado: 'solar:lock-keyhole-minimalistic-linear',
} as const

type SectionCardProps = {
  title: string
  subtitle?: string
  accentColor?: string
  action?: ReactNode
  icon?: string
  order?: number
  children: ReactNode
}

function SectionCard({ title, subtitle, accentColor, action, icon, order, children }: SectionCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderTop: accentColor ? `4px solid ${accentColor}` : undefined,
        minWidth: 0,
        order,
        overflow: 'hidden',
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0 }}>
          {icon && accentColor && (
            <Box sx={{ bgcolor: accentColor, borderRadius: '50%', color: 'common.white', display: 'grid', flexShrink: 0, height: 38, placeItems: 'center', width: 38 }}>
              <IconApp icon={icon} width="1.25rem" />
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography component="h2" sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 750, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography color="text.secondary" variant="caption" sx={{ display: 'block', lineHeight: 1.4, mt: 0.25, opacity: 0.78 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {action}
      </Stack>
      {children}
    </Paper>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', my: { xs: 2, sm: 2.5 } }}>
      <Divider sx={{ flex: 1 }} />
      <Typography
        component="h2"
        sx={{ bgcolor: 'primary.main', borderRadius: 10, color: 'primary.contrastText', fontSize: '0.75rem', fontWeight: 700, px: 1.5, py: 0.5 }}
      >
        {label}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Stack>
  )
}

type KpiCardProps = {
  color: string
  icon: string
  label: string
  loading: boolean
  value: string
  colorWithOpacity: (color: string, opacity: number) => string
}

function KpiCard({ color, icon, label, loading, value, colorWithOpacity }: KpiCardProps) {
  return (
    <Paper variant="outlined" sx={{ borderTop: `4px solid ${color}`, minHeight: 126, minWidth: 0, p: { xs: 1.5, sm: 2 } }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" variant="body2">{label}</Typography>
          {loading ? (
            <Skeleton height={36} width={92} />
          ) : (
            <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.45rem' }, fontWeight: 700 }}>
              {value}
            </Typography>
          )}
        </Box>
        <Box sx={{ bgcolor: colorWithOpacity(color, 0.12), borderRadius: 1.5, color, display: 'grid', flexShrink: 0, height: 38, placeItems: 'center', width: 38 }}>
          <IconApp icon={icon} width="1.3125rem" />
        </Box>
      </Stack>
    </Paper>
  )
}

function LoadingRows() {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} height={34} variant="rounded" />)}
    </Stack>
  )
}

function EmptyState({ children }: { children: ReactNode }) {
  return <Typography color="text.secondary" variant="body2" sx={{ py: 1 }}>{children}</Typography>
}

function ProductList({ products }: { products: DashboardProdutoVendido[] }) {
  if (!products.length) return <EmptyState>Nenhum produto encontrado.</EmptyState>

  return (
    <Stack divider={<Divider flexItem />}>
      {products.map((product) => (
        <Stack key={`${product.id}-${product.peso ?? ''}-${product.tamanho ?? ''}`} direction="row" spacing={1.5} sx={{ alignItems: 'center', borderRadius: 1, px: 0.5, py: 1 }}>
          <Avatar src={product.foto ?? undefined} variant="rounded" sx={{ bgcolor: 'action.selected', height: 42, width: 42 }}>
            <IconApp icon={DashboardIcon.Produto} width="1.25rem" />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 600 }}>{product.descricao}</Typography>
            <Typography noWrap color="text.secondary" variant="caption">
              {[product.tamanho, product.peso].filter(Boolean).join(' · ') || 'Sem variação'}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0, textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMoney(product.valorTotal)}</Typography>
            <Typography color="text.secondary" variant="caption">{formatNumber(product.quantidade)} vendidos</Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}

export function HomePage() {
  const { colorWithOpacity, cores, getPaletteColor } = useThemeApp()
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
  const maxPedidosDia = Math.max(1, ...(dashboard?.pedidosPorDia ?? []).map((item) => item.total))
  const movimentos = dashboard?.movimentos ?? []
  const categoriasMovimento = Array.from(
    new Set(
      movimentos.flatMap((movimento) =>
        movimento.dados.map((item) => item.categoria.trim()),
      ),
    ),
  )
  const maxMovimentos = Math.max(
    1,
    ...movimentos.flatMap((movimento) =>
      movimento.dados.map((item) => item.quantidade),
    ),
  )
  const variacao = dashboard?.variacaoMensalPedido
  const variacaoPositiva = (variacao?.porcentagem ?? 0) >= 0
  const cobrancasMaisAntigas = dashboard?.cobranca.cobrancasMaisAntigas ?? []
  const totalCobrancasMaisAntigas = cobrancasMaisAntigas.reduce(
    (total, cobranca) => total + cobranca.valor,
    0,
  )

  const kpis = [
    { label: `Pedidos no período`, value: formatNumber(dashboard?.totalDePedidos ?? 0), icon: DashboardIcon.Pedido, color: cores.error },
    { label: 'Produtos em estoque', value: formatNumber(dashboard?.totalProdutoEstoque ?? 0), icon: DashboardIcon.Estoque, color: cores.success },
    { label: 'Produtos reservados', value: formatNumber(dashboard?.totalProdutoEstoqueReservado ?? 0), icon: DashboardIcon.Reservado, color: cores.warning },
    { label: 'Produtos disponíveis', value: formatNumber(dashboard?.quantidadeProdutoDisponivel ?? 0), icon: DashboardIcon.Produto, color: cores.info },
  ]

  return (
    <Box component="main" sx={{ height: '100%', maxWidth: 1600, minWidth: 0, mx: 'auto', overflowX: 'hidden', overflowY: 'auto', pr: { sm: 0.5 }, width: '100%' }}>
      <SectionDivider label="Financeiro e cobranças" />
      <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 }, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, mb: { xs: 1.5, sm: 2 } }}>
        <SectionCard title="Vencimento de parcelas" subtitle="Hoje e próximos 7 dias" accentColor={cores.info} icon="solar:calendar-mark-outline" order={1}>
          {loading ? <LoadingRows /> : (
            <Stack spacing={1.5}>
              <Box>
                <Typography color="success.main" variant="body2" sx={{ fontWeight: 700 }}>A receber</Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="body2">Hoje</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatMoney(dashboard?.parcelas.aReceberHoje ?? 0)}</Typography></Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="body2">Na semana</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatMoney(dashboard?.parcelas.aReceberSemana ?? 0)}</Typography></Stack>
              </Box>
              <Divider />
              <Box>
                <Typography color="error.main" variant="body2" sx={{ fontWeight: 700 }}>A pagar</Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="body2">Hoje</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatMoney(dashboard?.parcelas.aPagarHoje ?? 0)}</Typography></Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="body2">Na semana</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatMoney(dashboard?.parcelas.aPagarSemana ?? 0)}</Typography></Stack>
              </Box>
            </Stack>
          )}
        </SectionCard>

        <SectionCard title="Cobranças" subtitle="Valores pendentes" accentColor={cores.warning} icon={DashboardIcon.Cobranca} order={3}>
          {loading ? <LoadingRows /> : (
            <Stack spacing={1.25}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography color="text.secondary" variant="body2">Hoje</Typography><Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMoney(dashboard?.cobranca.totalHoje ?? 0)}</Typography></Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography color="text.secondary" variant="body2">Últimos 7 dias</Typography><Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMoney(dashboard?.cobranca.totalSemana ?? 0)}</Typography></Stack>
              <Divider />
              <Typography color="success.main" variant="h6">{formatMoney(dashboard?.cobranca.totalCobranca ?? 0)}</Typography>
              <Typography color="text.secondary" variant="body2">{formatNumber(dashboard?.cobranca.quantidadeACobrar ?? 0)} pedidos aguardando cobrança</Typography>
            </Stack>
          )}
        </SectionCard>

        <SectionCard title={`Variação de pedidos${variacao?.mes ? ` — ${variacao.mes}` : ''}`} subtitle="Comparação anual" accentColor={cores.error} icon={DashboardIcon.Pedido} order={2}>
          {loading ? <LoadingRows /> : !variacao ? <EmptyState>Variação indisponível.</EmptyState> : (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', color: variacaoPositiva ? 'success.main' : 'error.main' }}>
                <IconApp icon={variacaoPositiva ? DashboardIcon.ArrowUp : DashboardIcon.ArrowDown} width="1.5rem" />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatNumber(variacao.porcentagem)}%</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="body2">{variacao.anoAnterior}</Typography><Typography variant="body2" sx={{ fontWeight: 700 }}>{formatNumber(variacao.totalAnoAnterior)} pedidos</Typography></Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="body2">{variacao.anoAtual}</Typography><Typography variant="body2" sx={{ fontWeight: 700 }}>{formatNumber(variacao.totalAnoAtual)} pedidos</Typography></Stack>
            </Stack>
          )}
        </SectionCard>
        <SectionCard
          title="Cobranças mais antigas"
          subtitle="Pendências que exigem atenção"
          accentColor={cores.warning}
          icon="weui:time-outlined"
          order={4}
          action={!loading && cobrancasMaisAntigas.length > 0 ? (
            <Typography color="warning.main" variant="caption" sx={{ flexShrink: 0, fontWeight: 700, textAlign: 'right' }}>
              {cobrancasMaisAntigas.length} {cobrancasMaisAntigas.length === 1 ? 'cobrança' : 'cobranças'} · {formatMoney(totalCobrancasMaisAntigas)}
            </Typography>
          ) : undefined}
        >
          {loading ? <LoadingRows /> : !cobrancasMaisAntigas.length ? <EmptyState>Nenhuma cobrança pendente.</EmptyState> : (
            <Stack divider={<Divider flexItem />}>
              {cobrancasMaisAntigas.map((item) => (
                <Box key={item.pedidoId} sx={{ py: 1.25 }}>
                  <Typography noWrap variant="body2" sx={{ fontWeight: 650 }}>
                    Pedido #{item.numeroPedido} · {item.cliente}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 0.35 }}>
                    <Typography color="text.secondary" variant="caption">
                      {item.aDias} {item.aDias === 1 ? 'dia' : 'dias'} em aberto
                    </Typography>
                    <Typography color="warning.main" variant="body2" sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                      {formatMoney(item.valor)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </SectionCard>
      </Box>

      <SectionDivider label="Estoque" />
      <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, mb: { xs: 1.5, sm: 2 } }}>
        {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} loading={loading} colorWithOpacity={colorWithOpacity} />)}
      </Box>

      <SectionDivider label="Pedidos" />
      <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 }, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, mb: { xs: 1.5, sm: 2 } }}>
        <SectionCard title="Pedidos por status" subtitle="Distribuição atual">
          {loading ? <LoadingRows /> : !(dashboard?.statusPedido.length) ? <EmptyState>Nenhum pedido encontrado.</EmptyState> : (
            <Stack spacing={1.5}>{dashboard.statusPedido.map((item) => <StatusRow key={item.status} item={item} color={getPaletteColor(PedidoStatusColorMap[item.status])} colorWithOpacity={colorWithOpacity} />)}</Stack>
          )}
        </SectionCard>
        <SectionCard title="Volume por dia" subtitle="Pedidos gerados nos últimos 7 dias">
          {loading ? <LoadingRows /> : !(dashboard?.pedidosPorDia.length) ? <EmptyState>Nenhum pedido no período.</EmptyState> : (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end', height: 190, pt: 1 }}>
              {dashboard.pedidosPorDia.map((item) => (
                <Stack key={item.data} spacing={0.75} sx={{ alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatNumber(item.total)}</Typography>
                  <Box title={`${item.diaSemana}: ${item.total}`} sx={{ bgcolor: 'primary.main', borderRadius: '5px 5px 0 0', minHeight: 4, width: '70%', height: `${Math.max(3, (item.total / maxPedidosDia) * 72)}%` }} />
                  <Typography color="text.secondary" noWrap variant="caption" sx={{ maxWidth: '100%' }}>{item.diaSemana.slice(0, 3)}</Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </SectionCard>
      </Box>

      <SectionDivider label="Produtos" />
      <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 }, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, mb: { xs: 1.5, sm: 2 } }}>
        <SectionCard title="Produtos mais vendidos" subtitle="Quantidade vendida">{loading ? <LoadingRows /> : <ProductList products={dashboard?.produtosMaisVendidos ?? []} />}</SectionCard>
        <SectionCard title="Produtos menos vendidos" subtitle="Quantidade vendida">{loading ? <LoadingRows /> : <ProductList products={dashboard?.produtosMenosVendidos ?? []} />}</SectionCard>
      </Box>

      <SectionDivider label="Indicadores" />
      <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 }, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 2fr) minmax(280px, 1fr)' }, mb: 2 }}>
        <SectionCard
          title="Movimentação por categoria"
          subtitle="Quantidade movimentada por mês"
          action={(
            <Typography
              color="text.secondary"
              variant="caption"
              sx={{ bgcolor: 'action.selected', border: '1px solid', borderColor: 'divider', borderRadius: 10, flexShrink: 0, fontWeight: 700, px: 1.25, py: 0.4 }}
            >
              {movimentos.length} {movimentos.length === 1 ? 'mês' : 'meses'}
            </Typography>
          )}
        >
          {loading ? <LoadingRows /> : !movimentos.length ? <EmptyState>Nenhuma movimentação encontrada.</EmptyState> : (
            <Stack spacing={1.75}>
              {movimentos.map((movimento) => (
                <Box key={`${movimento.mes}-${movimento.data}`}>
                  <Typography
                    variant="overline"
                    sx={{
                      bgcolor: colorWithOpacity(cores.primary, 0.08),
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      borderRadius: '0 6px 6px 0',
                      color: 'text.primary',
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      lineHeight: 1.8,
                      mb: 0.75,
                      px: 1,
                      py: 0.25,
                    }}
                  >
                    {movimento.mes}
                  </Typography>
                  <Stack spacing={0.75}>
                    {categoriasMovimento.map((categoria) => {
                      const quantidade = movimento.dados.find(
                        (item) => item.categoria.trim() === categoria,
                      )?.quantidade ?? 0

                      return (
                        <Stack
                          key={categoria}
                          title={`${categoria}, ${movimento.mes}: ${formatNumber(quantidade)}`}
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'center', minHeight: 22 }}
                        >
                          <Typography color="text.secondary" noWrap variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 500, opacity: 0.82, width: { xs: 90, sm: 130 } }}>
                            {categoria}
                          </Typography>
                          <LinearProgress
                            aria-label={`${categoria}, ${movimento.mes}: ${quantidade}`}
                            variant="determinate"
                            value={(quantidade / maxMovimentos) * 100}
                            sx={{
                              bgcolor: colorWithOpacity(cores.primary, 0.1),
                              borderRadius: 4,
                              flex: 1,
                              height: 7,
                              '& .MuiLinearProgress-bar': { borderRadius: 4 },
                            }}
                          />
                          <Typography color="text.primary" variant="caption" sx={{ fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums', fontWeight: 750, textAlign: 'right', width: 52 }}>
                            {formatNumber(quantidade)}
                          </Typography>
                        </Stack>
                      )
                    })}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </SectionCard>
        <SectionCard title="E-commerce" subtitle="Indicadores de clientes">
          {loading ? <LoadingRows /> : (
            <Stack divider={<Divider flexItem />}>
              <IndicatorRow icon={DashboardIcon.Acesso} label="Acessos no mês" value={dashboard?.quantidadeDeAcessoEcommerce ?? 0} />
              <IndicatorRow icon={DashboardIcon.Clientes} label="Clientes CNPJ" onClick={() => navigate(PrivateRoutePath.ClienteUltimosPedidosCnpj)} value={dashboard?.quantidadeDeUsuarioCnpj ?? 0} />
              <IndicatorRow icon={DashboardIcon.Clientes} label="Clientes CPF" onClick={() => navigate(PrivateRoutePath.ClienteUltimosPedidosCpf)} value={dashboard?.quantidadeDeUsuarioCpf ?? 0} />
            </Stack>
          )}
        </SectionCard>
      </Box>

      <Box sx={{ height: 16 }} />
    </Box>
  )
}

function StatusRow({ item, color, colorWithOpacity }: { item: DashboardStatusPedido; color: string; colorWithOpacity: (color: string, opacity: number) => string }) {
  const label = PedidoStatusLabel[item.status] ?? String(item.status)
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2">{label}</Typography><Typography variant="body2" sx={{ fontWeight: 700 }}>{formatNumber(item.quantidade)} ({formatNumber(item.porcentagem)}%)</Typography></Stack>
      <LinearProgress variant="determinate" value={Math.min(100, item.porcentagem)} sx={{ bgcolor: colorWithOpacity(color, 0.12), borderRadius: 4, height: 8, '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }} />
    </Box>
  )
}

function IndicatorRow({ icon, label, onClick, value }: { icon: string; label: string; onClick?: () => void; value: number }) {
  return (
    <Stack
      direction="row"
      onClick={onClick}
      role={onClick ? 'link' : undefined}
      spacing={1.5}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) onClick()
      }}
      sx={{
        alignItems: 'center',
        borderRadius: 1,
        cursor: onClick ? 'pointer' : undefined,
        px: onClick ? 0.75 : 0,
        py: 1.25,
        '&:hover': onClick ? { bgcolor: 'action.hover' } : undefined,
      }}
    >
      <Box sx={{ bgcolor: 'action.selected', borderRadius: 1.5, color: 'primary.main', display: 'grid', height: 36, placeItems: 'center', width: 36 }}><IconApp icon={icon} width="1.1875rem" /></Box>
      <Typography variant="body2" sx={{ flex: 1 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatNumber(value)}</Typography>
    </Stack>
  )
}
