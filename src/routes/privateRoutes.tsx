import type { ReactNode } from 'react'
import { AtendimentoChatPage } from '../pages/private/atendimento/AtendimentoChatPage'
import { AtendimentoNumeroPage } from '../pages/private/AtendimentoNumeroPage'
import { CategoriaFormPage } from '../pages/private/categoria/CategoriaFormPage'
import { CategoriaPage } from '../pages/private/categoria/CategoriaPage'
import { ClienteFormPage } from '../pages/private/cliente/ClienteFormPage'
import { ClientePage } from '../pages/private/cliente/ClientePage'
import { ClienteUltimosPedidosPage } from '../pages/private/cliente/ClienteUltimosPedidosPage'
import { ComandaFormPage } from '../pages/private/comanda/ComandaFormPage'
import { ComandaPage } from '../pages/private/comanda/ComandaPage'
import { EstoqueMovimentacaoPage } from '../pages/private/estoque/EstoqueMovimentacaoPage'
import { EstoqueMovimentacaoManualPage } from '../pages/private/estoque/EstoqueMovimentacaoManualPage'
import { EstoqueMovimentacoesPage } from '../pages/private/estoque/EstoqueMovimentacoesPage'
import { EstoquePage } from '../pages/private/estoque/EstoquePage'
import { EmpresaPage } from '../pages/private/empresa/EmpresaPage'
import { HomePage } from '../pages/private/HomePage'
import { MinhaContaPage } from '../pages/private/MinhaContaPage'
import { ProdutoFormPage } from '../pages/private/produto/ProdutoFormPage'
import { ProdutoPage } from '../pages/private/produto/ProdutoPage'
import { TabelaDePrecoFormPage } from '../pages/private/tabelaDePreco/TabelaDePrecoFormPage'
import { TabelaDePrecoPage } from '../pages/private/tabelaDePreco/TabelaDePrecoPage'
import { UsuarioFormPage } from '../pages/private/usuario/UsuarioFormPage'
import { UsuarioPage } from '../pages/private/usuario/UsuarioPage'
import { FormAction } from '../types/Form'
import { PrivateRoutePath } from './appRoutes'

export type PrivateRouteConfig = {
  title: string
  path: string
  component: ReactNode
}

export const privateRoutes: PrivateRouteConfig[] = [
  {
    title: 'Home',
    path: PrivateRoutePath.Dashboard,
    component: <HomePage />,
  },
  {
    title: 'Minha conta',
    path: PrivateRoutePath.MinhaConta,
    component: <MinhaContaPage />,
  },
  {
    title: 'Empresa',
    path: PrivateRoutePath.Empresa,
    component: <EmpresaPage />,
  },
  {
    title: 'Usuários',
    path: PrivateRoutePath.Usuario,
    component: <UsuarioPage />,
  },
  {
    title: 'Usuário',
    path: PrivateRoutePath.UsuarioAdicionar,
    component: <UsuarioFormPage action={FormAction.Create} />,
  },
  {
    title: 'Usuário',
    path: PrivateRoutePath.UsuarioEditarId,
    component: <UsuarioFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar usuário',
    path: PrivateRoutePath.UsuarioVisualizarId,
    component: <UsuarioFormPage action={FormAction.View} />,
  },
  {
    title: 'Número de atendimento',
    path: PrivateRoutePath.AtendimentoNumero,
    component: <AtendimentoNumeroPage />,
  },
  {
    title: 'Categorias',
    path: PrivateRoutePath.Categoria,
    component: <CategoriaPage />,
  },
  {
    title: 'Categoria',
    path: PrivateRoutePath.CategoriaAdicionar,
    component: <CategoriaFormPage action={FormAction.Create} />,
  },
  {
    title: 'Categoria',
    path: PrivateRoutePath.CategoriaEditarId,
    component: <CategoriaFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar categoria',
    path: PrivateRoutePath.CategoriaVisualizarId,
    component: <CategoriaFormPage action={FormAction.View} />,
  },
  {
    title: 'Clientes',
    path: PrivateRoutePath.Cliente,
    component: <ClientePage />,
  },
  {
    title: 'Últimos pedidos de clientes CPF',
    path: PrivateRoutePath.ClienteUltimosPedidosCpf,
    component: <ClienteUltimosPedidosPage isJuridico={false} />,
  },
  {
    title: 'Últimos pedidos de clientes CNPJ',
    path: PrivateRoutePath.ClienteUltimosPedidosCnpj,
    component: <ClienteUltimosPedidosPage isJuridico />,
  },
  {
    title: 'Comandas',
    path: PrivateRoutePath.Comanda,
    component: <ComandaPage />,
  },
  {
    title: 'Comanda',
    path: PrivateRoutePath.ComandaAdicionar,
    component: <ComandaFormPage action={FormAction.Create} />,
  },
  {
    title: 'Comanda',
    path: PrivateRoutePath.ComandaEditarId,
    component: <ComandaFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar comanda',
    path: PrivateRoutePath.ComandaVisualizarId,
    component: <ComandaFormPage action={FormAction.View} />,
  },
  {
    title: 'Cliente',
    path: PrivateRoutePath.ClienteAdicionar,
    component: <ClienteFormPage action={FormAction.Create} />,
  },
  {
    title: 'Cliente',
    path: PrivateRoutePath.ClienteEditarId,
    component: <ClienteFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar cliente',
    path: PrivateRoutePath.ClienteVisualizarId,
    component: <ClienteFormPage action={FormAction.View} />,
  },
  {
    title: 'Produtos',
    path: PrivateRoutePath.Produto,
    component: <ProdutoPage />,
  },
  {
    title: 'Produto',
    path: PrivateRoutePath.ProdutoAdicionar,
    component: <ProdutoFormPage action={FormAction.Create} />,
  },
  {
    title: 'Produto',
    path: PrivateRoutePath.ProdutoEditarId,
    component: <ProdutoFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar produto',
    path: PrivateRoutePath.ProdutoVisualizarId,
    component: <ProdutoFormPage action={FormAction.View} />,
  },
  {
    title: 'Tabelas de preço',
    path: PrivateRoutePath.TabelaDePreco,
    component: <TabelaDePrecoPage />,
  },
  {
    title: 'Tabela de preço',
    path: PrivateRoutePath.TabelaDePrecoAdicionar,
    component: <TabelaDePrecoFormPage action={FormAction.Create} />,
  },
  {
    title: 'Tabela de preço',
    path: PrivateRoutePath.TabelaDePrecoEditarId,
    component: <TabelaDePrecoFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar tabela de preço',
    path: PrivateRoutePath.TabelaDePrecoVisualizarId,
    component: <TabelaDePrecoFormPage action={FormAction.View} />,
  },
  {
    title: 'Chat',
    path: PrivateRoutePath.AtendimentoChat,
    component: <AtendimentoChatPage />,
  },
  {
    title: 'Estoque',
    path: PrivateRoutePath.Estoque,
    component: <EstoquePage />,
  },
  {
    title: 'Posição de estoque',
    path: PrivateRoutePath.EstoqueMovimentacaoId,
    component: <EstoqueMovimentacaoPage />,
  },
  {
    title: 'Movimentar estoque',
    path: PrivateRoutePath.EstoqueMovimentacao,
    component: <EstoqueMovimentacaoManualPage />,
  },
  {
    title: 'Movimentações de estoque',
    path: PrivateRoutePath.EstoqueMovimentacoes,
    component: <EstoqueMovimentacoesPage />,
  },

]
