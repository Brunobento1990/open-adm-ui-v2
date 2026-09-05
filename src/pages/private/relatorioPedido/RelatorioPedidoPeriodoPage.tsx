import { useState } from 'react'
import { useApiPedido } from '../../../api/useApiPedido'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppDisplay, BoxAppFlexDirection } from '../../../components/BoxApp/boxAppTypes'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { BarChartApp } from '../../../components/Chart/BarChartApp'
import { ClienteEcommerceDropDown } from '../../../components/DropDown/ClienteEcommerceDropDown'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { MetricCardApp } from '../../../components/MetricCardApp/MetricCardApp'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { useSnackbarApp } from '../../../components/Snackbar/useSnackbar'
import { TabsApp } from '../../../components/TabsApp/TabsApp'
import { TextApp, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useThemeApp } from '../../../hook/useThemeApp'
import { YupAdapter } from '../../../lib/YupAdapter'
import { RelatorioPedidoFormField, type RelatorioPedidoFormValues, type RelatorioPedidoListagem, type RelatorioPedidoPayload } from '../../../types/PedidoTypes'
import { TipoPaletaCorEnum } from '../../../types/TipoPaletaCorEnum'
import { formatMoney, formatNumber } from '../../../utils/moneyUtils'
import { baixarPdf } from '../../../utils/pdfUtils'
import { RelatorioPedidoItemCard } from './RelatorioPedidoItemCard'
import { RelatorioPedidoItensTable } from './RelatorioPedidoItensTable'

const RelatorioTab = { Graficos: 1, Itens: 0 } as const
const relatorioTabs = [
  { label: 'Itens', value: RelatorioTab.Itens },
  { label: 'Gráficos', value: RelatorioTab.Graficos },
]
const initialValues: RelatorioPedidoFormValues = { dataFinal: '', dataInicial: '' }
const validationSchema = new YupAdapter()
  .stringRequiredWhenEmpty(RelatorioPedidoFormField.DataInicial, RelatorioPedidoFormField.UsuarioId, 'Informe a data inicial')
  .stringRequiredWhenEmpty(RelatorioPedidoFormField.DataFinal, RelatorioPedidoFormField.UsuarioId, 'Informe a data final')
  .build()

function criarPayload(values: RelatorioPedidoFormValues): RelatorioPedidoPayload {
  return {
    ...(values.dataFinal ? { dataFinal: values.dataFinal } : {}),
    ...(values.dataInicial ? { dataInicial: values.dataInicial } : {}),
    ...(values.usuarioId ? { usuarioId: values.usuarioId } : {}),
  }
}

export function RelatorioPedidoPeriodoPage() {
  const { imprimirRelatorioPorPeriodo, relatorioPorPeriodo } = useApiPedido()
  const { isCelular } = useThemeApp()
  const snack = useSnackbarApp()
  const [tab, setTab] = useState<number>(RelatorioTab.Itens)
  const [relatorio, setRelatorio] = useState<RelatorioPedidoListagem>()
  const form = useFormikAdapter<RelatorioPedidoFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values: RelatorioPedidoFormValues) => {
      const response = await relatorioPorPeriodo.fetch(criarPayload(values))
      if (!response) return
      setRelatorio(response)
      if (response.totalDeRegistros === 0) snack.show('Não há pedidos para o período selecionado!', 'error')
    },
  })

  async function imprimir() {
    const response = await imprimirRelatorioPorPeriodo.fetch(criarPayload(form.values))
    if (response) {
      const nomeArquivo = form.values.dataInicial && form.values.dataFinal
        ? `${form.values.dataInicial}-${form.values.dataFinal}.pdf`
        : 'relatorio-pedidos.pdf'
      baixarPdf(response, nomeArquivo)
    }
  }

  const values = relatorio?.values ?? []
  const totaisPorUsuario = relatorio?.totaisPorUsuario ?? []
  const podeImprimir = Boolean(form.values.usuarioId || (form.values.dataInicial && form.values.dataFinal))

  return (
    <FormRoot.Form
      footer={{ children: <ButtonApp disabled={!podeImprimir} loading={imprimirRelatorioPorPeriodo.loading} onClick={imprimir} variant={ButtonAppVariant.Outlined}>Download PDF</ButtonApp> }}
      loading={relatorioPorPeriodo.loading}
      responsiveMobileActions
      submit={form.onSubmit}
      textoButton="Buscar"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <InputApp error={form.error(RelatorioPedidoFormField.DataInicial)} helperText={form.helperText(RelatorioPedidoFormField.DataInicial)} id={RelatorioPedidoFormField.DataInicial} label="Data inicial" onBlur={form.onBlur} onChange={form.onChange} required={!form.values.usuarioId} type={InputAppType.Date} value={form.values.dataInicial ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <InputApp error={form.error(RelatorioPedidoFormField.DataFinal)} helperText={form.helperText(RelatorioPedidoFormField.DataFinal)} id={RelatorioPedidoFormField.DataFinal} label="Data final" onBlur={form.onBlur} onChange={form.onChange} required={!form.values.usuarioId} type={InputAppType.Date} value={form.values.dataFinal ?? ''} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={4} xs={12}>
          <ClienteEcommerceDropDown label="Selecione um cliente" onChange={(usuario) => form.setValue({ usuario, usuarioId: usuario?.id })} required={false} value={form.values.usuario} />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>

      {relatorio && (
        <>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow sm={4} xs={12}><MetricCardApp icon="solar:document-text-bold" label="Pedidos" value={String(relatorio.totais.quantidadePedidos)} /></FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={4} xs={12}><MetricCardApp icon="solar:box-bold" label="Itens" value={formatNumber(relatorio.totais.quantidadeItens)} /></FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={4} xs={12}><MetricCardApp icon="solar:wallet-money-bold" label="Valor total" value={formatMoney(relatorio.totais.valorTotal)} valueColor="success.main" /></FormRoot.FormItemRow>
          </FormRoot.FormRow>
          <TabsApp ariaLabel="Visualizações do relatório de pedidos" items={relatorioTabs} onChange={setTab} value={tab} />
          {tab === RelatorioTab.Itens && (values.length === 0 ? (
            <TextApp>Nenhum pedido encontrado.</TextApp>
          ) : isCelular ? (
            <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={1}>
              {values.map((item) => <RelatorioPedidoItemCard item={item} key={item.pedidoId} />)}
            </BoxApp>
          ) : <RelatorioPedidoItensTable itens={values} />)}
          {tab === RelatorioTab.Graficos && (
            <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={2}>
              <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
                <TextApp fontSize="1.1rem" weight={TextAppWeight.SemiBold}>Valor total por cliente</TextApp>
                <BarChartApp labels={totaisPorUsuario.map((item) => item.usuario)} series={[{ color: TipoPaletaCorEnum.Success, data: totaisPorUsuario.map((item) => item.valorTotal), label: 'Valor total' }]} valueFormatter={formatMoney} />
              </PaperApp>
              <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
                <TextApp fontSize="1.1rem" weight={TextAppWeight.SemiBold}>Pedidos e itens por cliente</TextApp>
                <BarChartApp labels={totaisPorUsuario.map((item) => item.usuario)} series={[{ data: totaisPorUsuario.map((item) => item.quantidadePedidos), label: 'Pedidos' }, { color: TipoPaletaCorEnum.Info, data: totaisPorUsuario.map((item) => item.quantidadeItens), label: 'Itens' }]} valueFormatter={formatNumber} />
              </PaperApp>
            </BoxApp>
          )}
        </>
      )}
    </FormRoot.Form>
  )
}
