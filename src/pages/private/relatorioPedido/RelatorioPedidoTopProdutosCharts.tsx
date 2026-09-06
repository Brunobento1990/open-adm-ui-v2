import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppDisplay } from '../../../components/BoxApp/boxAppTypes'
import { BarChartApp } from '../../../components/Chart/BarChartApp'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import type { RelatorioPedidoTotaisUsuario, RelatorioPedidoTopProduto } from '../../../types/PedidoTypes'
import { TipoPaletaCorEnum } from '../../../types/TipoPaletaCorEnum'
import { formatMoney, formatNumber } from '../../../utils/moneyUtils'

function criarSerie(
  produtos: RelatorioPedidoTopProduto[],
  obterValor: (produto: RelatorioPedidoTopProduto) => number,
) {
  return produtos.map(obterValor)
}

export function RelatorioPedidoTopProdutosCharts({ totaisUsuario }: { totaisUsuario: RelatorioPedidoTotaisUsuario }) {
  const produtosPorQuantidade = totaisUsuario.topProdutosPorQuantidade ?? []
  const produtosPorValor = totaisUsuario.topProdutosPorValor ?? []

  if (produtosPorQuantidade.length === 0 && produtosPorValor.length === 0) return null

  return (
    <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
      <TextApp fontSize="1.1rem" weight={TextAppWeight.SemiBold}>{totaisUsuario.usuario}</TextApp>
      <BoxApp display={BoxAppDisplay.Grid} gap={2} sx={{ gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' } }}>
        <BoxApp minWidth={0}>
          <TextApp weight={TextAppWeight.SemiBold}>Top produtos por quantidade</TextApp>
          <BarChartApp
            labels={produtosPorQuantidade.map((produto) => produto.produto)}
            series={[{ data: criarSerie(produtosPorQuantidade, (produto) => produto.quantidade), label: 'Quantidade' }]}
            valueFormatter={formatNumber}
          />
        </BoxApp>
        <BoxApp minWidth={0}>
          <TextApp weight={TextAppWeight.SemiBold}>Top produtos por valor</TextApp>
          <BarChartApp
            labels={produtosPorValor.map((produto) => produto.produto)}
            series={[{ color: TipoPaletaCorEnum.Success, data: criarSerie(produtosPorValor, (produto) => produto.valorTotal), label: 'Valor total' }]}
            valueFormatter={formatMoney}
          />
        </BoxApp>
      </BoxApp>
    </PaperApp>
  )
}
