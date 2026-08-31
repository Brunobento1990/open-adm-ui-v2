import { MeioDePagamento, type ParcelaCriar } from '../types/FaturaTypes'

export function gerarParcelas(valor: number, quantidade: number): ParcelaCriar[] {
  if (!valor || !Number.isInteger(quantidade) || quantidade < 1) return []
  const total = Math.round(valor * 100)
  const base = Math.floor(total / quantidade)
  const restante = total - base * quantidade

  return Array.from({ length: quantidade }, (_, index) => ({
    aVista: false,
    dataDeVencimento: proximoVencimento(index + 1),
    numeroDaParcela: index + 1,
    meioDePagamento: MeioDePagamento.Dinheiro,
    valor: (base + (index === quantidade - 1 ? restante : 0)) / 100,
    desconto: 0,
  }))
}

function proximoVencimento(meses: number) {
  const hoje = new Date()
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth() + meses, 1)
  const ultimoDia = new Date(primeiroDia.getFullYear(), primeiroDia.getMonth() + 1, 0).getDate()
  const dia = Math.min(hoje.getDate(), ultimoDia)
  return [
    primeiroDia.getFullYear(),
    String(primeiroDia.getMonth() + 1).padStart(2, '0'),
    String(dia).padStart(2, '0'),
  ].join('-')
}
