import {
  BoxApp
} from '../../components/BoxApp/BoxApp'
import { BoxAppDisplay, BoxAppFlexDirection } from '../../components/BoxApp/boxAppTypes'
import {
  TextApp,
  TextAppColor,
  TextAppVariant,
  TextAppWeight,
} from '../../components/TextApp/TextApp'

type SectionPageProps = {
  title: string
  description: string
}

export function SectionPage({ title, description }: SectionPageProps) {
  return (
    <BoxApp
      display={BoxAppDisplay.Flex}
      flexDirection={BoxAppFlexDirection.Column}
      gap={1}
    >
      <TextApp
        component="h1"
        variant={TextAppVariant.Title}
        weight={TextAppWeight.Bold}
      >
        {title}
      </TextApp>
      <TextApp color={TextAppColor.Secondary}>{description}</TextApp>
    </BoxApp>
  )
}
