import { useThemeApp } from '../../hook/useThemeApp'
import { useNavigationApp } from '../../hook/useNavigationApp'
import { getPagarParcelaPath, PrivateRoutePath } from '../../routes/appRoutes'
import { StatusParcela, TipoFatura, type ParcelaPaginacao } from '../../types/FaturaTypes'
import { TipoPaletaCorEnum } from '../../types/TipoPaletaCorEnum'
import { formatarDataHoraUtcLocal } from '../../utils/dateUtils'
import { formatMoney } from '../../utils/moneyUtils'
import { BoxApp } from '../BoxApp/BoxApp'
import { MenuApp, type MenuAppItem } from '../MenuApp/MenuApp'
import { StackApp } from '../StackApp/StackApp'
import { TextApp, TextAppColor, TextAppWeight } from '../TextApp/TextApp'
import { EstornarParcelaButton } from './EstornarParcelaButton'
import { StatusParcelaBadge } from './StatusParcelaBadge'

type Props = {
  parcela: ParcelaPaginacao
  tipo: TipoFatura
}

type ValorProps = {
  destaque?: boolean
  label: string
  valor: number
}

function LinhaValor({ destaque = false, label, valor }: ValorProps) {
  const { getPaletteColor } = useThemeApp()

  return (
    <StackApp direction="row" spacing={0.5} sx={{ justifyContent: 'space-between' }}>
      <TextApp color={TextAppColor.Secondary} fontSize="0.75rem">{label}</TextApp>
      <TextApp
        color={destaque ? getPaletteColor(TipoPaletaCorEnum.Success) : TextAppColor.Default}
        fontSize="0.75rem"
        weight={destaque ? TextAppWeight.Bold : TextAppWeight.Medium}
      >
        {formatMoney(valor)}
      </TextApp>
    </StackApp>
  )
}

export function FaturaMobileRow({ parcela, tipo }: Props) {
  const { navigate } = useNavigationApp()
  const { cores } = useThemeApp()
  const permiteEstorno =
    parcela.status === StatusParcela.PagoParcial || parcela.status === StatusParcela.Pago

  function criarMenuItems(abrirEstorno?: () => void, estornoLoading = false): MenuAppItem[] {
    const items: MenuAppItem[] = []

    if (!parcela.quitada) {
      items.push(
        {
          icon: 'fe:app-menu',
          iconColor: cores.success,
          label: 'Baixar parcela',
          onClick: () => navigate(getPagarParcelaPath(parcela.id)),
        },
        {
          icon: 'solar:hand-money-linear',
          iconColor: cores.primary,
          label: 'Renegociar fatura',
          onClick: () => navigate(`${PrivateRoutePath.FaturaRenegociar}/${parcela.faturaId}`),
        },
      )
    }

    if (permiteEstorno && abrirEstorno) {
      items.push({
        disabled: estornoLoading,
        icon: 'mage:reload-reverse',
        iconColor: cores.error,
        label: 'Estornar pagamentos',
        onClick: abrirEstorno,
      })
    }

    return items
  }

  function renderMenu(items: MenuAppItem[]) {
    return (
      <MenuApp
        ariaLabel={`Ações da fatura ${parcela.numeroFatura}`}
        buttonIcon="mdi:dots-vertical"
        buttonSize="small"
        buttonSx={{ padding: 0.5 }}
        id={`fatura-acoes-${parcela.id}`}
        items={items}
        tooltip="Ações da fatura"
      />
    )
  }

  return (
    <BoxApp py={0.25} width="100%">
      <StackApp direction="row" spacing={0.5} sx={{ alignItems: 'stretch' }}>
        <StackApp spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <StackApp
          direction="row"
          spacing={0.5}
          sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <BoxApp flex={1} minWidth={0} sx={{ overflow: 'hidden' }}>
            <TextApp fontSize="0.8rem" noWrap weight={TextAppWeight.Bold}>
              {parcela.nomeUsuario || 'Cliente não informado'}
            </TextApp>
            <TextApp color={TextAppColor.Secondary} fontSize="0.7rem" noWrap>
              Fatura #{parcela.numeroFatura} · Parcela {parcela.numeroDaParcela}
              {parcela.numeroPedido ? ` · Pedido #${parcela.numeroPedido}` : ''}
            </TextApp>
          </BoxApp>
          <BoxApp sx={{ flexShrink: 0 }}>
            <StatusParcelaBadge status={parcela.status} />
          </BoxApp>
        </StackApp>

        <StackApp direction="row" spacing={0.5} sx={{ justifyContent: 'space-between' }}>
          <TextApp color={TextAppColor.Secondary} fontSize="0.75rem">Vencimento</TextApp>
          <TextApp fontSize="0.75rem" weight={TextAppWeight.Medium}>
            {formatarDataHoraUtcLocal(parcela.vencimento)}
          </TextApp>
        </StackApp>

        <BoxApp borderTop="1px solid" borderColor="divider" pt={0.25}>
          <StackApp spacing={0}>
            <LinhaValor label="Valor" valor={parcela.valor} />
            <LinhaValor label="Valor recebido" valor={parcela.valorPagoRecebidoLiquido} />
            <LinhaValor label="Desconto" valor={parcela.descontoConcedido} />
            <LinhaValor
              destaque
              label={tipo === TipoFatura.AReceber ? 'Valor a receber' : 'Valor a pagar'}
              valor={parcela.valorAPagarAReceber}
            />
          </StackApp>
        </BoxApp>
        </StackApp>

        {permiteEstorno ? (
          <EstornarParcelaButton
            parcelaId={parcela.id}
            renderTrigger={(abrirEstorno, loading) => (
              <StackApp sx={{ alignSelf: 'flex-start' }} onClick={(event) => event.stopPropagation()}>
                {renderMenu(criarMenuItems(abrirEstorno, loading))}
              </StackApp>
            )}
          />
        ) : !parcela.quitada ? (
          <StackApp sx={{ alignSelf: 'flex-start' }} onClick={(event) => event.stopPropagation()}>
            {renderMenu(criarMenuItems())}
          </StackApp>
        ) : null}
      </StackApp>
    </BoxApp>
  )
}
