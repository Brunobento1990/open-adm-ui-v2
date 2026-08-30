import { useEffect, useState, type ReactNode } from 'react'
import { ApiResourceRoutePath } from '../../api/apiRoutes'
import { keysLocalStorage } from '../../configs/keysLocalStorage'
import {
  ApiMethod,
  useApi,
  type StatusRequisicao,
  type TypeMethod,
} from '../../hook/useApi'
import { useLocalStorageApp } from '../../hook/useLocalStorageApp'
import { useNavigationApp } from '../../hook/useNavigationApp'
import { BoxApp } from '../BoxApp/BoxApp'
import {
  BoxAppComponent,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppOverflow,
} from '../BoxApp/boxAppTypes'
import { DefaultColuns } from './DefaultColuns'
import { FooterTable } from './FooterTable'
import { HeaderTable } from './HeaderTable'
import { TabelaComDrag } from './TabelaComDrag'
import {
  TableSortDirection,
  type ISort,
  type ISortingTable,
  type TypeColumns,
} from './tabelaComDragTypes'

type PaginacaoResponse = {
  values: any[]
  totalPaginas: number
  totalRegistros: number
}

export interface ITableIndexProps {
  columns: TypeColumns[]
  url: string
  urlAdd?: string
  urlDelete?: string
  urlView?: string
  urlEdit?: string
  notShowHeader?: boolean
  notBtnAdd?: boolean
  selecionarLinha?: (row: any, index: number) => void
  refreshPai?: boolean
  filtroComplementar?: any
  desabilitarColunaAtivo?: boolean
  metodo?: TypeMethod
  childrenHeader?: ReactNode
  orderBy?: string
  order?: ISort
  acoesExtras?: ReactNode
  onContextMenu?: (event: React.MouseEvent, row: any, index: number) => void
  rowHeight?: number
  getBackgroundColor?: (row: any) => Record<string, string | number> | undefined
  nomeDaTabela?: string
  pausarAutoRefresh?: boolean
  statusInicial?: StatusRequisicao
  headersReq?: any
}

export function TableIndex(props: ITableIndexProps) {
  const { getItem } = useLocalStorageApp()
  const { navigate } = useNavigationApp()
  const listarInativoInitial =
    getItem<string>(keysLocalStorage.listarInativos) === 'true'
  const [listarInativos, setListarInativos] = useState(listarInativoInitial)
  const [paginacao, setPaginacao] = useState<PaginacaoResponse>()
  const [chaveReset, setChaveReset] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [search, setSearch] = useState('')
  const [quantidadePorPagina, setQuantidadePorPagina] = useState(
    Number(getItem<string>(keysLocalStorage.quantidadePorPagina) ?? '15'),
  )
  const [sorting, setSorting] = useState<ISortingTable>({
    field: props.orderBy ?? 'id',
    sort: props.order ?? TableSortDirection.Desc,
  })
  const { action, statusRequisicao } = useApi({
    method: props.metodo ?? ApiMethod.Post,
    url: `${props.url}${ApiResourceRoutePath.Paginacao}`,
    naoRenderizarResposta: true,
    statusInicial: props.statusInicial ?? 'loading',
    header: props.headersReq,
  })
  const alterarStatusApi = useApi({
    method: ApiMethod.Put,
    url: props.url,
  })

  async function refresh(searchValue?: string) {
    if (props.pausarAutoRefresh) return

    const currentSearch = searchValue ?? search
    setSearch(currentSearch)
    const response = await action<PaginacaoResponse>({
      body: {
        skip: currentSearch ? 0 : pagina,
        take: quantidadePorPagina,
        listarInativo: listarInativos,
        orderBy: sorting.field,
        asc: sorting.sort === TableSortDirection.Asc,
        ...props.filtroComplementar,
        search: currentSearch.replace(/[./-]/g, '').toUpperCase() || undefined,
      },
    })

    setPaginacao(response)
  }

  function excluirConfiguracaoTabela() {
    if (!props.nomeDaTabela) return
    setChaveReset((current) => current + 1)
  }

  useEffect(() => {
    // O carregamento remoto atualiza a paginação somente após a resposta da API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    quantidadePorPagina,
    listarInativos,
    sorting,
    props.refreshPai,
    props.pausarAutoRefresh,
  ])

  function onDoubleClick(item: any) {
    if (props.urlEdit) navigate(`${props.urlEdit}/${item?.id}`)
  }

  function onDoubleClickView(item: any) {
    if (props.urlView) navigate(`${props.urlView}/${item?.id}`)
  }

  async function alterarStatus(item: any) {
    const ativo = !item.ativo
    const response = await alterarStatusApi.action({
      urlParams: `${ApiResourceRoutePath.AlterarStatus}/${encodeURIComponent(item.id)}/${ativo}`,
      message: `Registro ${ativo ? 'ativado' : 'inativado'} com sucesso`,
    })

    if (response !== undefined) await refresh()
  }

  const defaultColumns = DefaultColuns({
    alterarStatus: props.desabilitarColunaAtivo ? undefined : alterarStatus,
    editar: props.urlEdit ? onDoubleClick : undefined,
    loadingAlterarStatus: alterarStatusApi.loading,
    visualizar: props.urlView ? onDoubleClickView : undefined,
  })

  return (
    <BoxApp
      component={BoxAppComponent.Div}
      overflow={BoxAppOverflow.Auto}
      height="100%"
      width="100%"
      minHeight={0}
      boxSizing="border-box"
      display={BoxAppDisplay.Flex}
      flex={1}
      flexDirection={BoxAppFlexDirection.Column}
      gap=".5rem"
    >
      {!props.notShowHeader && (
        <HeaderTable
          listarInativos={listarInativos}
          setListarInativos={setListarInativos}
          urlAdd={props.urlAdd}
          notBtnAdd={props.notBtnAdd}
          pesquisar={refresh}
          desabilitarColunaAtivo={props.desabilitarColunaAtivo}
          childrenHeader={props.childrenHeader}
          acoesExtras={props.acoesExtras}
          reiniciarColunas={
            props.nomeDaTabela ? excluirConfiguracaoTabela : undefined
          }
        />
      )}

      <BoxApp flex={1} minHeight={0} overflow={BoxAppOverflow.Hidden}>
        <TabelaComDrag
          loading={statusRequisicao === 'loading'}
          selecionarLinha={props.selecionarLinha}
          onDoubleClick={
            props.urlEdit
              ? onDoubleClick
              : props.urlView
                ? onDoubleClickView
                : undefined
          }
          rowHeight={props.rowHeight}
          height="100%"
          columns={[...props.columns, ...defaultColumns]}
          rows={paginacao?.values ?? []}
          sorting={sorting}
          setSorting={setSorting}
          onContextMenu={props.onContextMenu}
          getBackgroundColor={props.getBackgroundColor}
          nomeDaTabela={props.nomeDaTabela}
          chaveReset={chaveReset}
        />
      </BoxApp>

      <FooterTable
        quantidadePorPagina={quantidadePorPagina}
        setQuantidadePorPagina={setQuantidadePorPagina}
        pagina={pagina}
        setPagina={setPagina}
        quantidadePagina={paginacao?.totalPaginas ?? 0}
        length={paginacao?.values.length ?? 0}
        totalDeRegistros={paginacao?.totalRegistros ?? 0}
      />
    </BoxApp>
  )
}
