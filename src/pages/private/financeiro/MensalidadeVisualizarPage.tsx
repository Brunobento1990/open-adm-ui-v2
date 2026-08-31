import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiMensalidade } from '../../../api/useApiMensalidade'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppComponent,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppJustifyContent,
} from '../../../components/BoxApp/boxAppTypes'
import { ButtonCopyApp } from '../../../components/ButtonCopyApp/ButtonCopyApp'
import { ProgressApp } from '../../../components/ProgressApp/ProgressApp'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import { FormAction } from '../../../types/Form'
import type { Mensalidade } from '../../../types/MensalidadeTypes'

const QrCode = { DataUrlPrefix: 'data:image/jpeg;base64,' } as const

export function MensalidadeVisualizarPage() {
  const { id } = useParams<{ id: string }>()
  const { obter } = useApiMensalidade()
  const [mensalidade, setMensalidade] = useState<Mensalidade>()

  useEffect(() => {
    if (!id) return

    async function carregar() {
      const response = await obter.fetch(id as string)
      if (response) setMensalidade(response)
    }

    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <FormRoot.Form
      action={FormAction.View}
      loading={obter.loading}
      submit={async () => undefined}
      urlVoltar={PrivateRoutePath.Mensalidade}
    >
      {obter.loading && <ProgressApp />}
      {mensalidade?.pago && (
        <TextApp fontSize="1.375rem" weight={TextAppWeight.SemiBold}>
          A mensalidade se encontra paga
        </TextApp>
      )}
      {!mensalidade?.pago && mensalidade?.pix && (
        <BoxApp
          alignItems={BoxAppAlignItems.Center}
          display={BoxAppDisplay.Flex}
          flexDirection={BoxAppFlexDirection.Column}
          gap="1rem"
          justifyContent={BoxAppJustifyContent.Center}
        >
          <BoxApp
            alt="QR Code Pix da mensalidade"
            component={BoxAppComponent.Img}
            maxWidth="200px"
            src={`${QrCode.DataUrlPrefix}${mensalidade.pix.qrCode ?? ''}`}
            width="100%"
          />
          <ButtonCopyApp label="Pix copia e cola" value={mensalidade.pix.copiaECola ?? ''} />
        </BoxApp>
      )}
    </FormRoot.Form>
  )
}
