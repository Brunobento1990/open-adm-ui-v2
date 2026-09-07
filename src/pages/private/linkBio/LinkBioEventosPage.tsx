import { useState } from 'react'
import { useApiLinkBio } from '../../../api/useApiLinkBio'
import { BoxApp } from '../../../components/BoxApp/BoxApp'
import { BoxAppDisplay, BoxAppFlexDirection } from '../../../components/BoxApp/boxAppTypes'
import { BarChartApp } from '../../../components/Chart/BarChartApp'
import { InputApp } from '../../../components/InputApp/InputApp'
import { InputAppType } from '../../../components/InputApp/inputAppTypes'
import { MetricCardApp } from '../../../components/MetricCardApp/MetricCardApp'
import { PaperApp } from '../../../components/PaperApp/PaperApp'
import { TabelaComDrag, type TypeColumns } from '../../../components/Tabela/TabelaComDrag'
import { TextApp, TextAppColor, TextAppWeight } from '../../../components/TextApp/TextApp'
import { FormRoot } from '../../../form'
import { useFormikAdapter } from '../../../hook/useFormikAdapter'
import { YupAdapter } from '../../../lib/YupAdapter'
import {
  LinkBioEventosFormField,
  TipoEventoLinkBio,
  type LinkBioEventosFiltro,
  type LinkBioIndicadores,
} from '../../../types/LinkBioTypes'
import { TipoPaletaCorEnum } from '../../../types/TipoPaletaCorEnum'

type EventosFormValues = { dataInicial: string; dataFinal: string }
type EvolucaoDia = { data: string; cliques: number; visualizacoes: number }

function formatarDataInput(data: Date) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

const hoje = new Date()
const inicioPadrao = new Date(hoje)
inicioPadrao.setDate(inicioPadrao.getDate() - 29)
const initialValues: EventosFormValues = {
  dataFinal: formatarDataInput(hoje),
  dataInicial: formatarDataInput(inicioPadrao),
}
const validationSchema = new YupAdapter()
  .string(LinkBioEventosFormField.DataInicial, 'Informe a data inicial')
  .string(LinkBioEventosFormField.DataFinal, 'Informe a data final')
  .build()

const colunasLinks: TypeColumns[] = [
  { field: 'titulo', flex: 1, headerName: 'Link' },
  { field: 'quantidade', headerName: 'Cliques', width: 120 },
]

function criarPayload(values: EventosFormValues): LinkBioEventosFiltro {
  return {
    dataInicial: `${values.dataInicial}T00:00:00.000`,
    dataFinal: `${values.dataFinal}T23:59:59.999`,
  }
}

function agruparEventos(indicadores: LinkBioIndicadores): EvolucaoDia[] {
  const dias = new Map<string, EvolucaoDia>()
  indicadores.eventos.forEach((evento) => {
    const data = evento.dataHora.slice(0, 10)
    const dia = dias.get(data) ?? { cliques: 0, data, visualizacoes: 0 }
    if (evento.tipo === TipoEventoLinkBio.Clique) dia.cliques += 1
    if (evento.tipo === TipoEventoLinkBio.Visualizacao) dia.visualizacoes += 1
    dias.set(data, dia)
  })
  return [...dias.values()].sort((a, b) => a.data.localeCompare(b.data))
}

function formatarData(data: string) {
  const [, mes, dia] = data.split('-')
  return `${dia}/${mes}`
}

export function LinkBioEventosPage() {
  const { eventos } = useApiLinkBio()
  const [indicadores, setIndicadores] = useState<LinkBioIndicadores>()
  const form = useFormikAdapter<EventosFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values: EventosFormValues) => {
      if (values.dataInicial > values.dataFinal) {
        form.setError(LinkBioEventosFormField.DataFinal, 'A data final deve ser igual ou posterior à inicial')
        return
      }
      const response = await eventos.fetch(criarPayload(values))
      if (response) setIndicadores(response)
    },
  })

  const evolucao = indicadores ? agruparEventos(indicadores) : []
  const taxaClique = indicadores?.visualizacoes
    ? `${((indicadores.cliques / indicadores.visualizacoes) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
    : '0%'

  return (
    <FormRoot.Form loading={eventos.loading} responsiveMobileActions submit={form.onSubmit} textoButton="Consultar">
      <FormRoot.FormRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp error={form.error(LinkBioEventosFormField.DataInicial)} focus helperText={form.helperText(LinkBioEventosFormField.DataInicial)} id={LinkBioEventosFormField.DataInicial} label="Data inicial" onBlur={form.onBlur} onChange={form.onChange} required type={InputAppType.Date} value={form.values.dataInicial} />
        </FormRoot.FormItemRow>
        <FormRoot.FormItemRow sm={6} xs={12}>
          <InputApp error={form.error(LinkBioEventosFormField.DataFinal)} helperText={form.helperText(LinkBioEventosFormField.DataFinal)} id={LinkBioEventosFormField.DataFinal} label="Data final" onBlur={form.onBlur} onChange={form.onChange} required type={InputAppType.Date} value={form.values.dataFinal} />
        </FormRoot.FormItemRow>
      </FormRoot.FormRow>

      {indicadores && (
        <BoxApp display={BoxAppDisplay.Flex} flexDirection={BoxAppFlexDirection.Column} gap={2}>
          <BoxApp display={BoxAppDisplay.Grid} gap={2} sx={{ gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
            <MetricCardApp icon="solar:eye-bold" label="Visualizações" value={String(indicadores.visualizacoes)} />
            <MetricCardApp icon="solar:cursor-square-bold" label="Cliques" value={String(indicadores.cliques)} />
            <MetricCardApp icon="solar:chart-2-bold" label="Taxa de clique" value={taxaClique} />
          </BoxApp>

          {indicadores.eventos.length === 0 ? (
            <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
              <TextApp color={TextAppColor.Secondary}>Nenhum evento encontrado no período selecionado.</TextApp>
            </PaperApp>
          ) : (
            <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
              <TextApp fontSize="1.1rem" weight={TextAppWeight.SemiBold}>Evolução por dia</TextApp>
              <BarChartApp
                labels={evolucao.map((dia) => formatarData(dia.data))}
                series={[
                  { data: evolucao.map((dia) => dia.visualizacoes), label: 'Visualizações' },
                  { color: TipoPaletaCorEnum.Info, data: evolucao.map((dia) => dia.cliques), label: 'Cliques' },
                ]}
              />
            </PaperApp>
          )}

          <PaperApp sx={{ boxShadow: 'none' }} variant="outlined">
            <TextApp fontSize="1.1rem" gutterBottom weight={TextAppWeight.SemiBold}>Links mais clicados</TextApp>
            {indicadores.linksMaisClicados.length === 0 ? (
              <TextApp color={TextAppColor.Secondary}>Nenhum clique em link no período selecionado.</TextApp>
            ) : (
              <TabelaComDrag columns={colunasLinks} height={Math.min(420, 48 + indicadores.linksMaisClicados.length * 42)} rows={indicadores.linksMaisClicados} />
            )}
          </PaperApp>
        </BoxApp>
      )}
    </FormRoot.Form>
  )
}
