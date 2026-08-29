import { Icon } from '@iconify/react'
import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useApiComanda } from '../../../api/useApiComanda'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { ModalChildren } from '../../../components/Modal/ModalChildren'
import { useSnackbarApp } from '../../../components/Snackbar/useSnackbar'
import { useThemeApp } from '../../../hook/useThemeApp'
import { getComandaPublicaPath } from '../../../routes/appRoutes'

const CompartilhamentoIcon = {
  Ativo: 'solar:link-circle-bold',
  Copiar: 'solar:copy-bold',
  Inativo: 'solar:link-broken-linear',
  WhatsApp: 'logos:whatsapp-icon',
} as const

const whatsappCompartilhamentoUrl = 'https://wa.me/?text='

enum CompartilhamentoDialog {
  Ativar = 'ativar',
  Link = 'link',
  Desativar = 'desativar',
}

type ComandaCompartilhamentoActionProps = {
  comandaId: string
  idPublico?: string | null
  onChanged: () => Promise<void> | void
  somenteIcone?: boolean
}

export function ComandaCompartilhamentoAction({
  comandaId,
  idPublico,
  onChanged,
  somenteIcone = false,
}: ComandaCompartilhamentoActionProps) {
  const { alternarCompartilhamento } = useApiComanda()
  const { cores } = useThemeApp()
  const snack = useSnackbarApp()
  const [dialog, setDialog] = useState<CompartilhamentoDialog>()
  const [idPublicoCriado, setIdPublicoCriado] = useState<string>()
  const ativo = idPublico != null
  const idLink = idPublico ?? idPublicoCriado
  const linkPublico = idLink
    ? `${window.location.origin}${getComandaPublicaPath(idLink)}`
    : undefined
  const loading = alternarCompartilhamento.loading
  const tituloAcao = ativo ? 'Copiar link público' : 'Criar link público'

  async function ativar() {
    const response = await alternarCompartilhamento.fetch(comandaId, true)
    if (response === undefined) return

    if (response) {
      setIdPublicoCriado(response)
      setDialog(CompartilhamentoDialog.Link)
    }
    await onChanged()
  }

  async function desativar() {
    const response = await alternarCompartilhamento.fetch(comandaId, false)
    if (response === undefined) return

    setDialog(undefined)
    setIdPublicoCriado(undefined)
    await onChanged()
  }

  async function copiarLink() {
    if (!linkPublico) return

    try {
      await navigator.clipboard.writeText(linkPublico)
      snack.show('Link público copiado com sucesso', 'success')
    } catch {
      snack.show('Não foi possível copiar o link público', 'error')
    }
  }

  function compartilharNoWhatsApp() {
    if (!linkPublico) return

    const url = `${whatsappCompartilhamentoUrl}${encodeURIComponent(linkPublico)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const actionIcon = (
    <Icon
      color={ativo ? cores.success : undefined}
      fontSize={19}
      icon={ativo ? CompartilhamentoIcon.Ativo : CompartilhamentoIcon.Inativo}
    />
  )

  return (
    <>
      {somenteIcone ? (
        <Tooltip title={tituloAcao}>
          <IconButton
            aria-label={tituloAcao}
            disabled={loading}
            onClick={(event) => {
              event.stopPropagation()
              setDialog(ativo ? CompartilhamentoDialog.Link : CompartilhamentoDialog.Ativar)
            }}
          >
            {actionIcon}
          </IconButton>
        </Tooltip>
      ) : (
        <ButtonApp
          disabled={loading}
          onClick={() => setDialog(ativo ? CompartilhamentoDialog.Link : CompartilhamentoDialog.Ativar)}
          startIcon={actionIcon}
          variant={ButtonAppVariant.Outlined}
        >
          {tituloAcao}
        </ButtonApp>
      )}

      <ModalChildren
        close={() => setDialog(undefined)}
        footerChildren={(
          <Stack direction="row" spacing={1}>
            <ButtonApp
              disabled={loading}
              onClick={() => setDialog(undefined)}
              variant={ButtonAppVariant.Outlined}
            >
              {dialog === CompartilhamentoDialog.Link ? 'Fechar' : 'Cancelar'}
            </ButtonApp>
            {dialog === CompartilhamentoDialog.Ativar && (
              <ButtonApp loading={loading} onClick={ativar}>Ativar compartilhamento</ButtonApp>
            )}
            {dialog === CompartilhamentoDialog.Link && (
              <>
                <ButtonApp
                  disabled={loading}
                  onClick={() => setDialog(CompartilhamentoDialog.Desativar)}
                  variant={ButtonAppVariant.Outlined}
                >
                  Desativar
                </ButtonApp>
              </>
            )}
            {dialog === CompartilhamentoDialog.Desativar && (
              <ButtonApp loading={loading} onClick={desativar}>Desativar compartilhamento</ButtonApp>
            )}
          </Stack>
        )}
        fullWidth
        maxWidth="sm"
        open={dialog !== undefined}
        titulo={dialog === CompartilhamentoDialog.Ativar
          ? 'Ativar compartilhamento público'
          : dialog === CompartilhamentoDialog.Link
            ? 'Link público da comanda'
            : 'Desativar compartilhamento público'}
      >
        {dialog === CompartilhamentoDialog.Ativar && (
          <Stack spacing={1.5}>
            <Typography>
              Será criado um link público para acompanhamento desta comanda.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Qualquer pessoa que possuir o link poderá visualizar a comanda.
            </Typography>
          </Stack>
        )}
        {dialog === CompartilhamentoDialog.Link && linkPublico && (
          <Stack spacing={1.5}>
            <Typography color="text.secondary" variant="body2">
              Compartilhe este link com quem precisa acompanhar a comanda.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ alignItems: { sm: 'center' } }}
            >
              <Typography
                sx={{
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  flex: 1,
                  overflowWrap: 'anywhere',
                  p: 1.5,
                }}
                variant="body2"
              >
                {linkPublico}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <IconButtonComTolltip
                  aria-label="Copiar link"
                  onClick={copiarLink}
                  tooltip="Copiar link"
                >
                  <Icon icon={CompartilhamentoIcon.Copiar} />
                </IconButtonComTolltip>
                <IconButtonComTolltip
                  aria-label="Compartilhar no WhatsApp"
                  onClick={compartilharNoWhatsApp}
                  tooltip="Compartilhar no WhatsApp"
                >
                  <Icon icon={CompartilhamentoIcon.WhatsApp} />
                </IconButtonComTolltip>
              </Stack>
            </Stack>
          </Stack>
        )}
        {dialog === CompartilhamentoDialog.Desativar && (
          <Typography>
            Deseja realmente desativar o compartilhamento público desta comanda? O identificador público atual deixará de ser válido.
          </Typography>
        )}
      </ModalChildren>
    </>
  )
}
