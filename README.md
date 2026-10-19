# Lógica sem mistério

Um livro digital visual e interativo para aprender lógica de programação do zero e praticar os conceitos em C#.

## Site de estudos

O material está na pasta [`livro`](./livro):

- `index.html` — conteúdo das aulas e exercícios;
- `style.css` — estilos e layout responsivo;
- `script.js` — interações, atividades e progresso salvo no navegador;
- `fonts/` — fontes DM Sans e Manrope (WOFF2, licença OFL) hospedadas localmente;
- `imagens/` — fotos em WebP e `favicon.svg`.

Para estudar, abra `livro/index.html` em um navegador. Não é necessário instalar dependências, iniciar um servidor nem ter conexão com a internet.

O livro está organizado em 17 capítulos, distribuídos em sete partes: fundamentos, instruções e operações, decisões, repetições, coleções, organização e aplicação em C#. Depois do exemplo resolvido, cada capítulo apresenta uma ilustração própria relacionada ao conteúdo; algumas lições também usam fotos para aproximar as ideias do cotidiano. Os diagramas de conceito podem animar o percurso passo a passo, respeitando a preferência por movimento reduzido. O desafio é interativo: no primeiro capítulo, a pessoa escreve a própria resposta; nos demais, escolhe uma alternativa. Todos os desafios oferecem correção explicada e outra ilustração. Há também exercícios interativos, exemplos em C# com opção de cópia e acompanhamento do progresso.

O progresso e o último capítulo visitado ficam salvos no armazenamento local do navegador. Eles não são sincronizados entre dispositivos e podem ser removidos ao limpar os dados do navegador. O botão "Zerar progresso" apaga o que foi marcado. A revisão final tem seis perguntas e mostra os acertos na primeira tentativa. No celular, o índice de capítulos fica recolhido, e a página tem estilos próprios para impressão.

## Projeto de exercícios em C#

Na raiz está o projeto de console `algoritmos.csproj`, que pode ser executado com:

```bash
dotnet run
```

O programa mostra um menu para escolher entre os exercícios (`ClassificarTriangulo`, `ParImparPositivoNegativo`, `CalcularIMC` e `VolumeCaixaDagua`).

## Referência didática

O conteúdo é original e foi organizado como apoio didático inspirado nos temas introdutórios de *Lógica de programação*, de Gley Fabiano Cardoso Xavier (Editora Senac São Paulo).