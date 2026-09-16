import type { ParcelaRenegociacao, ParcelaSugerida } from '../types/FaturaTypes'

export function saldoParcelas(parcelas: ParcelaSugerida[]) {
  return parcelas.reduce((total, parcela) =>
    total + Math.round(parcela.valorAPagarAReceber * 100), 0) / 100
}

export function parcelasDaSugestao(parcelas: ParcelaSugerida[]): ParcelaRenegociacao[] {
  return parcelas.map((parcela) => ({
    dataDeVencimento: parcela.dataDeVencimento.slice(0, 10),
    meioDePagamento: parcela.meioDePagamento ?? undefined,
    numeroDaParcela: parcela.numeroDaParcela,
    valor: Math.round(parcela.valorAPagarAReceber * 100) / 100,
  }))
}

export function parcelasSomamSaldo(parcelas: ParcelaRenegociacao[], saldo: number) {
  return parcelas.reduce((total, parcela) => total + Math.round(parcela.valor * 100), 0)
    === Math.round(saldo * 100)
}
