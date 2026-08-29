import { Icon } from '@iconify/react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ComandaPublicaRequestStatus, useApiComandaPublica } from '../../api/useApiComandaPublica'
import { BadgeApp } from '../../components/BadegApp/BadgeApp'
import { ComandaItensList } from '../../components/Comanda/ComandaItensList'
import { useComandaStatus } from '../../hook/useComandaStatus'
import {
  ComandaStatus,
  type ComandaPublica,
  type ComandaPublicaCliente,
} from '../../types/ComandaTypes'
import { formatarDataHoraUtcLocal } from '../../utils/dateUtils'
import { formatMoney } from '../../utils/moneyUtils'

function PublicPageShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>{children}</Container>
    </Box>
  )
}

function LoadingPage() {
  return (
    <PublicPageShell>
      <Paper elevation={0} sx={{ overflow: 'hidden', p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2}><Skeleton height={64} variant="rounded" width={64} /><Box sx={{ flex: 1 }}><Skeleton width="60%" /><Skeleton width="42%" /></Box></Stack>
          <Divider />
          <Box><Skeleton width="35%" /><Skeleton height={48} width="72%" /><Skeleton height={72} variant="rounded" /></Box>
          <Divider />
          <Stack spacing={1.5}>{[1, 2, 3].map((item) => <Skeleton height={72} key={item} variant="rounded" />)}</Stack>
        </Stack>
      </Paper>
    </PublicPageShell>
  )
}

function StatePage({ error, onRetry }: { error?: boolean; onRetry?: () => void }) {
  return (
    <PublicPageShell>
      <Paper elevation={0} sx={{ mt: { xs: 5, sm: 10 }, p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
        <Icon fontSize={48} icon={error ? 'solar:cloud-cross-linear' : 'solar:document-text-linear'} />
        <Typography sx={{ fontWeight: 700, mt: 2 }} variant="h5">{error ? 'Não foi possível carregar a comanda' : 'Comanda não encontrada'}</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mt: 1 }}>
          {error ? 'Ocorreu um problema de conexão. Tente novamente em instantes.' : 'Este link pode ser inválido ou o compartilhamento pode ter sido desativado.'}
        </Typography>
        {error && <Button onClick={onRetry} sx={{ mt: 3, minHeight: 44, textTransform: 'none' }} variant="contained">Tentar novamente</Button>}
      </Paper>
    </PublicPageShell>
  )
}

function CompanyHeader({ empresa }: Pick<ComandaPublica, 'empresa'>) {
  const telefone = empresa.telefone?.replace(/\D/g, '')
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center', textAlign: { xs: 'center', sm: 'left' } }}>
      {empresa.logo ? (
        <Box
          alt={`Logo da ${empresa.nomeFantasia || empresa.razaoSocial}`}
          component="img"
          src={empresa.logo}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 1,
            height: { xs: 72, sm: 80 },
            objectFit: 'contain',
            width: { xs: 72, sm: 80 },
          }}
        />
      ) : (
        <Avatar variant="rounded" sx={{ height: { xs: 72, sm: 80 }, width: { xs: 72, sm: 80 } }}>
          {(empresa.nomeFantasia || empresa.razaoSocial).charAt(0)}
        </Avatar>
      )}
      <Box sx={{ flex: 1 }}>
        <Typography component="h1" sx={{ fontWeight: 800 }} variant="h5">{empresa.nomeFantasia || empresa.razaoSocial}</Typography>
        {empresa.razaoSocial && empresa.razaoSocial !== empresa.nomeFantasia && <Typography color="text.secondary" variant="body2">{empresa.razaoSocial}</Typography>}
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' }, mt: 0.75 }}>
          {empresa.telefone && <Typography color="text.secondary" component={telefone ? 'a' : 'span'} href={telefone ? `tel:${telefone}` : undefined} sx={{ alignItems: 'center', color: 'text.secondary', display: 'inline-flex', gap: 0.5, textDecoration: 'none' }} variant="body2"><Icon icon="solar:phone-linear" />{empresa.telefone}</Typography>}
        </Stack>
      </Box>
    </Stack>
  )
}

function DivisionSection({ divisions }: { divisions: ComandaPublicaCliente[] }) {
  return (
    <Box component="section">
      <Typography sx={{ fontWeight: 800, mb: 1 }} variant="overline">Divisão da comanda</Typography>
      <Stack spacing={1}>
        {divisions.map((division, index) => (
          <Paper key={`${division.nome}-${index}`} variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 600 }}>{division.nome}</Typography>
              <Typography sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{formatMoney(division.total)}</Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}

function ContentPage({ comanda }: { comanda: ComandaPublica }) {
  const getStatus = useComandaStatus()
  const status = getStatus(comanda.comanda.status)
  const statusDate = comanda.comanda.status === ComandaStatus.Fechada ? comanda.comanda.dataDeFechamento : comanda.comanda.status === ComandaStatus.Cancelada ? comanda.comanda.dataDeCancelamento : undefined
  const itens = comanda.consumoGeral?.itens ?? comanda.comanda.itens ?? []

  return (
    <PublicPageShell>
      <Paper elevation={0} sx={{ overflow: 'hidden' }}>
        <Stack divider={<Divider />}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}><CompanyHeader empresa={comanda.empresa} /></Box>
          <Stack spacing={2} sx={{ p: { xs: 2, sm: 3 } }}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box><Typography color="text.secondary" variant="overline">Comanda #{comanda.comanda.numero}</Typography><Typography component="h2" sx={{ fontWeight: 800 }} variant="h5">{comanda.comanda.identificacao}</Typography></Box>
                <BadgeApp cor={status.color} padding="4px 10px" texto={status.label} />
              </Stack>
              <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">Aberta em {formatarDataHoraUtcLocal(comanda.comanda.dataDeCadastro)}</Typography>
              {comanda.divisaoClientes.length > 0 && <Typography color="text.secondary" variant="body2">Clientes: {comanda.divisaoClientes.map((cliente) => cliente.nome).join(', ')}</Typography>}
              {comanda.comanda.observacao && <Typography sx={{ mt: 1.5, whiteSpace: 'pre-line' }} variant="body2">{comanda.comanda.observacao}</Typography>}
            </Box>
            <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack divider={<Divider flexItem />} spacing={1.25}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="body2">Valor total</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant="body1">{formatMoney(comanda.comanda.valorTotal)}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="body2">Desconto</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant="body1">- {formatMoney(comanda.comanda.desconto ?? 0)}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700 }} variant="body2">Valor líquido</Typography>
                  <Typography sx={{ fontWeight: 800 }} variant="h6">{formatMoney(comanda.comanda.valorLiquido)}</Typography>
                </Stack>
              </Stack>
            </Paper>
            {statusDate && <Alert icon={<Icon icon={status.icon} />} severity={comanda.comanda.status === ComandaStatus.Cancelada ? 'error' : 'info'}>{comanda.comanda.status === ComandaStatus.Cancelada ? 'Esta comanda foi cancelada' : 'Esta comanda foi encerrada'} em {formatarDataHoraUtcLocal(statusDate)}.</Alert>}
          </Stack>
          <Box component="section" sx={{ p: { xs: 2, sm: 3 } }}><Typography sx={{ fontWeight: 800, mb: 1.5 }} variant="overline">Consumo</Typography><ComandaItensList emptyMessage="Nenhum consumo registrado." itens={itens} /></Box>
          {comanda.divisaoClientes.length > 0 && <Box sx={{ p: { xs: 2, sm: 3 } }}><DivisionSection divisions={comanda.divisaoClientes} /></Box>}
        </Stack>
      </Paper>
      {comanda.comanda.dataDeAtualizacao && <Typography color="text.secondary" sx={{ mt: 1.5, textAlign: 'center' }} variant="caption">Última atualização: {formatarDataHoraUtcLocal(comanda.comanda.dataDeAtualizacao)}</Typography>}
    </PublicPageShell>
  )
}

export function ComandaPublicaPage() {
  const { idPublico } = useParams<{ idPublico: string }>()
  const { obter } = useApiComandaPublica()
  const [comanda, setComanda] = useState<ComandaPublica>()
  const [status, setStatus] = useState(ComandaPublicaRequestStatus.Loading)

  async function carregar() {
    setStatus(ComandaPublicaRequestStatus.Loading)
    const response = await obter.fetch(idPublico, setStatus)
    if (!response) return

    setComanda(response)
    setStatus(ComandaPublicaRequestStatus.Success)
  }

  useEffect(() => {
    // A resposta remota inicializa a página pública conforme o identificador da URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPublico])

  if (status === ComandaPublicaRequestStatus.Loading) return <LoadingPage />
  if (status === ComandaPublicaRequestStatus.NotFound) return <StatePage />
  if (status === ComandaPublicaRequestStatus.Error || !comanda) return <StatePage error onRetry={carregar} />
  return <ContentPage comanda={comanda} />
}
