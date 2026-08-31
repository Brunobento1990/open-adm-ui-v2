import { useEffect, useState } from 'react'
import { useApiTransacaoFinanceira } from '../../../api/useApiTransacaoFinanceira'
import { BadgeApp } from '../../../components/BadegApp/BadgeApp'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppJustifyContent,
  BoxAppOverflow,
} from '../../../components/BoxApp/boxAppTypes'
import { DividerApp } from '../../../components/DividerApp/DividerApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { ProgressApp } from '../../../components/ProgressApp/ProgressApp'
import {
  TextApp,
  TextAppAlign,
  TextAppColor,
  TextAppSize,
  TextAppWeight,
} from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useThemeApp } from '../../../hook/useThemeApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  TipoTransacaoFinanceira,
  TipoTransacaoFinanceiraLabel,
  TransacaoFinanceiraFiltroField,
  type ExtratoFinanceiro,
  type ExtratoFinanceiroDia,
  type TransacaoFinanceira,
  type TransacaoFinanceiraFiltro,
} from '../../../types/TransacaoFinanceiraTypes'
import { formatarDataHoraUtcLocal, formatarHoraUtcLocal } from '../../../utils/dateUtils'
import { formatMoney } from '../../../utils/moneyUtils'

const PeriodoInicial = { Dias: 30 } as const
const ExtratoTexto = {
  SemDescricao: 'Transação financeira',
  SemLancamentos: 'Nenhum lançamento detalhado retornado para este dia.',
} as const

function formatarDataInput(data: Date) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function criarFiltroInicial(): TransacaoFinanceiraFiltro {
  const dataFinal = new Date()
  const dataInicial = new Date(dataFinal)
  dataInicial.setDate(dataInicial.getDate() - PeriodoInicial.Dias)

  return {
    dataInicial: formatarDataInput(dataInicial),
    dataFinal: formatarDataInput(dataFinal),
  }
}

const transacaoValidationSchema = new YupAdapter()
  .string(TransacaoFinanceiraFiltroField.DataInicial)
  .string(TransacaoFinanceiraFiltroField.DataFinal)
  .build()

type LancamentoExtratoProps = {
  transacao: TransacaoFinanceira
}

function LancamentoExtrato({ transacao }: LancamentoExtratoProps) {
  const { cores } = useThemeApp()
  const entrada = transacao.tipoTransacaoFinanceira === TipoTransacaoFinanceira.Entrada
  const descricao = transacao.parcela?.fatura?.usuario?.nome
    ?? transacao.observacao
    ?? ExtratoTexto.SemDescricao
  const valor = `${entrada ? '+' : '−'} ${formatMoney(Math.abs(transacao.valor))}`

  return (
    <BoxApp
      alignItems={BoxAppAlignItems.Center}
      display={BoxAppDisplay.Flex}
      gap="1rem"
      justifyContent={BoxAppJustifyContent.SpaceBetween}
      px=".75rem"
      py=".75rem"
    >
      <BoxApp minWidth={0}>
        <TextApp noWrap weight={TextAppWeight.Medium}>{descricao}</TextApp>
        <BoxApp alignItems={BoxAppAlignItems.Center} display={BoxAppDisplay.Flex} gap=".5rem" mt=".25rem">
          <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small}>
            {formatarHoraUtcLocal(transacao.dataDeEfetivacao)} · {TipoTransacaoFinanceiraLabel[transacao.tipoTransacaoFinanceira]}
          </TextApp>
          {transacao.ehEstorno && (
            <BadgeApp cor={cores.warning} fontSize=".75rem" padding=".1rem .4rem" texto="Estorno" />
          )}
        </BoxApp>
      </BoxApp>
      <TextApp
        color={entrada ? cores.success : cores.error}
        noWrap
        weight={TextAppWeight.SemiBold}
      >
        {valor}
      </TextApp>
    </BoxApp>
  )
}

type GrupoExtratoProps = {
  data: string
  grupo: ExtratoFinanceiroDia
}

function GrupoExtrato({ data, grupo }: GrupoExtratoProps) {
  const { cores } = useThemeApp()

  return (
    <BoxApp>
      <BoxApp
        alignItems={BoxAppAlignItems.Center}
        backgroundColor={cores.dividerSoft}
        borderRadius="6px"
        display={BoxAppDisplay.Flex}
        gap="1rem"
        justifyContent={BoxAppJustifyContent.SpaceBetween}
        px=".75rem"
        py=".625rem"
      >
        <TextApp weight={TextAppWeight.SemiBold}>{formatarDataHoraUtcLocal(data)}</TextApp>
        <BoxApp>
          <TextApp align={TextAppAlign.Right} color={TextAppColor.Secondary} fontSize=".7rem">Total do dia</TextApp>
          <TextApp
            color={grupo.total >= 0 ? cores.success : cores.error}
            noWrap
            weight={TextAppWeight.SemiBold}
          >
            {formatMoney(grupo.total)}
          </TextApp>
        </BoxApp>
      </BoxApp>
      {(grupo.transacoes?.length ?? 0) === 0 && (
        <BoxApp px=".75rem" py=".625rem">
          <TextApp color={TextAppColor.Secondary} size={TextAppSize.Small}>
            {ExtratoTexto.SemLancamentos}
          </TextApp>
        </BoxApp>
      )}
      {(grupo.transacoes ?? []).map((transacao, index) => (
        <BoxApp key={transacao.id}>
          {index > 0 && <DividerApp />}
          <LancamentoExtrato transacao={transacao} />
        </BoxApp>
      ))}
      <DividerApp />
    </BoxApp>
  )
}

export function TransacaoFinanceiraPage() {
  const { extrato } = useApiTransacaoFinanceira()
  const [extratoFinanceiro, setExtratoFinanceiro] = useState<ExtratoFinanceiro>({})
  const filtroInicial = criarFiltroInicial()
  const form = useFormikAdapter<TransacaoFinanceiraFiltro>({
    initialValues: filtroInicial,
    validationSchema: transacaoValidationSchema,
    onSubmit: buscar,
  })

  async function buscar(filtro: TransacaoFinanceiraFiltro) {
    const response = await extrato.fetch(filtro)
    if (response) setExtratoFinanceiro(response)
  }

  useEffect(() => {
    buscar(filtroInicial)
    // O extrato deve carregar uma vez ao entrar na tela com o período inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const grupos = Object.entries(extratoFinanceiro)

  return (
    <FormRoot.Form loading={extrato.loading} submit={form.onSubmit} textoButton="Filtrar">
      <FormRoot.FormRow>
        <FormRoot.FormItemRow xs={12} md={3}>
          <InputApp
            error={form.error(TransacaoFinanceiraFiltroField.DataInicial)}
            helperText={form.helperText(TransacaoFinanceiraFiltroField.DataInicial)}
            id={TransacaoFinanceiraFiltroField.DataInicial}
            label="Data inicial"
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Date}
            value={form.values.dataInicial}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow xs={12} md={3}>
          <InputApp
            error={form.error(TransacaoFinanceiraFiltroField.DataFinal)}
            helperText={form.helperText(TransacaoFinanceiraFiltroField.DataFinal)}
            id={TransacaoFinanceiraFiltroField.DataFinal}
            label="Data final"
            onBlur={form.onBlur}
            onChange={form.onChange}
            required
            type={InputAppType.Date}
            value={form.values.dataFinal}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <BoxApp flex={1} minHeight="300px" overflow={BoxAppOverflow.Auto} pr=".25rem">
        {extrato.loading && <ProgressApp />}
        {!extrato.loading && grupos.length === 0 && (
          <TextApp color={TextAppColor.Secondary}>Não há transações no período informado.</TextApp>
        )}
        <BoxApp display={BoxAppDisplay.Grid} gap=".75rem">
          {grupos.map(([data, grupo]) => (
            <GrupoExtrato data={data} grupo={grupo} key={data} />
          ))}
        </BoxApp>
      </BoxApp>
    </FormRoot.Form>
  )
}
