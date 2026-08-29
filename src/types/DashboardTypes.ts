import type { PedidoStatus } from './PedidoTypes'

export interface DashboardVariacaoMensalPedido {
  mes: string
  totalAnoAnterior: number
  totalAnoAtual: number
  porcentagem: number
  anoAtual: number
  anoAnterior: number
}

export interface DashboardStatusPedido {
  quantidade: number
  status: PedidoStatus
  porcentagem: number
}

export interface DashboardPedidoPorDia {
  data: string
  total: number
  diaSemana: string
}

export interface DashboardProdutoVendido {
  id: string
  descricao: string
  foto?: string | null
  peso?: string | null
  tamanho?: string | null
  quantidade: number
  valorUnitario: number
  valorTotal: number
}

export interface DashboardMovimentoProduto {
  mes: string
  data: string
  dados: {
    quantidade: number
    categoria: string
  }[]
}

export interface DashboardParcelas {
  aReceberHoje: number
  aReceberSemana: number
  aPagarHoje: number
  aPagarSemana: number
}

export interface DashboardCobrancaAntiga {
  pedidoId: string
  numeroPedido: number
  valor: number
  data: string
  aDias: number
  cliente: string
}

export interface DashboardCobranca {
  totalHoje: number
  totalSemana: number
  totalCobranca: number
  quantidadeACobrar: number
  cobrancasMaisAntigas: DashboardCobrancaAntiga[]
}

export interface Dashboard {
  variacaoMensalPedido?: DashboardVariacaoMensalPedido | null
  movimentos: DashboardMovimentoProduto[]
  totalAReceber: number
  statusPedido: DashboardStatusPedido[]
  quantidadeDeAcessoEcommerce: number
  quantidadeDeUsuarioCnpj: number
  quantidadeDeUsuarioCpf: number
  totalProdutoEstoque: number
  totalProdutoEstoqueReservado: number
  quantidadeProdutoDisponivel: number
  totalDePedidos: number
  cobranca: DashboardCobranca
  parcelas: DashboardParcelas
  pedidosPorDia: DashboardPedidoPorDia[]
  produtosMaisVendidos: DashboardProdutoVendido[]
  produtosMenosVendidos: DashboardProdutoVendido[]
}
