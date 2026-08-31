import { FormRoot } from '../../form'
import type { ParcelaCriar } from '../../types/FaturaTypes'
import { BoxApp } from '../BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppJustifyContent,
} from '../BoxApp/boxAppTypes'
import { MeioDePagamentoDropDown } from '../DropDown/MeioDePagamentoDropDown'
import { InputApp } from '../InputApp/InputApp'
import { InputAppType } from '../InputApp/inputAppTypes'
import { TextApp, TextAppColor, TextAppWeight } from '../TextApp/TextApp'

type Props = { index: number; onChange: (value: ParcelaCriar) => void; parcela: ParcelaCriar }

export function FaturaParcelaCard({ index, onChange, parcela }: Props) {
  return (
    <FormRoot.FormItemRow sm={3} xs={12}>
      <BoxApp
        border="1px solid"
        borderColor="divider"
        borderRadius="8px"
        boxSizing="border-box"
        display={BoxAppDisplay.Flex}
        flexDirection={BoxAppFlexDirection.Column}
        gap="1rem"
        height="100%"
        padding="1rem"
      >
        <BoxApp
          alignItems={BoxAppAlignItems.Center}
          display={BoxAppDisplay.Flex}
          justifyContent={BoxAppJustifyContent.SpaceBetween}
        >
          <TextApp color={TextAppColor.Primary} weight={TextAppWeight.SemiBold}>
            Parcela {parcela.numeroDaParcela}
          </TextApp>
          <InputApp
            checked={parcela.aVista}
            id={`aVista-${index}`}
            label="À vista"
            onChange={(_, value) => onChange({ ...parcela, aVista: Boolean(value) })}
            type={InputAppType.Checkbox}
          />
        </BoxApp>
        <InputApp
          id={`vencimento-${index}`}
          label="Vencimento"
          name={`vencimento-${index}`}
          onChange={(_, value) => onChange({ ...parcela, dataDeVencimento: String(value) })}
          required
          type={InputAppType.Date}
          value={parcela.dataDeVencimento}
        />
        <MeioDePagamentoDropDown
          id={`meioDePagamento-${index}`}
          onChange={(value) => onChange({ ...parcela, meioDePagamento: value })}
          required
          value={parcela.meioDePagamento}
        />
        <InputApp
          disabled
          id={`valor-${index}`}
          label="Valor"
          name={`valor-${index}`}
          startAdornment="R$"
          type={InputAppType.Currency}
          value={parcela.valor}
        />
      </BoxApp>
    </FormRoot.FormItemRow>
  )
}
