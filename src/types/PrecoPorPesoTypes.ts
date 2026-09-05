import type { Peso } from './PesoTypes'

export enum PrecoPorPesoFormField {
  PesoId = 'pesoId',
  ValorUnitarioAtacado = 'valorUnitarioAtacado',
  ValorUnitarioVarejo = 'valorUnitarioVarejo',
}

export interface PrecoPorPesoFormValues {
  pesoId?: string
  peso?: Peso
  valorUnitarioAtacado?: number | ''
  valorUnitarioVarejo?: number | ''
}

export interface AtualizarPrecoPorPesoPayload {
  pesoId: string
  valorUnitarioAtacado?: number
  valorUnitarioVarejo?: number
}
