import { MeioDePagamento } from '../../types/FaturaTypes'
import { DropDownApp } from './DropDownApp'

const options = [
  { label: 'Dinheiro', value: MeioDePagamento.Dinheiro },
  { label: 'Pix', value: MeioDePagamento.Pix },
  { label: 'Cartão de débito', value: MeioDePagamento.CartaoDeDebito },
  { label: 'Cartão de crédito', value: MeioDePagamento.CartaoDeCredito },
  { label: 'Boleto', value: MeioDePagamento.Boleto },
]

type Props = {
  id: string
  onChange: (value?: MeioDePagamento) => void
  required?: boolean
  value?: MeioDePagamento | string
}

export function MeioDePagamentoDropDown({ id, onChange, required, value }: Props) {
  return (
    <DropDownApp
      id={id}
      label="Meio de pagamento"
      onChange={(_, newValue) => {
        onChange(newValue ? (Number(newValue) as MeioDePagamento) : undefined)
      }}
      values={options}
      required={required}
      value={options.find((option) => option.value === value) as any}
      keyLabel="label"
    />
  )
}
