# USE ANNY STORE (layout autoral)

Storefront de chocolates com identidade propria, fluxo completo de carrinho -> checkout -> historico, responsivo e com tema claro/escuro.

> Importante: projeto autoral, sem copia literal de marca, assets, textos ou codigo de terceiros.

## Requisitos

- Java 17+
- Maven 3.9+

## Rodar localmente (PowerShell)

```powershell
mvn clean compile
java -cp target/classes org.example.Main
```

Abra no navegador:

- `http://localhost:8080`

## Estrutura principal

- `src/main/java/org/example/Main.java`: servidor HTTP simples em Java
- `src/main/resources/static/index.html`: home com vitrine, filtros e newsletter
- `src/main/resources/static/busca.html`: busca global com URL compartilhavel
- `src/main/resources/static/product.html`: detalhe do produto + recomendacoes
- `src/main/resources/static/checkout.html`: checkout mock com validacoes e frete
- `src/main/resources/static/meus-pedidos.html`: historico com filtro e recompra
- `src/main/resources/static/404.html`: pagina customizada de erro
- `src/main/resources/static/img/*.svg`: imagens locais de produtos e banner
- `src/main/resources/static/css/styles.css`: design system e responsividade
- `src/main/resources/static/js/app.js`: estado da loja, carrinho e fluxo de pedidos

## Recursos implementados

- Busca por texto no catalogo
- Filtro por categoria e ordenacao por preco/nome
- Paginacao com botao "Carregar mais"
- Pagina de produto via `product.html?id=...`
- Bloco "Voce tambem pode gostar" na pagina de produto
- Thumbnails locais de produtos na vitrine e no detalhe
- Busca global em `busca.html` com sincronizacao por query string (`q`, `cat`, `sort`)
- Carrinho com persistencia (`localStorage`) e controle de quantidade
- Regra de frete: gratis acima de R$ 35 + adicional para entrega expressa
- Checkout mock com validacao de nome, email, telefone, CEP e endereco
- Historico de pedidos com filtro de status e botao "Comprar novamente"
- Timeline de pedido com etapas "Em preparo", "Enviado" e "Entregue"
- Tema claro/escuro persistente
- Newsletter mock com validacao de email
- Melhorias de acessibilidade (skip link, ARIA, foco visivel, ESC)
- Modo smoke test no browser usando `?smoke=1`

## Checklist rapido de verificacao

- Home abre sem erro em `http://localhost:8080`
- Menu mobile abre e fecha corretamente
- Filtros atualizam os cards em `#destaques`
- Carrinho mostra subtotal, frete e total
- `product.html?id=...` renderiza detalhe e recomendacoes
- `busca.html` aceita link compartilhavel (ex.: `busca.html?q=trufa&cat=trufas`)
- Checkout recalcula total ao trocar entrega normal/expressa
- Pedido confirmado aparece em `meus-pedidos.html`
- Rotas inexistentes retornam `404.html` com status HTTP 404
- "Comprar novamente" adiciona itens no carrinho
- Tema persiste ao trocar de pagina

## Smoke test rapido

Abra:

- `http://localhost:8080/index.html?smoke=1`

Resultado exibido em toast e no console (`console.table`).

