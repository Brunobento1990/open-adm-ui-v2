import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppAlignItems, BoxAppComponent, BoxAppDisplay, BoxAppJustifyContent } from '../../../components/BoxApp/boxAppTypes'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { PedidoItemForm } from '../../../types/PedidoTypes'
import { formatMoney } from '../../../utils/moneyUtils'

type PedidoItemCardProps = {
  item: PedidoItemForm
  onRemove: () => void
}

export function PedidoItemCard({ item, onRemove }: PedidoItemCardProps) {
  const { cores } = useThemeApp()
  const variacao = item.tamanho?.descricao ?? item.peso?.descricao ?? '-'
  const total = (item.valorUnitario ?? 0) * (item.quantidade ?? 0)

  return (
    <PaperApp
      padding={1.5}
      sx={{ border: '1px solid', borderColor: 'divider', borderLeft: '3px solid', borderLeftColor: 'primary.main', boxShadow: 'none' }}
      variant="outlined"
    >
      <StackApp spacing={1.5}>
        <BoxApp
          alignItems={BoxAppAlignItems.Center}
          display={BoxAppDisplay.Flex}
          gap={1.5}
          justifyContent={BoxAppJustifyContent.SpaceBetween}
        >
          <BoxApp alignItems={BoxAppAlignItems.Center} display={BoxAppDisplay.Flex} gap={1.5} minWidth={0}>
            {item.produto?.foto && (
              <BoxApp
                alt={item.produto.descricao}
                borderRadius={1}
                component={BoxAppComponent.Img}
                height={48}
                objectFit="contain"
                src={item.produto.foto}
                width={48}
              />
            )}
            {!item.produto?.foto && <IconApp color={cores.primary} icon="solar:box-linear" width="2rem" />}
            <BoxApp minWidth={0}>
              <TextApp noWrap weight={TextAppWeight.SemiBold}>{item.produto?.descricao ?? '-'}</TextApp>
              <TextApp color={TextAppColor.Secondary}>{variacao}</TextApp>
            </BoxApp>
          </BoxApp>
          <IconButtonComTolltip aria-label="Excluir item" color="error" onClick={onRemove} tooltip="Excluir item">
            <IconApp icon="solar:trash-bin-trash-bold" />
          </IconButtonComTolltip>
        </BoxApp>
        <BoxApp display={BoxAppDisplay.Flex} gap={2} justifyContent={BoxAppJustifyContent.SpaceBetween}>
          <TextApp>Quantidade: {item.quantidade ?? 0}</TextApp>
          <TextApp>Unitário: {formatMoney(item.valorUnitario ?? 0)}</TextApp>
          <TextApp color="success.main" weight={TextAppWeight.Bold}>Total: {formatMoney(total)}</TextApp>
        </BoxApp>
      </StackApp>
    </PaperApp>
  )
}
