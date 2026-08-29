export enum PublicRoutePath {
  Root = '/',
  Login = '/login',
  CadastrarSenha = '/cadastrar-senha/:codigo',
  ComandaPublica = '/comanda/publica/:idPublico',
}

export function getComandaPublicaPath(idPublico: string) {
  return PublicRoutePath.ComandaPublica.replace(
    ':idPublico',
    encodeURIComponent(idPublico),
  )
}

export enum PrivateRoutePath {
  Empresa = '/cadastros/empresa',
  Usuario = '/cadastros/usuarios',
  UsuarioAdicionar = '/cadastros/usuarios/adicionar',
  UsuarioEditar = '/cadastros/usuarios/editar',
  UsuarioEditarId = '/cadastros/usuarios/editar/:id',
  UsuarioVisualizar = '/cadastros/usuarios/visualizar',
  UsuarioVisualizarId = '/cadastros/usuarios/visualizar/:id',
  MinhaConta = '/minha-conta',
  Comanda = '/vendas/comanda',
  ComandaAdicionar = '/vendas/comanda/adicionar',
  ComandaEditar = '/vendas/comanda/editar',
  ComandaEditarId = '/vendas/comanda/editar/:id',
  ComandaVisualizar = '/vendas/comanda/visualizar',
  ComandaVisualizarId = '/vendas/comanda/visualizar/:id',
  AtendimentoChat = '/atendimento/chat',
  AtendimentoNumero = '/atendimento/numero',
  Categoria = '/cadastros/categorias',
  CategoriaAdicionar = '/cadastros/categorias/adicionar',
  CategoriaEditar = '/cadastros/categorias/editar',
  CategoriaEditarId = '/cadastros/categorias/editar/:id',
  CategoriaVisualizar = '/cadastros/categorias/visualizar',
  CategoriaVisualizarId = '/cadastros/categorias/visualizar/:id',
  Cliente = '/cadastros/clientes',
  ClienteAdicionar = '/cadastros/clientes/adicionar',
  ClienteEditar = '/cadastros/clientes/editar',
  ClienteEditarId = '/cadastros/clientes/editar/:id',
  ClienteVisualizar = '/cadastros/clientes/visualizar',
  ClienteVisualizarId = '/cadastros/clientes/visualizar/:id',
  ClienteUltimosPedidosCpf = '/vendas/cliente/ultimos-pedido-cpf',
  ClienteUltimosPedidosCnpj = '/vendas/cliente/ultimos-pedido-cnpj',
  Produto = '/cadastros/produtos',
  ProdutoAdicionar = '/cadastros/produtos/adicionar',
  ProdutoEditar = '/cadastros/produtos/editar',
  ProdutoEditarId = '/cadastros/produtos/editar/:id',
  ProdutoVisualizar = '/cadastros/produtos/visualizar',
  ProdutoVisualizarId = '/cadastros/produtos/visualizar/:id',
  TabelaDePreco = '/vendas/tabela-de-preco',
  TabelaDePrecoAdicionar = '/vendas/tabela-de-preco/adicionar',
  TabelaDePrecoEditar = '/vendas/tabela-de-preco/editar',
  TabelaDePrecoEditarId = '/vendas/tabela-de-preco/editar/:id',
  TabelaDePrecoVisualizar = '/vendas/tabela-de-preco/visualizar',
  TabelaDePrecoVisualizarId = '/vendas/tabela-de-preco/visualizar/:id',
  Estoque = '/estoques/posicao-de-estoque',
  EstoqueMovimentacao = '/estoque/movimentacao',
  EstoqueMovimentacaoId = '/estoque/movimentacao/:id',
  EstoqueMovimentacoes = '/estoques/movimentacao-de-estoque',
  Dashboard = '/dashboard',
}

export enum AppRoutePath {
  Wildcard = '*',
}
