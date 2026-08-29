import { Box, Stack } from '@mui/material'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import {
  TextApp,
  TextAppColor,
  TextAppSize,
  TextAppWeight,
} from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'

type ModalConexaoWhatsAppProps = {
  open: boolean
  base64?: string
  pairingCode?: string
  onClose: () => void
}

function getQrCodeSrc(base64?: string) {
  if (!base64) return ''
  return base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`
}

export function ModalConexaoWhatsApp({
  open,
  base64,
  pairingCode,
  onClose,
}: ModalConexaoWhatsAppProps) {
  const { backgroundColor, borderRadius, cores } = useThemeApp()
  const qrCodeSrc = getQrCodeSrc(base64)

  return (
    <ModalChildren
      close={onClose}
      fullWidth
      maxWidth="xs"
      open={open}
      titulo="Conectar WhatsApp"
      retirarFooter
    >
      <Stack spacing={2} sx={{ alignItems: 'center', pb: 1 }}>
        <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small}>
          Leia o QR Code para iniciar o atendimento.
        </TextApp>

        {qrCodeSrc && (
          <Box
            component="img"
            src={qrCodeSrc}
            alt="QR Code de conexao do WhatsApp"
            sx={{
              width: '100%',
              maxWidth: 260,
              aspectRatio: '1 / 1',
              objectFit: 'contain',
              p: 1.5,
              borderRadius,
              backgroundColor: backgroundColor.default,
              border: `1px solid ${cores.dividerSoft}`,
            }}
          />
        )}

        {pairingCode && (
          <Box
            sx={{
              width: '100%',
              p: 1.25,
              borderRadius,
              backgroundColor: backgroundColor.default,
              border: `1px solid ${cores.dividerSoft}`,
              textAlign: 'center',
            }}
          >
            <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small}>
              Codigo de pareamento
            </TextApp>
            <TextApp weight={TextAppWeight.Bold}>
              {pairingCode}
            </TextApp>
          </Box>
        )}

        <ButtonApp fullWidth variant={ButtonAppVariant.Outlined} onClick={onClose}>
          Fechar
        </ButtonApp>
      </Stack>
    </ModalChildren>
  )
}
