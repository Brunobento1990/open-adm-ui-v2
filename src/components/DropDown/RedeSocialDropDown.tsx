import { redeSocialOpcoes, type RedeSocialTipo } from '../../types/ParceiroTypes'
import { DropDownApp } from './DropDownApp'

type RedeSocialDropDownProps = {
  id: string
  onChange: (value?: RedeSocialTipo) => void
  value?: RedeSocialTipo
}

export function RedeSocialDropDown({ id, onChange, value }: RedeSocialDropDownProps) {
  return (
    <DropDownApp
      id={id}
      keyLabel="descricao"
      label="Tipo"
      onChange={(_, newValue?: RedeSocialTipo) => onChange(newValue)}
      value={redeSocialOpcoes.find((option) => option.id === value)}
      values={[...redeSocialOpcoes]}
    />
  )
}
