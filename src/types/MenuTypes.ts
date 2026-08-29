export interface Menu {
  id: number
  nome: string
  caminho?: string
  icone: string
  filhos: Menu[]
}

export function isMenu(value: Menu): value is Menu {
  return typeof value === 'object' && value !== null
}
