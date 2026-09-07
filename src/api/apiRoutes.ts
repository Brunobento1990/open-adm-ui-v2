export enum ApiRoutePath {
  Banner = '/banners',
  LojaParceira = '/lojas-parceiras',
  LinkBio = '/link-bio',
  Categoria = '/categorias',
  Chat = '/chat',
  Cliente = '/cliente',
  Comanda = '/comanda',
  Dashboard = '/home/adm',
  Contato = '/contato',
  ConexaoWhatsApp = '/conexao-whatsapp',
  ConfiguracaoPedido = '/configuracoes-de-pedido',
  ConfiguracaoMercadoPago = '/configuracao-de-pagamento',
  AtendimentoNumero = '/telefone-atendimento',
  Login = '/login/funcionario',
  Menu = '/menu',
  Peso = '/pesos',
  Pedido = '/pedidos',
  PedidoAdm = '/pedidos-adm',
  PedidoCobranca = '/pedido',
  Produto = '/produtos',
  RelatorioVendaProduto = '/relatorio-venda-produto',
  PublicoComanda = '/publico/comandas',
  TabelaDePreco = '/tabelas-de-precos',
  Tamanho = '/tamanhos',
  TransacaoFinanceira = '/transacao-financeira',
  MovimentoProduto = '/movimentacao-de-produto',
  Estoque = '/estoques',
  ItemTabelaDePreco = '/item-tabela-de-preco',
  Fatura = '/fatura',
  Bonificado = 'fatura/bonificado',
  Mensalidade = '/parcela-cobranca',
  Parcela = '/parcela',
  Parceiro = '/parceiro',
  Cep = '/cep',
  Empresa = '/empresa',
  Usuario = '/usuario',
  ClienteVenda = '/usuarios',
  Cnpj = '/cnpj',
  UltimosPedidos = '/ultimos-pedidos',
}

export enum LinkBioApiRoutePath {
  Configuracao = '/configuracao',
  CriarOuAtualizarConfiguracao = '/configuracao/create-or-update',
  Eventos = '/eventos',
  Links = '/links',
  Ordem = '/links/ordem',
}

export enum BannerApiRoutePath {
  Criar = '/create',
  Obter = '/get-banner',
  Atualizar = '/update',
}

export enum LojaParceiraApiRoutePath {
  Atualizar = '/update',
  Criar = '/create',
  Excluir = '/delete',
  Obter = '/get-loja',
}

export enum PesoApiRoutePath {
  Atualizar = '/update',
  Criar = '/create',
  Obter = '/get-peso',
}

export enum TamanhoApiRoutePath {
  Atualizar = '/update',
  Criar = '/create',
  Obter = '/get-tamanho',
}

export enum UsuarioApiRoutePath {
  Logout = '/logout',
  MinhaConta = '/minha-conta',
  Sessoes = '/sessoes',
  TrocarSenha = '/trocar-senha',
}

export enum ClienteVendaApiRoutePath {
  AtivarInativar = '/ativar-inativar',
  AtualizarSenha = '/atualizar-senha-adm',
  Criar = '/create-admin',
  Obter = '/get-conta-adm',
}

export enum CnpjApiRoutePath {
  Consultar = '/consulta',
}

export enum LoginApiRoutePath {
  EsqueciSenha = '/esqueceu-senha',
  CadastrarSenha = '/cadastrar-senha',
}

export enum CategoriaApiRoutePath {
  Atualizar = '/update',
  Criar = '/create',
  Excluir = '/delete',
  Obter = '/get-categoria',
  Paginacao = '/paginacao',
}

export enum ProdutoApiRoutePath {
  Atualizar = '/update',
  Criar = '/create',
  Excluir = '/delete',
  InativarAtivar = '/inativar-ativar',
  Obter = '/get-produto',
}

export enum TabelaDePrecoLegacyApiRoutePath {
  ObterAtivaPorProduto = '/get-tabela-by-produtoId',
}

export enum TabelaDePrecoApiRoutePath {
  Atualizar = '/update',
  Criar = '/create',
  Obter = '/get-tabela',
  ObterAtiva = '/get-tabela-ativa',
  Item = '/item',
}

export enum ItemTabelaDePrecoApiRoutePath {
  Atualizar = '/update',
  AtualizarPorPeso = '/atualizar-por-peso',
  AtualizarPorTamanho = '/atualizar-por-tamanho',
  Criar = '/create',
  Excluir = '/delete',
}

export enum ComandaApiRoutePath {
  Compartilhamento = '/compartilhamento',
  Historicos = '/historicos',
  Item = '/item',
  Itens = '/itens',
}

export enum ApiResourceRoutePath {
  AlterarStatus = '/ativar',
  Dropdown = '/dropdown',
  Paginacao = '/paginacao',
}

export enum EstoquesApiRoutePath {
  Atualizar = '/update',
  AtualizarTodos = '/update-estoques',
  Movimentar = '/movimentar-estoque',
  Obter = '/get-estoque',
  ObterTodosDoProduto = '/posicao-estoque-produto',
}

export enum TransacaoFinanceiraApiRoutePath {
  Periodo = '/periodo',
}

export enum ParcelaApiRoutePath {
  Estornar = '/estornar',
  Obter = '/get-by-id',
  Pagar = '/pagar',
}

export enum FaturaApiRoutePath {
  BaixaAutomatica = '/baixa-automatica',
  Bonificar = '/bonificar',
  Criar = '/criar',
  Negociar = '/negociar',
}

export enum ParceiroApiRoutePath {
  Editar = '/editar',
  Obter = '/obter',
  RedeSocial = '/rede-social',
  Telefone = '/telefone',
}

export enum CepApiRoutePath {
  Consultar = '/consultar',
}

export enum ConfiguracaoPedidoApiRoutePath {
  Atualizar = '/update',
  Obter = '/get-configuracoes',
}

export enum ConfiguracaoMercadoPagoApiRoutePath {
  Atualizar = '/create-or-update',
  Obter = '/get',
}

export enum PedidoApiRoutePath {
  Criar = '/create',
  Download = '/download-pedido',
  Excluir = '/delete',
  Obter = '/get',
  RelatorioPorPeriodo = '/relatorio-por-periodo',
  RelatorioPorPeriodoImprimir = '/relatorio-por-periodo/imprimir',
  AtualizarStatus = '/update-status',
}

export enum PedidoCobrancaApiRoutePath {
  Cobranca = '/cobranca',
}

export enum RelatorioVendaProdutoApiRoutePath {
  Imprimir = '/imprimir',
}
