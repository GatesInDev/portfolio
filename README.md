# Portfólio — Vitor Altmann

Site estático em HTML, CSS e JavaScript, sem dependências ou etapa de build.

## Publicar um artigo

1. Adicione seu PDF diretamente à pasta `pdfs/`.
2. Use um nome descritivo, por exemplo `gerenciamento-de-memoria.pdf`.
3. Faça commit e push para `master`. O artigo aparece automaticamente na seção **Artigos** depois que o deploy do portfólio disponibilizar o arquivo.

Não é necessário editar HTML ou manter uma lista manual. O título é derivado do nome do arquivo. Os artigos com metadados completos em `js/posts.js` preservam título, data e resumo. Novos PDFs não recebem datas ou informações acadêmicas inventadas.

A descoberta consulta a API pública do GitHub, sem token, quando o site abre. Ela lista os PDFs diretamente dentro de `pdfs/` na branch `master`; subpastas não são incluídas. Se a API estiver indisponível ou atingir o limite de requisições, o artigo já incluído no catálogo local continua acessível e um aviso oferece acesso à pasta no GitHub. Uma nova visita ou recarga atualiza o catálogo.

## Desenvolvimento

Execute `python3 -m http.server 8000` na raiz do repositório e abra `http://localhost:8000`. A hospedagem deve servir a raiz como arquivos estáticos; mantenha a integração de deploy atual.

Rotas: `#home`, `#projects`, `#articles`, `#article/<id>` e `#contact`. Links antigos `#blog` e `#post/<id>` continuam aceitos.
