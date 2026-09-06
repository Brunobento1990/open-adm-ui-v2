import { useState } from 'react'
import { useApiRelatorioVendaProduto } from '../../../api/useApiRelatorioVendaProduto'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppJustifyContent,
} from '../../../components/BoxApp/boxAppTypes'
import { ButtonApp, ButtonAppVariant } from '../../../components/ButtonApp/ButtonApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { MetricCardApp } from '../../../components/MetricCardApp/MetricCardApp'
import { PaginationApp } from '../../../components/PaginationApp/PaginationApp'
import { RadioApp } from '../../../components/RadioApp/RadioApp'
import { TextApp } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { useThemeApp } from '../../../hook/useThemeApp'
import {
  RelatorioVendaProdutoFormField,
  TipoRelatorioVendaProduto,
  type RelatorioVendaProdutoFormValues,
  type RelatorioVendaProdutoResponse,
} from '../../../types/RelatorioVendaProdutoTypes'
import { formatMoney, formatNumber } from '../../../utils/moneyUtils'
import { baixarPdf } from '../../../utils/pdfUtils'
import { RelatorioVendaProdutoItemCard } from './RelatorioVendaProdutoItemCard'
import { RelatorioVendaProdutoTable } from './RelatorioVendaProdutoTable'

const initialValues: RelatorioVendaProdutoFormValues = {
  asc: false,
  dataFinal: '',
  dataInicial: '',
  skip: 1,
}
const periodoOptions = [
  { label: 'Últimos 7 dias', value: TipoRelatorioVendaProduto.UltimosSeteDias },
  { label: 'Últimos 30 dias', value: TipoRelatorioVendaProduto.UltimosTrintaDias },
  { label: 'Últimos 90 dias', value: TipoRelatorioVendaProduto.UltimosNoventaDias },
]

export function RelatorioVendaProdutoPage() {
  const api = useApiRelatorioVendaProduto()
  const { isCelular } = useThemeApp()
  const [response, setResponse] = useState<RelatorioVendaProdutoResponse>()
  const form = useFormikAdapter<RelatorioVendaProdutoFormValues>({
    initialValues,
    onSubmit: async (values) => {
      const payload = { ...values, skip: 1 }
      const result = await api.listar.fetch(payload)
      if (!result) return
      form.setValue({ skip: 1 })
      setResponse(result)
    },
  })

  async function alterarPagina(skip: number) {
    const result = await api.listar.fetch({ ...form.values, skip })
    if (!result) return
    form.setValue({ skip })
    setResponse(result)
  }

  async function imprimir() {
    const pdf = await api.imprimir.fetch(form.values)
    if (pdf) baixarPdf(pdf, 'relatorio-venda-produto.pdf')
  }

  const itens = response?.dados ?? []

  return (
    <FormRoot.Form
      footer={{
        children: (
          <ButtonApp
            loading={api.imprimir.loading}
            onClick={imprimir}
            variant={ButtonAppVariant.Outlined}
          >
            Download PDF
          </ButtonApp>
        ),
      }}
      loading={api.listar.loading}
      responsiveMobileActions
      submit={form.onSubmit}
      textoButton="Buscar"
    >
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            id={RelatorioVendaProdutoFormField.DataInicial}
            label="Data inicial"
            onChange={form.onChange}
            type={InputAppType.Date}
            value={form.values.dataInicial ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={3} xs={12}>
          <InputApp
            id={RelatorioVendaProdutoFormField.DataFinal}
            label="Data final"
            onChange={form.onChange}
            type={InputAppType.Date}
            value={form.values.dataFinal ?? ''}
          />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <RadioApp
            id={RelatorioVendaProdutoFormField.Tipo}
            onChange={(_, value) => form.setValue({ tipo: value })}
            options={periodoOptions}
            row
            value={form.values.tipo}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp
            checked={form.values.asc}
            id={RelatorioVendaProdutoFormField.Asc}
            label="Ordenar por menos vendidos"
            onChange={form.onChange}
            type={InputAppType.Checkbox}
          />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>

      {response && (
        <>
          <FormRoot.FormRow>
            <FormRoot.FormItemRow sm={6} xs={12}>
              <MetricCardApp
                icon="solar:box-bold"
                label="Quantidade total"
                value={formatNumber(response.totais.quantidadeTotal)}
              />
            </FormRoot.FormItemRow>
            <FormRoot.FormItemRow sm={6} xs={12}>
              <MetricCardApp
                icon="solar:wallet-money-bold"
                label="Valor total"
                value={formatMoney(response.totais.valorTotal)}
                valueColor="success.main"
              />
            </FormRoot.FormItemRow>
          </FormRoot.FormRow>
          {itens.length === 0 ? (
            <TextApp>Nenhuma venda de produto encontrada.</TextApp>
          ) : isCelular ? (
            <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={1}>
              {itens.map((item) => (
                <RelatorioVendaProdutoItemCard
                  item={item}
                  key={`${item.id}-${item.peso || item.tamanho || ''}`}
                />
              ))}
            </BoxApp>
          ) : (
            <RelatorioVendaProdutoTable itens={itens} />
          )}
          <BoxApp
            alignItems={BoxAppAlignItems.Center}
            display={BoxAppDisplay.Flex}
            sx={{
              marginTop: '1rem',
            }}
            justifyContent={BoxAppJustifyContent.End}
          >
            <PaginationApp
              count={response.totalPagina}
              onChange={alterarPagina}
              page={form.values.skip}
            />
          </BoxApp>
        </>
      )}
    </FormRoot.Form>
  )
}
