# Migração

## Contexto

- **Projeto legado:** `/home/bruno/Projects/Front/OpenAdm.Ui`
- **Swagger da API:** `http://localhost:5133/swagger/index.html`
- **Origem:** Next.js
- **Destino:** Vite + React + TypeScript (este projeto)
- **Objetivo:** trazer para este projeto as funcionalidades existentes no projeto legado, adaptando-as à arquitetura e às convenções do projeto Vite.
- **Referências de contrato:** validar cada funcionalidade no projeto legado e no Swagger; em caso de divergência ou dúvida sobre o comportamento esperado, confirmar antes de implementar.

## Próximos passos

- [ ] Adicionar o redirecionamento do card **Cobranças mais antigas** da Home para `/financeiro/fatura/negociar-cobranca/:faturaId`, usando o identificador da fatura selecionada.
- [x] Validar manualmente a migração de **Vendas/Clientes**: paginação, pesquisa, cadastro, consulta de CNPJ e CEP, visualização, ativar/bloquear acesso e atualização de senha. Implementada, validada estaticamente com lint e build e confirmada manualmente pelo usuário.
- [ ] Aplicar máscaras e restrição de entrada nos campos CPF, CNPJ e telefone de **Vendas/Clientes**, preservando o comportamento do legado.
- [x] Migrar a tela de negociação de cobrança em `/financeiro/fatura/negociar-cobranca/:pedidoId`, acessada pela ação **Parcelar** da modificação de status do pedido.
- [x] Migrar CRUD de banner.
- [x] Migrar CRUD de lojas parceiras.
- [x] Migrar CRUD de categoria.
- [x] Migrar CRUD de peso.
- [x] Migrar CRUD de tamanho.
- [x] Migrar de movimento de produto.
- [x] Migrar posição de estoque.
- [x] Migrar CRUD de produto.
- [x] Migrar paginação de bonificados.
- [x] Migrar paginação e visualização de mensalidades.
- [x] Migrar extrato de transações financeiras.
- [x] Migrar paginação de contas a receber.
- [x] Migrar configuração de Minha empresa.
- [x] Migrar Configuração/Pedidos.
- [ ] Migrar paginação de Vendas/Pedidos.
