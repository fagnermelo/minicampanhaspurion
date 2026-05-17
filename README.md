# Mini Campanhas Purion

Painel diário de marketing para gerir o cronograma editorial da Purion.

## O que está incluído

- `index.html`: página estática do painel, que lê os dados da planilha.
- `data/purion_backlog.xlsx`: planilha editável com o backlog do cronograma.
- Navegação por dia e semana.
- Planeamento semanal que prioriza Hotelaria e Alojamento Local em todas as semanas, com reforços alternados desses clusters quando houver conteúdos suficientes.
- Blocos prontos para artigo, hook, Reel, carrossel, post foto + legenda, GBP, LinkedIn, Stories, CTA, Envato e Lead Magnet.
- Filtros por cluster e pesquisa no backlog completo.
- Exportação do cronograma em CSV com campos de Envato e Lead Magnet.

## Atualizar os dados

Para trocar o cronograma, substitua apenas `data/purion_backlog.xlsx` por uma nova planilha com o mesmo nome e os mesmos cabeçalhos.

Só precisa alterar `index.html` quando quiser mudar o layout ou o funcionamento da página.

## Publicar no GitHub Pages

Depois de fazer merge da branch com esta página:

1. Abra `Settings` no repositório.
2. Entre em `Pages`.
3. Em `Build and deployment`, escolha `Deploy from a branch`.
4. Selecione a branch `main` e a pasta `/root`.
5. Salve.

O GitHub vai publicar o `index.html` como página inicial do projeto.
