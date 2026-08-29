import { Avatar, Alert, Box, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useApiMinhaConta, type MinhaContaResponse } from '../../../api/useApiUsuario'
import { TextApp, TextAppColor, TextAppVariant, TextAppWeight } from '../../../components/TextApp/TextApp'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'

function getInitials(name?: string) {
  if (!name) return 'ME'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

type AccountFieldProps = {
  label: string
  value?: string | null
}

function AccountField({ label, value }: AccountFieldProps) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 0 }}>
      <TextApp color={TextAppColor.Secondary} fontSize="0.75rem" weight={TextAppWeight.Medium}>
        {label}
      </TextApp>
      <Box sx={{ overflowWrap: 'anywhere' }}>
        <TextApp weight={TextAppWeight.Medium}>{value || 'Não informado'}</TextApp>
      </Box>
    </Stack>
  )
}

export function MinhaContaTab() {
  const api = useApiMinhaConta()
  const [usuario, setUsuario] = useState<MinhaContaResponse>()

  useEffect(() => {
    async function carregarMinhaConta() {
      const response = await api.action<MinhaContaResponse>()
      if (response) setUsuario(response)
    }

    carregarMinhaConta()
    // A consulta deve ocorrer somente quando esta aba for montada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (api.loading && !usuario) {
    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={64} height={64} />
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Skeleton width="40%" height={28} />
              <Skeleton width="55%" />
            </Stack>
          </Stack>
          <Skeleton height={120} />
        </Paper>
      </Stack>
    )
  }

  if (!usuario) {
    return <Alert severity="error">Não foi possível carregar os dados da sua conta.</Alert>
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ height: 64, width: 64, fontSize: '1.25rem', fontWeight: 700 }}>
            {getInitials(usuario.nome)}
          </Avatar>
          <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            <TextApp variant={TextAppVariant.Subtitle} weight={TextAppWeight.Bold}>
              {usuario.nome || 'Usuário'}
            </TextApp>
            <TextApp color={TextAppColor.Secondary}>{usuario.email || 'E-mail não informado'}</TextApp>
          </Box>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography sx={{ fontWeight: 600, mb: 2.5 }} variant="subtitle1">
          Informações pessoais
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))' },
          }}
        >
          <AccountField label="Nome" value={usuario.nome} />
          <AccountField label="E-mail" value={usuario.email} />
          <AccountField label="Telefone" value={usuario.telefone} />
          <AccountField label="CPF" value={usuario.cpf} />
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography sx={{ fontWeight: 600, mb: 2.5 }} variant="subtitle1">
          Informações da conta
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))' },
          }}
        >
          <AccountField label="Conta criada em" value={formatarDataHoraUtcLocal(usuario.dataDeCadastro)} />
          <AccountField label="Última atualização" value={formatarDataHoraUtcLocal(usuario.dataDeAtualizacao)} />
        </Box>
      </Paper>
    </Stack>
  )
}
