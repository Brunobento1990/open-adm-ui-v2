import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { IconApp } from '../../../components/Icon/IconApp'
import { IconButtonComTolltip } from '../../../components/IconButtonComTolltip/IconButtonComTolltip'
import { StackApp } from '../../../components/StackApp/StackApp'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { useNavigationApp } from '../../../hook/useNavigationApp'
import { useThemeApp } from '../../../hook/useThemeApp'
import { PrivateRoutePath } from '../../../routes/appRoutes'
import {
  PedidoStatus,
  PedidoStatusColorMap,
  PedidoStatusLabel,
  type PedidoPaginacao,
} from '../../../types/PedidoTypes'
import { formatarDataHoraUtcLocal } from '../../../utils/dateUtils'
import { ExcluirPedidoButton } from './ExcluirPedidoButton'

type PedidoMobileRowProps = {
  pedido: PedidoPaginacao
  downloadLoading: boolean
  excluirLoading: boolean
  onDownload: () => void
  onExcluir: () => Promise<boolean>
}

export function PedidoMobileRow({
  pedido,
  downloadLoading,
  excluirLoading,
  onDownload,
  onExcluir,
}: PedidoMobileRowProps) {
  const { navigate } = useNavigationApp()
  const { cores, getPaletteColor } = useThemeApp()
  const permiteModificarStatus =
    pedido.statusPedido !== PedidoStatus.Entregue && pedido.statusPedido !== PedidoStatus.Cancelado
  const corEstoque =
    pedido.porcentagemEstoqueAtendido <= 20
      ? cores.error
      : pedido.porcentagemEstoqueAtendido <= 50
        ? cores.warning
        : cores.success

  return (
    <BoxApp py={1} width="100%">
      <StackApp spacing={1}>
        <StackApp direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <BoxApp flex={1} minWidth={0} sx={{ overflow: 'hidden' }}>
            <TextApp noWrap weight={TextAppWeight.Bold}>{pedido.usuario}</TextApp>
            <TextApp color={TextAppColor.Secondary}>Pedido #{pedido.numero}</TextApp>
          </BoxApp>
          <BadgeApp
            cor={getPaletteColor(PedidoStatusColorMap[pedido.statusPedido])}
            texto={PedidoStatusLabel[pedido.statusPedido]}
            width="100px"
          />
        </StackApp>

        <StackApp direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
          <TextApp color={TextAppColor.Secondary}>Cadastro</TextApp>
          <TextApp weight={TextAppWeight.Medium}>
            {formatarDataHoraUtcLocal(pedido.dataDeCriacao)}
          </TextApp>
        </StackApp>

        <StackApp direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <TextApp color={TextAppColor.Secondary}>Estoque</TextApp>
          {pedido.statusPedido === PedidoStatus.Entregue ? (
            <TextApp weight={TextAppWeight.Medium}>Fechado</TextApp>
          ) : (
            <BadgeApp cor={corEstoque} padding=".3rem .75rem" texto={`${pedido.porcentagemEstoqueAtendido}%`} width="72px" />
          )}
        </StackApp>

        <BoxApp borderTop="1px solid" borderColor="divider" pt={0.5}>
          <StackApp direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
            {permiteModificarStatus && (
              <IconButtonComTolltip
                aria-label="Modificar status do pedido"
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`${PrivateRoutePath.PedidoModificarStatus}/${pedido.id}`)
                }}
                tooltip="Modificar status do pedido"
              >
                <IconApp color={cores.primary} icon="fe:app-menu" />
              </IconButtonComTolltip>
            )}
            <IconButtonComTolltip
              aria-label="Acessar financeiro do pedido"
              onClick={(event) => {
                event.stopPropagation()
                navigate(`${PrivateRoutePath.ContaAReceber}?pedidoId=${encodeURIComponent(pedido.id)}`)
              }}
              tooltip="Acessar financeiro do pedido"
            >
              <IconApp color={cores.success} icon="solar:wallet-money-outline" />
            </IconButtonComTolltip>
            <IconButtonComTolltip
              aria-label="Visualizar pedido"
              onClick={(event) => {
                event.stopPropagation()
                navigate(`${PrivateRoutePath.PedidoVisualizar}/${pedido.id}`)
              }}
              tooltip="Visualizar pedido"
            >
              <IconApp color={cores.primary} icon="solar:eye-linear" />
            </IconButtonComTolltip>
            <IconButtonComTolltip
              aria-label="Download do pedido"
              disabled={downloadLoading}
              onClick={(event) => {
                event.stopPropagation()
                onDownload()
              }}
              tooltip="Download do pedido"
            >
              <IconApp color={cores.primary} icon="material-symbols-light:download" />
            </IconButtonComTolltip>
            <ExcluirPedidoButton
              loading={excluirLoading}
              numero={pedido.numero}
              onConfirmar={onExcluir}
            />
          </StackApp>
        </BoxApp>
      </StackApp>
    </BoxApp>
  )
}
