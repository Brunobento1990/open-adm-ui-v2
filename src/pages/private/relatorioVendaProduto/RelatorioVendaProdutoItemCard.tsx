import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppComponent,
  BoxAppDisplay,
  BoxAppJustifyContent,
} from '../../../components/BoxApp/boxAppTypes'
import { IconApp } from '../../../components/Icon/IconApp'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { RelatorioVendaProdutoItem } from '../../../types/RelatorioVendaProdutoTypes'
import { formatMoney, formatNumber } from '../../../utils/moneyUtils'

export function RelatorioVendaProdutoItemCard({ item }: { item: RelatorioVendaProdutoItem }) {
  const { cores } = useThemeApp()
  const variacao = item.peso || item.tamanho || '-'

  return (
    <PaperApp padding={1.5} sx={{ boxShadow: 'none' }} variant="outlined">
      <BoxApp alignItems={BoxAppAlignItems.Center} display={BoxAppDisplay.Flex} gap={1.5}>
        {item.foto ? (
          <BoxApp
            alt={item.descricao}
            borderRadius={1}
            component={BoxAppComponent.Img}
            height={48}
            objectFit="cover"
            src={item.foto}
            width={48}
          />
        ) : (
          <IconApp color={cores.primary} icon="solar:box-linear" width="2rem" />
        )}
        <BoxApp flex={1} minWidth={0}>
          <TextApp weight={TextAppWeight.Bold}>{item.descricao}</TextApp>
          <TextApp color={TextAppColor.Secondary}>Peso/Tamanho: {variacao}</TextApp>
        </BoxApp>
      </BoxApp>
      <BoxApp
        display={BoxAppDisplay.Flex}
        justifyContent={BoxAppJustifyContent.SpaceBetween}
        mt={1.5}
      >
        <TextApp>Quantidade: {formatNumber(item.quantidade)}</TextApp>
        <TextApp color="success.main" weight={TextAppWeight.Bold}>
          {formatMoney(item.valorTotal)}
        </TextApp>
      </BoxApp>
    </PaperApp>
  )
}
