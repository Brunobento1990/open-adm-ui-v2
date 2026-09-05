import type { Tamanho } from './TamanhoTypes'

export enum PrecoPorTamanhoFormField {
  TamanhoId = 'tamanhoId',
  ValorUnitarioAtacado = 'valorUnitarioAtacado',
  ValorUnitarioVarejo = 'valorUnitarioVarejo',
}

export interface PrecoPorTamanhoFormValues {
  tamanhoId?: string
  tamanho?: Tamanho
  valorUnitarioAtacado?: number | ''
  valorUnitarioVarejo?: number | ''
}

export interface AtualizarPrecoPorTamanhoPayload {
  tamanhoId: string
  valorUnitarioAtacado?: number
  valorUnitarioVarejo?: number
}
