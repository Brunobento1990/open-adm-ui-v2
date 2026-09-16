import { useThemeApp } from '../../hook/useThemeApp'
import { StatusParcela, TipoFatura, type ParcelaPaginacao } from '../../types/FaturaTypes'
import { TipoPaletaCorEnum } from '../../types/TipoPaletaCorEnum'
import { formatarDataHoraUtcLocal } from '../../utils/dateUtils'
import { formatMoney } from '../../utils/moneyUtils'
import { BoxApp } from '../BoxApp/BoxApp'
import { StackApp } from '../StackApp/StackApp'
import { TextApp, TextAppColor, TextAppWeight } from '../TextApp/TextApp'
import { EstornarParcelaButton } from './EstornarParcelaButton'
import { PagarParcelaButton } from './PagarParcelaButton'
import { RenegociarFaturaButton } from './RenegociarFaturaButton'
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
    <StackApp direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
      <TextApp color={TextAppColor.Secondary}>{label}</TextApp>
      <TextApp
        color={destaque ? getPaletteColor(TipoPaletaCorEnum.Success) : TextAppColor.Default}
        weight={destaque ? TextAppWeight.Bold : TextAppWeight.Medium}
      >
        {formatMoney(valor)}
      </TextApp>
    </StackApp>
  )
}

export function FaturaMobileRow({ parcela, tipo }: Props) {
  const permiteEstorno =
    parcela.status === StatusParcela.PagoParcial || parcela.status === StatusParcela.Pago

  return (
    <BoxApp py={1} width="100%">
      <StackApp spacing={1}>
        <StackApp
          direction="row"
          spacing={1}
          sx={{ alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}
        >
          <BoxApp flex={1} minWidth={0} sx={{ overflow: 'hidden' }}>
            <TextApp noWrap weight={TextAppWeight.Bold}>
              {parcela.nomeUsuario || 'Cliente não informado'}
            </TextApp>
            <TextApp color={TextAppColor.Secondary} noWrap>
              Fatura #{parcela.numeroFatura} · Parcela {parcela.numeroDaParcela}
              {parcela.numeroPedido ? ` · Pedido #${parcela.numeroPedido}` : ''}
            </TextApp>
          </BoxApp>
          <BoxApp sx={{ flexShrink: 0 }}>
            <StatusParcelaBadge status={parcela.status} />
          </BoxApp>
        </StackApp>

        <StackApp direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
          <TextApp color={TextAppColor.Secondary}>Vencimento</TextApp>
          <TextApp weight={TextAppWeight.Medium}>
            {formatarDataHoraUtcLocal(parcela.vencimento)}
          </TextApp>
        </StackApp>

        <BoxApp borderTop="1px solid" borderColor="divider" pt={1}>
          <StackApp spacing={0.5}>
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

        {(!parcela.quitada || permiteEstorno) && (
          <StackApp direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
            {!parcela.quitada && <PagarParcelaButton parcelaId={parcela.id} />}
            {!parcela.quitada && <RenegociarFaturaButton faturaId={parcela.faturaId} />}
            {permiteEstorno && <EstornarParcelaButton parcelaId={parcela.id} />}
          </StackApp>
        )}
      </StackApp>
    </BoxApp>
  )
}
