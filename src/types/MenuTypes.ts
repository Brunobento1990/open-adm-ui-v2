export type MenuFilho = Menu | string

export interface Menu {
  id: number
  dataDeCriacao: string
  paiId: number
  nome: string
  caminho?: string
  icone: string
  filhos: MenuFilho[]
}

export function isMenu(value: MenuFilho): value is Menu {
  return typeof value === 'object' && value !== null
}
