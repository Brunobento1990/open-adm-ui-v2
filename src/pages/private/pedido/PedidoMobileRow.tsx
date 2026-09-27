import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { MenuApp, type MenuAppItem } from '../../../components/MenuApp/MenuApp'
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

type PedidoMobileRowProps = {
  pedido: PedidoPaginacao
  downloadLoading: boolean
  onDownload: () => void
}

export function PedidoMobileRow({ pedido, downloadLoading, onDownload }: PedidoMobileRowProps) {
  const { navigate } = useNavigationApp()
  const { cores, getPaletteColor } = useThemeApp()
  const corEstoque =
    pedido.porcentagemEstoqueAtendido <= 20
      ? cores.error
      : pedido.porcentagemEstoqueAtendido <= 50
        ? cores.warning
        : cores.success

  function criarMenuItems(): MenuAppItem[] {
    return [
      {
        icon: 'solar:eye-linear',
        iconColor: cores.primary,
        label: 'Visualizar pedido',
        onClick: () => navigate(`${PrivateRoutePath.PedidoVisualizar}/${pedido.id}`),
      },
      {
        disabled: downloadLoading,
        icon: 'material-symbols-light:download',
        iconColor: cores.primary,
        label: 'Download do pedido',
        onClick: onDownload,
      },
    ]
  }

  return (
    <BoxApp width="100%">
      <StackApp direction="row" sx={{ alignItems: 'stretch' }}>
        <StackApp spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <StackApp
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <BoxApp flex={1} minWidth={0} sx={{ overflow: 'hidden' }}>
              <TextApp fontSize="0.8rem" noWrap weight={TextAppWeight.Bold}>
                {pedido.usuario}
              </TextApp>
              <TextApp color={TextAppColor.Secondary} fontSize="0.75rem">
                Pedido #{pedido.numero}
              </TextApp>
            </BoxApp>
            <BadgeApp
              cor={getPaletteColor(PedidoStatusColorMap[pedido.statusPedido])}
              fontSize="0.7rem"
              padding=".1rem .3rem"
              texto={PedidoStatusLabel[pedido.statusPedido]}
              width="82px"
            />
          </StackApp>

          {/* <StackApp direction="row" spacing={0.5} sx={{ justifyContent: 'space-between' }}>
            <TextApp color={TextAppColor.Secondary} fontSize="0.75rem">Cadastro</TextApp>
            <TextApp fontSize="0.75rem" weight={TextAppWeight.Medium}>
              {formatarDataHoraUtcLocal(pedido.dataDeCriacao)}
            </TextApp>
          </StackApp> */}

          <StackApp
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <TextApp color={TextAppColor.Secondary} fontSize="0.75rem">
              Estoque
            </TextApp>
            {pedido.statusPedido === PedidoStatus.Entregue ? (
              <TextApp fontSize="0.75rem" weight={TextAppWeight.Medium}>
                Fechado
              </TextApp>
            ) : (
              <BadgeApp
                cor={corEstoque}
                fontSize="0.7rem"
                padding=".1rem .4rem"
                texto={`${pedido.porcentagemEstoqueAtendido}%`}
                width="58px"
              />
            )}
          </StackApp>

          {pedido.representante?.nome && (
            <StackApp
              direction="row"
              spacing={0.5}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <TextApp color={TextAppColor.Secondary} fontSize="0.75rem">
                Representante
              </TextApp>
              <TextApp fontSize="0.75rem" noWrap weight={TextAppWeight.Medium}>
                {pedido.representante.nome}
              </TextApp>
            </StackApp>
          )}

          {pedido.tabelaDePreco?.descricao && (
            <StackApp
              direction="row"
              spacing={0.5}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <TextApp color={TextAppColor.Secondary} fontSize="0.75rem">
                Tabela de preço
              </TextApp>
              <TextApp fontSize="0.75rem" noWrap weight={TextAppWeight.Medium}>
                {pedido.tabelaDePreco.descricao}
              </TextApp>
            </StackApp>
          )}
        </StackApp>

        <StackApp sx={{ alignSelf: 'flex-start' }} onClick={(event) => event.stopPropagation()}>
          <MenuApp
            ariaLabel={`Ações do pedido ${pedido.numero}`}
            buttonIcon="mdi:dots-vertical"
            buttonSize="small"
            buttonSx={{ padding: 0.5 }}
            id={`pedido-acoes-${pedido.id}`}
            items={criarMenuItems()}
            tooltip="Ações do pedido"
          />
        </StackApp>
      </StackApp>
    </BoxApp>
  )
}
