import { BarChart } from '@mui/x-charts/BarChart'
import { useThemeApp } from '../../hook/useThemeApp'
import { TipoPaletaCorEnum } from '../../types/TipoPaletaCorEnum'

export type BarChartAppSeries = {
  color?: TipoPaletaCorEnum
  data: number[]
  label: string
}

type BarChartAppProps = {
  height?: number
  labels: string[]
  series: BarChartAppSeries[]
  valueFormatter?: (value: number) => string
}

export function BarChartApp({ height, labels, series, valueFormatter }: BarChartAppProps) {
  const { getPaletteColor, isCelular } = useThemeApp()
  const chartHeight = height ?? Math.max(320, labels.length * 30 + 100)

  return (
    <BarChart
      height={chartHeight}
      layout="horizontal"
      series={series.map((item) => ({
        color: getPaletteColor(item.color ?? TipoPaletaCorEnum.Primary),
        data: item.data,
        label: item.label,
        valueFormatter: (value) => valueFormatter?.(value ?? 0) ?? String(value ?? 0),
      }))}
      yAxis={[{ data: labels, scaleType: 'band', width: isCelular ? 105 : 210 }]}
    />
  )
}
