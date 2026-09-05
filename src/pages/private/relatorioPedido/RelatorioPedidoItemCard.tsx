import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppDisplay, BoxAppJustifyContent } from '../../../components/BoxApp/boxAppTypes'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import type { RelatorioPedidoItem } from '../../../types/PedidoTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney, formatNumber } from '../../../utils/moneyUtils'

export function RelatorioPedidoItemCard({ item }: { item: RelatorioPedidoItem }) {
  return (
    <PaperApp padding={1.5} sx={{ boxShadow: 'none' }} variant="outlined">
      <BoxApp display={BoxAppDisplay.Flex} justifyContent={BoxAppJustifyContent.SpaceBetween}>
        <TextApp weight={TextAppWeight.Bold}>Pedido #{item.numero}</TextApp>
        <TextApp color={TextAppColor.Secondary}>{formatarDataHoraUtcLocal(item.dataDeCriacao)}</TextApp>
      </BoxApp>
      <TextApp>{item.usuario}</TextApp>
      <BoxApp display={BoxAppDisplay.Flex} justifyContent={BoxAppJustifyContent.SpaceBetween} mt={1}>
        <TextApp>Itens: {formatNumber(item.quantidadeItens)}</TextApp>
        <TextApp color="success.main" weight={TextAppWeight.Bold}>{formatMoney(item.valorTotal)}</TextApp>
      </BoxApp>
    </PaperApp>
  )
}
