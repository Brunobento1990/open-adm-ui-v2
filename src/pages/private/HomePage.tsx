import { useEffect, useState, type ReactNode } from 'react'
import { useApiHomeRepresentante } from '../../api/useApiHomeRepresentante'
import { BoxApp as Box } from '../../components/BoxApp/BoxApp'
import { DividerApp as Divider } from '../../components/DividerApp/DividerApp'
import { IconApp } from '../../components/Icon/IconApp'
import { PaperApp as Paper } from '../../components/PaperApp/PaperApp'
import { SkeletonApp as Skeleton } from '../../components/SkeletonApp/SkeletonApp'
import { StackApp as Stack } from '../../components/StackApp/StackApp'
import { TextApp as Typography } from '../../components/TextApp/TextApp'
import { useThemeApp } from '../../hook/useThemeApp'
import type {
  DashboardResumoMensalCategoria,
  DashboardVariacaoMensal,
  HomeRepresentante,
} from '../../types/DashboardTypes'
import { formatMoney, formatNumber } from '../../utils/moneyUtils'

const HomeIcon = {
  ArrowDown: 'solar:arrow-down-linear',
  ArrowUp: 'solar:arrow-up-linear',
  Categorias: 'solar:chart-2-linear',
  Itens: 'solar:box-minimalistic-linear',
  Pedidos: 'solar:clipboard-list-linear',
  Valor: 'solar:wad-of-money-linear',
} as const

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

type SectionCardProps = {
  accentColor: string
  children: ReactNode
  icon: string
  subtitle: string
  title: string
}

function SectionCard({ accentColor, children, icon, subtitle, title }: SectionCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderTop: `4px solid ${accentColor}`, minWidth: 0, overflow: 'hidden', p: 2 }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            bgcolor: accentColor,
            borderRadius: '50%',
            color: 'common.white',
            display: 'grid',
            flexShrink: 0,
            height: 38,
            placeItems: 'center',
            width: 38,
          }}
        >
          <IconApp icon={icon} width="1.25rem" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h2" sx={{ fontSize: '1rem', fontWeight: 750, lineHeight: 1.3 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
      {children}
    </Paper>
  )
}

function LoadingRows() {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} height={34} variant="rounded" />
      ))}
    </Stack>
  )
}

type MonthlySummaryCardProps = {
  color: string
  currentPeriod: string
  formatter: (value: number) => string
  icon: string
  label: string
  loading: boolean
  previousPeriod: string
  value?: DashboardVariacaoMensal
  valueColor?: string
}

function MonthlySummaryCard({
  color,
  currentPeriod,
  formatter,
  icon,
  label,
  loading,
  previousPeriod,
  value,
  valueColor = 'text.primary',
}: MonthlySummaryCardProps) {
  const variation = value?.variacaoPercentual ?? 0
  const variationColor =
    variation > 0 ? 'success.main' : variation < 0 ? 'error.main' : 'text.secondary'
  const variationIcon = variation >= 0 ? HomeIcon.ArrowUp : HomeIcon.ArrowDown

  return (
    <SectionCard
      accentColor={color}
      icon={icon}
      subtitle="Comparação com o mesmo mês do ano anterior"
      title={label}
    >
      {loading ? (
        <LoadingRows />
      ) : (
        <Stack spacing={1.25}>
          <Box>
            <Typography color={valueColor} variant="h5" sx={{ fontWeight: 750 }}>
              {formatter(value?.atual ?? 0)}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              em {currentPeriod}
            </Typography>
          </Box>
          <Divider />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
            <Typography color="text.secondary" variant="body2">
              <Box component="span" sx={{ color: 'text.primary', fontWeight: 650 }}>
                {formatter(value?.anoAnterior ?? 0)}
              </Box>{' '}
              em {previousPeriod}
            </Typography>
            <Stack direction="row" spacing={0.4} sx={{ alignItems: 'center' }}>
              {variation !== 0 && <IconApp icon={variationIcon} width="1rem" />}
              <Typography color={variationColor} variant="body2" sx={{ fontWeight: 750 }}>
                {formatNumber(Math.abs(variation))}%
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </SectionCard>
  )
}

function MonthlyCategories({
  categories,
  color,
  loading,
  previousPeriod,
}: {
  categories: DashboardResumoMensalCategoria[]
  color: string
  loading: boolean
  previousPeriod: string
}) {
  return (
    <SectionCard
      accentColor={color}
      icon={HomeIcon.Categorias}
      subtitle="Comparação com o mesmo mês do ano anterior"
      title="Itens vendidos por categoria"
    >
      {loading ? (
        <LoadingRows />
      ) : categories.length === 0 ? (
        <Typography color="text.secondary" variant="body2" sx={{ py: 1 }}>
          Nenhuma venda por categoria neste período.
        </Typography>
      ) : (
        <Stack divider={<Divider flexItem />}>
          {categories.map((item) => {
            const variation = item.quantidadeItensVendidos.variacaoPercentual
            const variationColor =
              variation > 0 ? 'success.main' : variation < 0 ? 'error.main' : 'text.secondary'
            const variationIcon = variation >= 0 ? HomeIcon.ArrowUp : HomeIcon.ArrowDown

            return (
              <Stack key={item.categoriaId} spacing={0.35} sx={{ py: 1.25 }}>
                <Typography noWrap variant="body2" sx={{ fontWeight: 650 }}>
                  {item.categoria}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 750 }}>
                  {formatNumber(item.quantidadeItensVendidos.atual)} itens
                </Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="caption">
                    {formatNumber(item.quantidadeItensVendidos.anoAnterior)} em {previousPeriod}
                  </Typography>
                  <Stack direction="row" spacing={0.4} sx={{ alignItems: 'center' }}>
                    {variation !== 0 && <IconApp icon={variationIcon} width="1rem" />}
                    <Typography color={variationColor} variant="caption" sx={{ fontWeight: 750 }}>
                      {formatNumber(Math.abs(variation))}%
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      )}
    </SectionCard>
  )
}

export function HomePage() {
  const { cores } = useThemeApp()
  const homeApi = useApiHomeRepresentante()
  const [home, setHome] = useState<HomeRepresentante>()

  useEffect(() => {
    void homeApi.obter.fetch().then((response) => {
      if (response) setHome(response)
    })
    // A consulta deve ocorrer somente na montagem da tela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loading = homeApi.obter.loading && !home
  const resumo = home?.resumoMensal
  const currentYear = resumo?.anoAtual ?? new Date().getFullYear()
  const previousYear = resumo?.anoAnterior ?? currentYear - 1
  const month = resumo ? monthFormatter.format(new Date(resumo.anoAtual, resumo.mes - 1, 1)) : ''
  const currentPeriod = month ? `${month}/${currentYear}` : String(currentYear)
  const previousPeriod = month ? `${month}/${previousYear}` : String(previousYear)

  return (
    <Box component="main" sx={{ maxWidth: 1600, mx: 'auto', overflowY: 'auto', width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2.5 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography
          component="h1"
          sx={{
            bgcolor: 'primary.main',
            borderRadius: 10,
            color: 'primary.contrastText',
            fontSize: '0.75rem',
            fontWeight: 700,
            px: 1.5,
            py: 0.5,
          }}
        >
          {month ? `Resumo mensal · ${month}` : 'Resumo mensal'}
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Stack>

      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        <MonthlySummaryCard
          color={cores.primary}
          currentPeriod={currentPeriod}
          formatter={formatNumber}
          icon={HomeIcon.Pedidos}
          label="Pedidos"
          loading={loading}
          previousPeriod={previousPeriod}
          value={resumo?.quantidadePedidos}
        />
        <MonthlySummaryCard
          color={cores.success}
          currentPeriod={currentPeriod}
          formatter={formatMoney}
          icon={HomeIcon.Valor}
          label="Valor vendido"
          loading={loading}
          previousPeriod={previousPeriod}
          value={resumo?.valorTotalVendido}
          valueColor="success.main"
        />
        <MonthlySummaryCard
          color={cores.info}
          currentPeriod={currentPeriod}
          formatter={formatNumber}
          icon={HomeIcon.Itens}
          label="Itens vendidos"
          loading={loading}
          previousPeriod={previousPeriod}
          value={resumo?.quantidadeItensVendidos}
        />
        <MonthlyCategories
          categories={resumo?.categorias ?? []}
          color={cores.primary}
          loading={loading}
          previousPeriod={previousPeriod}
        />
      </Box>
    </Box>
  )
}
