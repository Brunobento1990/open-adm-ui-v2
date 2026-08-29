export enum ApiRoutePath {
  Categoria = '/categoria',
  Chat = '/chat',
  Cliente = '/cliente',
  Comanda = '/comanda',
  Dashboard = '/home/adm',
  Contato = '/contato',
  ConexaoWhatsApp = '/conexao-whatsapp',
  AtendimentoNumero = '/telefone-atendimento',
  Login = '/login/funcionario',
  Menu = '/menu',
  Produto = '/produto',
  PublicoComanda = '/publico/comandas',
  TabelaDePreco = '/tabela-de-preco',
  Estoque = '/estoque',
  Empresa = '/empresa',
  MovimentacaoEstoque = '/estoque-movimentacao',
  Usuario = '/usuario',
  UltimosPedidos = '/ultimos-pedidos',
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
  Paginacao = '/paginacao',
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
  Movimentacao = '/movimentar',
  MovimentacaoManual = '/movimentar-manualmente',
  Paginacao = '/paginacao',
}
