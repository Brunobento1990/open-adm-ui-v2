import { Icon } from '@iconify/react'
import { Alert, Box, Chip, Paper, Skeleton, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useApiUsuarioLogoutSessao, useApiUsuarioSessoes } from '../../../api/useApiUsuario'
import { ButtonApp, ButtonAppColor, ButtonAppSize, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { TextApp, TextAppColor, TextAppVariant, TextAppWeight } from '../../../components/TextApp/TextApp'
import type { UsuarioSessao } from '../../../types/UsuarioTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'

const SessionIcon = {
  Device: 'solar:devices-bold-duotone',
} as const

type SessionDetailProps = {
  label: string
  value?: string | null
}

function SessionDetail({ label, value }: SessionDetailProps) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 0 }}>
      <TextApp color={TextAppColor.Secondary} fontSize="0.75rem">{label}</TextApp>
      <Box sx={{ overflowWrap: 'anywhere' }}>
        <TextApp>{value || 'Não informado'}</TextApp>
      </Box>
    </Stack>
  )
}

export function MinhasSessoesTab() {
  const api = useApiUsuarioSessoes()
  const apiLogoutSessao = useApiUsuarioLogoutSessao()
  const [sessoes, setSessoes] = useState<UsuarioSessao[]>()
  const [sessaoSendoEncerrada, setSessaoSendoEncerrada] = useState<string>()

  async function encerrarSessao(sessaoId: string) {
    setSessaoSendoEncerrada(sessaoId)
    const response = await apiLogoutSessao.action(sessaoId)

    if (response?.resultado) {
      setSessoes((sessoesAtuais) =>
        sessoesAtuais?.filter((sessao) => sessao.sessaoId !== sessaoId),
      )
    }

    setSessaoSendoEncerrada(undefined)
  }

  useEffect(() => {
    async function carregarSessoes() {
      const response = await api.action()
      if (response) setSessoes(response)
    }

    carregarSessoes()
    // A consulta deve ocorrer somente quando esta aba for montada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (api.loading && !sessoes) {
    return (
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        {[0, 1].map((item) => <Skeleton key={item} variant="rounded" height={190} />)}
      </Stack>
    )
  }

  if (!sessoes) {
    return <Alert severity="error">Não foi possível carregar suas sessões.</Alert>
  }

  if (sessoes.length === 0) {
    return <Alert severity="info">Nenhuma sessão foi encontrada.</Alert>
  }

  const sessoesOrdenadas = [...sessoes].sort(
    (primeira, segunda) => Number(segunda.sessaoAtual) - Number(primeira.sessaoAtual),
  )

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      {sessoesOrdenadas.map((sessao) => (
        <Paper
          key={sessao.id}
          variant="outlined"
          sx={{
            borderColor: sessao.sessaoAtual ? 'primary.main' : 'divider',
            p: { xs: 2, sm: 2.5 },
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ color: 'primary.main', display: 'flex', flexShrink: 0 }}>
              <Icon icon={SessionIcon.Device} fontSize={28} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
              <TextApp variant={TextAppVariant.Subtitle} weight={TextAppWeight.Bold}>
                {sessao.dispositivo || sessao.sistemaOperacional || 'Dispositivo desconhecido'}
              </TextApp>
              <TextApp color={TextAppColor.Secondary}>
                {[sessao.navegador, sessao.sistemaOperacional].filter(Boolean).join(' • ') || 'Detalhes não informados'}
              </TextApp>
            </Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
              {sessao.sessaoAtual ? (
                <Chip color="primary" label="Sessão atual" size="small" />
              ) : (
                <ButtonApp
                  color={ButtonAppColor.Error}
                  disabled={apiLogoutSessao.loading}
                  loading={sessaoSendoEncerrada === sessao.sessaoId}
                  onClick={() => encerrarSessao(sessao.sessaoId)}
                  size={ButtonAppSize.Small}
                  variant={ButtonAppVariant.Outlined}
                >
                  Encerrar sessão
                </ButtonApp>
              )}
            </Stack>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              columnGap: 3,
              rowGap: 2,
              gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))' },
            }}
          >
            <SessionDetail label="Endereço IP" value={sessao.enderecoIp} />
            <SessionDetail label="Iniciada em" value={formatarDataHoraUtcLocal(sessao.dataDeCadastro)} />
            <SessionDetail label="Expira em" value={formatarDataHoraUtcLocal(sessao.expiraEm)} />
            <SessionDetail label="Última atividade" value={formatarDataHoraUtcLocal(sessao.ultimaAtividadeEm ?? undefined)} />
          </Box>
        </Paper>
      ))}
    </Stack>
  )
}
