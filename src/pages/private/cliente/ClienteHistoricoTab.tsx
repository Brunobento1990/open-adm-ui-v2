import { useEffect, useState } from 'react'
import { useApiCliente } from '../../../api/useApiCliente'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { SkeletonApp } from '../../../components/SkeletonApp/SkeletonApp'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TextApp } from '../../../components/TextApp/TextApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import type { HistoricoCliente } from '../../../types/ClienteTypes'

const historicoItems = [
  { field: 'ultimaCompra', icon: 'solar:calendar-date-linear', label: 'Última compra' },
  { field: 'ticketMedio', icon: 'solar:wallet-money-linear', label: 'Ticket médio' },
  { field: 'produtoMaisComprado', icon: 'solar:bag-4-linear', label: 'Produto mais comprado' },
  { field: 'ultimoPedido', icon: 'solar:clipboard-list-linear', label: 'Último pedido' },
] as const satisfies ReadonlyArray<{
  field: keyof HistoricoCliente
  icon: string
  label: string
}>

export function ClienteHistoricoTab({ clienteId }: { clienteId: string }) {
  const { historico: historicoApi } = useApiCliente()
  const { colorWithOpacity, cores } = useThemeApp()
  const [historico, setHistorico] = useState<HistoricoCliente>()

  useEffect(() => {
    void historicoApi.fetch(clienteId).then((response) => {
      if (response) setHistorico(response)
    })
    // O componente só é montado ao selecionar a aba Histórico.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId])

  return (
    <BoxApp
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {historicoItems.map((item) => (
        <PaperApp key={item.field} variant="outlined" sx={{ minWidth: 0 }}>
          <StackApp direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <BoxApp
              sx={{
                bgcolor: colorWithOpacity(cores.primary, 0.12),
                borderRadius: 1.5,
                color: 'primary.main',
                display: 'grid',
                flexShrink: 0,
                height: 42,
                placeItems: 'center',
                width: 42,
              }}
            >
              <IconApp icon={item.icon} width="1.35rem" />
            </BoxApp>
            <BoxApp sx={{ minWidth: 0 }}>
              <TextApp color="text.secondary" variant="body2">
                {item.label}
              </TextApp>
              {historicoApi.loading && !historico ? (
                <SkeletonApp height={28} width={150} />
              ) : (
                <TextApp sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
                  {historico?.[item.field] || 'Não informado'}
                </TextApp>
              )}
            </BoxApp>
          </StackApp>
        </PaperApp>
      ))}
    </BoxApp>
  )
}
