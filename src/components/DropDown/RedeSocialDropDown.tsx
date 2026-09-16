import { redeSocialOpcoes, type RedeSocialTipo } from '../../types/ParceiroTypes'
import { DropDownApp } from './DropDownApp'

const opcoes = redeSocialOpcoes.map((opcao) => ({
  label: opcao.descricao,
  value: opcao.id,
}))

type RedeSocialDropDownProps = {
  id: string
  onChange: (value?: RedeSocialTipo) => void
  value?: RedeSocialTipo
}

export function RedeSocialDropDown({ id, onChange, value }: RedeSocialDropDownProps) {
  return (
    <DropDownApp
      id={id}
      keyLabel="label"
      label="Tipo"
      onChange={(_, newValue?: RedeSocialTipo) => onChange(newValue)}
      value={opcoes.find((opcao) => opcao.value === value)}
      values={opcoes}
    />
  )
}
