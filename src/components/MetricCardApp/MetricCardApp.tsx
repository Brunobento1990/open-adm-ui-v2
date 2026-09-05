import { BoxApp } from '../BoxApp/BoxApp'
import { BoxAppAlignItems, BoxAppDisplay } from '../BoxApp/boxAppTypes'
import { IconApp } from '../Icon/IconApp'
import { PaperApp } from '../PaperApp/PaperApp'
import { TextApp, TextAppColor, TextAppWeight } from '../TextApp/TextApp'

type MetricCardAppProps = {
  icon: string
  label: string
  value: string
  valueColor?: TextAppColor | 'success.main'
}

export function MetricCardApp({ icon, label, value, valueColor }: MetricCardAppProps) {
  return (
    <PaperApp padding={2} sx={{ boxShadow: 'none' }} variant="outlined">
      <BoxApp alignItems={BoxAppAlignItems.Center} display={BoxAppDisplay.Flex} gap={1.5}>
        <BoxApp color="primary.main" display={BoxAppDisplay.Flex}>
          <IconApp icon={icon} width="1.75rem" />
        </BoxApp>
        <BoxApp>
          <TextApp color={TextAppColor.Secondary}>{label}</TextApp>
          <TextApp color={valueColor} fontSize="1.25rem" weight={TextAppWeight.Bold}>{value}</TextApp>
        </BoxApp>
      </BoxApp>
    </PaperApp>
  )
}
