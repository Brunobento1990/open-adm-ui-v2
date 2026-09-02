import type { ReactNode } from 'react'
import { AtendimentoChatPage } from '../pages/private/atendimento/AtendimentoChatPage'
import { AtendimentoNumeroPage } from '../pages/private/AtendimentoNumeroPage'
import { BannerFormPage } from '../pages/private/banner/BannerFormPage'
import { BannerPage } from '../pages/private/banner/BannerPage'
import { CategoriaFormPage } from '../pages/private/categoria/CategoriaFormPage'
import { CategoriaPage } from '../pages/private/categoria/CategoriaPage'
import { ClienteFormPage } from '../pages/private/cliente/ClienteFormPage'
import { ClientePage } from '../pages/private/cliente/ClientePage'
import { ClienteUltimosPedidosPage } from '../pages/private/cliente/ClienteUltimosPedidosPage'
import { ComandaFormPage } from '../pages/private/comanda/ComandaFormPage'
import { ComandaPage } from '../pages/private/comanda/ComandaPage'
import { ConfiguracaoPedidoPage } from '../pages/private/configuracaoPedido/ConfiguracaoPedidoPage'
import { EstoqueMovimentacaoPage } from '../pages/private/estoque/EstoqueMovimentacaoPage'
import { EstoquePage } from '../pages/private/estoque/EstoquePage'
import { EmpresaPage } from '../pages/private/empresa/EmpresaPage'
import { BonificadosPage } from '../pages/private/financeiro/BonificadosPage'
import { FaturaPage } from '../pages/private/financeiro/FaturaPage'
import { MensalidadePage } from '../pages/private/financeiro/MensalidadePage'
import { PagarParcelaPage } from '../pages/private/financeiro/PagarParcelaPage'
import { FaturaFormPage } from '../pages/private/financeiro/FaturaFormPage'
import { MensalidadeVisualizarPage } from '../pages/private/financeiro/MensalidadeVisualizarPage'
import { TransacaoFinanceiraPage } from '../pages/private/financeiro/TransacaoFinanceiraPage'
import { HomePage } from '../pages/private/HomePage'
import { LojaParceiraFormPage } from '../pages/private/lojaParceira/LojaParceiraFormPage'
import { LojaParceiraPage } from '../pages/private/lojaParceira/LojaParceiraPage'
import { MinhaContaPage } from '../pages/private/MinhaContaPage'
import { MinhaEmpresaPage } from '../pages/private/minhaEmpresa/MinhaEmpresaPage'
import { MovimentoProdutoFormPage } from '../pages/private/movimentoProduto/MovimentoProdutoFormPage'
import { MovimentoProdutoPage } from '../pages/private/movimentoProduto/MovimentoProdutoPage'
import { PedidoPage } from '../pages/private/pedido/PedidoPage'
import { PedidoVisualizarPage } from '../pages/private/pedido/PedidoVisualizarPage'
import { PedidoModificarStatusPage } from '../pages/private/pedido/PedidoModificarStatusPage'
import { PesoFormPage } from '../pages/private/peso/PesoFormPage'
import { PesoPage } from '../pages/private/peso/PesoPage'
import { ProdutoFormPage } from '../pages/private/produto/ProdutoFormPage'
import { ProdutoPage } from '../pages/private/produto/ProdutoPage'
import { TabelaDePrecoFormPage } from '../pages/private/tabelaDePreco/TabelaDePrecoFormPage'
import { TabelaDePrecoPage } from '../pages/private/tabelaDePreco/TabelaDePrecoPage'
import { TamanhoFormPage } from '../pages/private/tamanho/TamanhoFormPage'
import { TamanhoPage } from '../pages/private/tamanho/TamanhoPage'
import { UsuarioFormPage } from '../pages/private/usuario/UsuarioFormPage'
import { UsuarioPage } from '../pages/private/usuario/UsuarioPage'
import { FormAction } from '../types/Form'
import { TipoFatura } from '../types/FaturaTypes'
import { PrivateRoutePath } from './appRoutes'

export type PrivateRouteConfig = {
  title: string
  path: string
  component: ReactNode
}

export const privateRoutes: PrivateRouteConfig[] = [
  {
    title: 'Pedidos',
    path: PrivateRoutePath.Pedido,
    component: <PedidoPage />,
  },
  {
    title: 'Visualizar pedido',
    path: PrivateRoutePath.PedidoVisualizarId,
    component: <PedidoVisualizarPage />,
  },
  {
    title: 'Status do pedido',
    path: PrivateRoutePath.PedidoModificarStatusId,
    component: <PedidoModificarStatusPage />,
  },
  {
    title: 'Contas a receber',
    path: PrivateRoutePath.ContaAReceber,
    component: <FaturaPage tipo={TipoFatura.AReceber} urlAdd={PrivateRoutePath.ContaAReceberAdicionar} />,
  },
  {
    title: 'Nova conta a receber',
    path: PrivateRoutePath.ContaAReceberAdicionar,
    component: <FaturaFormPage tipo={TipoFatura.AReceber} urlVoltar={PrivateRoutePath.ContaAReceber} />,
  },
  {
    title: 'Baixar parcela',
    path: PrivateRoutePath.PagarParcelaId,
    component: <PagarParcelaPage />,
  },
  {
    title: 'Bonificados',
    path: PrivateRoutePath.Bonificados,
    component: <BonificadosPage />,
  },
  {
    title: 'Mensalidades',
    path: PrivateRoutePath.Mensalidade,
    component: <MensalidadePage />,
  },
  {
    title: 'Visualizar mensalidade',
    path: PrivateRoutePath.MensalidadeVisualizarId,
    component: <MensalidadeVisualizarPage />,
  },
  {
    title: 'Extrato por período',
    path: PrivateRoutePath.TransacaoFinanceira,
    component: <TransacaoFinanceiraPage />,
  },
  {
    title: 'Movimentos de produto',
    path: PrivateRoutePath.MovimentoProduto,
    component: <MovimentoProdutoPage />,
  },
  {
    title: 'Movimentar produto',
    path: PrivateRoutePath.MovimentoProdutoAdicionar,
    component: <MovimentoProdutoFormPage />,
  },
  {
    title: 'Tamanhos',
    path: PrivateRoutePath.Tamanho,
    component: <TamanhoPage />,
  },
  {
    title: 'Tamanho',
    path: PrivateRoutePath.TamanhoAdicionar,
    component: <TamanhoFormPage action={FormAction.Create} />,
  },
  {
    title: 'Tamanho',
    path: PrivateRoutePath.TamanhoEditarId,
    component: <TamanhoFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar tamanho',
    path: PrivateRoutePath.TamanhoVisualizarId,
    component: <TamanhoFormPage action={FormAction.View} />,
  },
  {
    title: 'Pesos',
    path: PrivateRoutePath.Peso,
    component: <PesoPage />,
  },
  {
    title: 'Peso',
    path: PrivateRoutePath.PesoAdicionar,
    component: <PesoFormPage action={FormAction.Create} />,
  },
  {
    title: 'Peso',
    path: PrivateRoutePath.PesoEditarId,
    component: <PesoFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar peso',
    path: PrivateRoutePath.PesoVisualizarId,
    component: <PesoFormPage action={FormAction.View} />,
  },
  {
    title: 'Lojas parceiras',
    path: PrivateRoutePath.LojaParceira,
    component: <LojaParceiraPage />,
  },
  {
    title: 'Loja parceira',
    path: PrivateRoutePath.LojaParceiraAdicionar,
    component: <LojaParceiraFormPage action={FormAction.Create} />,
  },
  {
    title: 'Loja parceira',
    path: PrivateRoutePath.LojaParceiraEditarId,
    component: <LojaParceiraFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar loja parceira',
    path: PrivateRoutePath.LojaParceiraVisualizarId,
    component: <LojaParceiraFormPage action={FormAction.View} />,
  },
  {
    title: 'Banners',
    path: PrivateRoutePath.Banner,
    component: <BannerPage />,
  },
  {
    title: 'Banner',
    path: PrivateRoutePath.BannerAdicionar,
    component: <BannerFormPage action={FormAction.Create} />,
  },
  {
    title: 'Banner',
    path: PrivateRoutePath.BannerEditarId,
    component: <BannerFormPage action={FormAction.Edit} />,
  },
  {
    title: 'Visualizar banner',
    path: PrivateRoutePath.BannerVisualizarId,
    component: <BannerFormPage action={FormAction.View} />,
  },
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
    title: 'Minha empresa',
    path: PrivateRoutePath.MinhaEmpresa,
    component: <MinhaEmpresaPage />,
  },
  {
    title: 'Configuração de pedido',
    path: PrivateRoutePath.ConfiguracaoPedido,
    component: <ConfiguracaoPedidoPage />,
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
    title: 'Posição de estoque',
    path: PrivateRoutePath.Estoque,
    component: <EstoquePage />,
  },
  {
    title: 'Atualizar estoque',
    path: PrivateRoutePath.EstoqueMovimentacaoId,
    component: <EstoqueMovimentacaoPage />,
  },
]
