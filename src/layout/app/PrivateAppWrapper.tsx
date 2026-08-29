import { useState, type ReactNode } from 'react'
import {
  BoxApp
} from '../../components/BoxApp/BoxApp'
import { BoxAppAlignItems, BoxAppComponent, BoxAppDisplay, BoxAppFlexDirection, BoxAppOverflow } from '../../components/BoxApp/boxAppTypes'
import { AtendimentoChatProvider } from '../../context/AtendimentoChatProvider'
import { FloatingChatWindow } from '../../pages/private/atendimento/FloatingChatWindow'
import { Header } from '../components/Header'
import { SectionOutlet } from '../components/SectionOutlet'
import { Sidebar } from '../components/Sidebar'

type PrivateAppWrapperProps = {
  title: string
  children?: ReactNode
}

export function PrivateAppWrapper({ title, children }: PrivateAppWrapperProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <AtendimentoChatProvider>
      <BoxApp
        component={BoxAppComponent.Div}
        display={BoxAppDisplay.Flex}
        height="100vh"
        minHeight="100vh"
        overflow={BoxAppOverflow.Hidden}
      >
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <BoxApp
          component={BoxAppComponent.Div}
          display={BoxAppDisplay.Flex}
          flex={1}
          flexDirection={BoxAppFlexDirection.Column}
          alignItems={BoxAppAlignItems.Stretch}
          minWidth={0}
        >
          <Header
            title={title}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
          <SectionOutlet>{children}</SectionOutlet>
        </BoxApp>
        <FloatingChatWindow />
      </BoxApp>
    </AtendimentoChatProvider>
  )
}
