import { Icon } from '@iconify/react'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useApiComanda } from '../../../api/useApiComanda'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { ComandaHistorico } from '../../../types/ComandaTypes'
import { formatarDataUtcLocal, formatarHoraUtcLocal } from '../../../utils/dateUtils'

const HistoricoTermo = {
  Adicao: ['adicion', 'inclu', 'criad'],
  Alteracao: ['alter', 'status'],
  Cliente: 'cliente',
  Produto: 'produto',
  Remocao: ['removid', 'remov', 'exclu'],
  Status: 'status',
} as const

const HistoricoIcone = {
  Cliente: 'solar:user-rounded-linear',
  Neutro: 'solar:document-text-linear',
  Produto: 'solar:box-linear',
  Status: 'solar:refresh-circle-linear',
} as const

function mensagemPossuiTermo(mensagem: string, termos: readonly string[]) {
  return termos.some((termo) => mensagem.includes(termo))
}

export function ComandaHistoricoTab({ comandaId }: { comandaId: string }) {
  const { obterHistoricos } = useApiComanda()
  const { cores } = useThemeApp()
  const [historicos, setHistoricos] = useState<ComandaHistorico[]>([])

  useEffect(() => {
    async function carregarHistoricos() {
      const response = await obterHistoricos.fetch(comandaId)
      if (response) setHistoricos(response)
    }

    carregarHistoricos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comandaId])

  const historicosPorData = historicos.reduce<Record<string, ComandaHistorico[]>>((grupos, historico) => {
    const data = formatarDataUtcLocal(historico.dataDeCadastro)
    grupos[data] = [...(grupos[data] ?? []), historico]
    return grupos
  }, {})

  function obterVisualHistorico(mensagem: string) {
    const mensagemNormalizada = mensagem.toLocaleLowerCase('pt-BR')
    const icon = mensagemNormalizada.includes(HistoricoTermo.Produto)
      ? HistoricoIcone.Produto
      : mensagemNormalizada.includes(HistoricoTermo.Cliente)
        ? HistoricoIcone.Cliente
        : mensagemNormalizada.includes(HistoricoTermo.Status)
          ? HistoricoIcone.Status
          : HistoricoIcone.Neutro
    const color = mensagemPossuiTermo(mensagemNormalizada, HistoricoTermo.Remocao)
      ? cores.error
      : mensagemPossuiTermo(mensagemNormalizada, HistoricoTermo.Adicao)
        ? cores.success
        : mensagemPossuiTermo(mensagemNormalizada, HistoricoTermo.Alteracao)
          ? cores.info
          : cores.primary

    return { color, icon }
  }

  if (obterHistoricos.loading) {
    return <Stack spacing={1} sx={{ maxWidth: 900 }}>{[1, 2, 3, 4].map((item) => <Skeleton key={item} height={64} variant="rounded" />)}</Stack>
  }

  return (
    <Box sx={{ maxWidth: 900, width: '100%' }}>
      {Object.entries(historicosPorData).map(([data, eventos]) => (
        <Box key={data} sx={{ mb: { xs: 2, md: 2.5 } }}>
          <Typography color="text.secondary" variant="caption" sx={{ display: 'block', fontWeight: 600, letterSpacing: '0.04em', mb: 1 }}>{data}</Typography>
          <Stack spacing={0}>
            {eventos.map((historico, index) => {
              const visual = obterVisualHistorico(historico.mensagem)
              const ultimoEvento = index === eventos.length - 1

              return (
                <Box key={historico.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '24px minmax(0, 1fr)', md: '28px minmax(0, 1fr)' }, minWidth: 0 }}>
                  <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', minHeight: 58 }}>
                    <Box sx={{ alignItems: 'center', border: `1px solid ${visual.color}`, borderRadius: '50%', color: visual.color, display: 'flex', flex: '0 0 auto', height: 22, justifyContent: 'center', width: 22 }}>
                      <Icon icon={visual.icon} width={13} />
                    </Box>
                    {!ultimoEvento && <Box sx={{ bgcolor: 'divider', flex: 1, mt: 0.5, width: '1px' }} />}
                  </Box>
                  <Box sx={{ minWidth: 0, pb: ultimoEvento ? 0 : 1.25, pl: { xs: 0.75, md: 1 } }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4, overflowWrap: 'anywhere' }}>{historico.mensagem}</Typography>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mt: 0.25 }}>
                      {formatarHoraUtcLocal(historico.dataDeCadastro)} · {historico.usuario?.nome ?? historico.usuarioId}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Stack>
        </Box>
      ))}
      {historicos.length === 0 && <Typography color="text.secondary" variant="body2">Nenhuma alteração registrada nesta comanda.</Typography>}
    </Box>
  )
}
