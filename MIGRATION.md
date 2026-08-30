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
- [x] Migrar CRUD de banner.
- [x] Migrar CRUD de lojas parceiras.
- [x] Migrar CRUD de categoria.
- [x] Migrar CRUD de peso.
- [x] Migrar CRUD de tamanho.
- [x] Migrar de movimento de produto.
