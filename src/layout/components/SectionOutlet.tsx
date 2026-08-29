import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { BoxApp } from '../../components/BoxApp/BoxApp'
import { BoxAppComponent, BoxAppDisplay, BoxAppOverflow } from '../../components/BoxApp/boxAppTypes'

type SectionOutletProps = {
  children?: ReactNode
}

export function SectionOutlet({ children }: SectionOutletProps) {
  return (
    <BoxApp
      component={BoxAppComponent.Section}
      display={BoxAppDisplay.Flex}
      flex={1}
      minHeight={0}
      p="1rem"
      boxSizing="border-box"
      overflow={BoxAppOverflow.Hidden}
    >
      {children ?? <Outlet />}
    </BoxApp>
  )
}
