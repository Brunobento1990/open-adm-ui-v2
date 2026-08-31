export enum ApiRoutePath {
  Banner = '/banners',
  LojaParceira = '/lojas-parceiras',
  Categoria = '/categorias',
  Chat = '/chat',
  Cliente = '/cliente',
  Comanda = '/comanda',
  Dashboard = '/home/adm',
  Contato = '/contato',
  ConexaoWhatsApp = '/conexao-whatsapp',
  AtendimentoNumero = '/telefone-atendimento',
  Login = '/login/funcionario',
  Menu = '/menu',
  Peso = '/pesos',
  Produto = '/produtos',
  PublicoComanda = '/publico/comandas',
  TabelaDePreco = '/tabela-de-preco',
  Tamanho = '/tamanhos',
  MovimentoProduto = '/movimentacao-de-produto',
  Estoque = '/estoques',
  Empresa = '/empresa',
  Usuario = '/usuario',
  UltimosPedidos = '/ultimos-pedidos',
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
  Item = '/item',
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
  Movimentar = '/movimentar-estoque',
  Obter = '/get-estoque',
}
