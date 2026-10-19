const progressKey = "logica-sem-misterio-progresso";
const lastChapterKey = "logica-sem-misterio-ultimo-capitulo";
const lessonSections = [...document.querySelectorAll(".lesson-section")];
const completeButtons = [...document.querySelectorAll("[data-complete]")];
const sideLinks = [...document.querySelectorAll(".side-link")];
const progressCount = document.querySelector("#progress-count");
const readingProgress = document.querySelector("#reading-progress");
const readingLabel = document.querySelector("#reading-label");
const continueReading = document.querySelector("#continue-reading");
const resetProgressButton = document.querySelector("#reset-progress");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#menu-principal");
let progressCache = [];
let storageAvailable = true;

const workedExamples = [
  { title: "Preparar um copo de suco", context: "Queremos transformar uma fruta e água em um suco pronto.", steps: ["Separar a fruta, a água e o copo.", "Lavar e cortar a fruta.", "Bater a fruta com água.", "Colocar o suco no copo."], flow: ["Fruta + água", "Lavar, cortar e bater", "Suco no copo"] },
  { title: "Converter horas em minutos", context: "Uma viagem dura 2 horas. Cada hora tem 60 minutos.", steps: ["Entrada: 2 horas.", "Regra: multiplicar 2 por 60.", "Cálculo: 2 × 60 = 120.", "Saída: 120 minutos."], code: "int horas = 2;\nint minutos = horas * 60;\nConsole.WriteLine(minutos);", flow: ["2 horas", "2 × 60", "120 minutos"] },
  { title: "Atualizar uma pontuação", context: "Uma jogadora tem 10 pontos e ganha mais 5.", steps: ["Criar a variável pontuacao com valor 10.", "Somar 5 ao valor guardado.", "A variável passa a guardar 15."], code: "int pontuacao = 10;\npontuacao = pontuacao + 5;\nConsole.WriteLine(pontuacao);", flow: ["pontuacao = 10", "+ 5 pontos", "pontuacao = 15"] },
  { title: "Calcular uma compra", context: "Cada caderno custa R$ 12,50 e a compra tem 3 cadernos.", steps: ["Entrada: preço 12,50 e quantidade 3.", "Processamento: multiplicar 12,50 por 3.", "Cálculo: 12,50 × 3 = 37,50.", "Saída: total de R$ 37,50."], code: "decimal preco = 12.50m;\nint quantidade = 3;\ndecimal total = preco * quantidade;\nConsole.WriteLine($\"Total: R$ {total:F2}\");", flow: ["R$ 12,50 × 3", "Multiplicar preço e quantidade", "R$ 37,50"] },
  { title: "Somar dois produtos", context: "Maçãs custam R$ 5,00 e leite custa R$ 6,50.", steps: ["Ler o preço das maçãs: 5,00.", "Ler o preço do leite: 6,50.", "Somar: 5,00 + 6,50 = 11,50.", "Exibir o total: R$ 11,50."], code: "decimal macas = 5.00m;\ndecimal leite = 6.50m;\ndecimal total = macas + leite;\nConsole.WriteLine($\"Total: R$ {total:F2}\");", flow: ["R$ 5,00 + R$ 6,50", "Somar os preços", "R$ 11,50"] },
  { title: "Calcular uma expressão", context: "Vamos resolver 2 + 3 × 4 sem trocar a ordem das operações.", steps: ["A multiplicação vem antes da soma.", "Calcular 3 × 4 = 12.", "Somar 2 + 12.", "Resultado: 14. Com (2 + 3) × 4, o resultado seria 20."], code: "int resultado = 2 + 3 * 4;\nConsole.WriteLine(resultado); // 14", flow: ["2 + 3 × 4", "2 + 12", "14"] },
  { title: "Decidir se paga meia-entrada", context: "A regra dá meia-entrada para quem tem até 12 anos. A pessoa tem 12.", steps: ["Receber a idade: 12.", "Perguntar: 12 é menor ou igual a 12?", "A resposta é verdadeira.", "Escolher o caminho: pagar meia-entrada."], code: "int idade = 12;\nif (idade <= 12)\n    Console.WriteLine(\"Meia-entrada\");\nelse\n    Console.WriteLine(\"Inteira\");", flow: ["Idade: 12", "12 <= 12? Sim", "Meia-entrada"] },
  { title: "Validar e classificar uma nota", context: "A nota é 8,5. Ela precisa estar entre 0 e 10 e a aprovação começa em 7.", steps: ["Verificar se 8,5 é menor que 0 ou maior que 10: não.", "Como a nota é válida, verificar se 8,5 é pelo menos 7: sim.", "Exibir “Aprovado”."], code: "double nota = 8.5;\nif (nota < 0 || nota > 10)\n    Console.WriteLine(\"Nota inválida\");\nelse if (nota >= 7)\n    Console.WriteLine(\"Aprovado\");\nelse\n    Console.WriteLine(\"Precisa recuperar\");", flow: ["Nota: 8,5", "Está entre 0 e 10?", "Válida; resultado: aprovado"] },
  { title: "Encher um copo d'água com while", context: "O copo comporta 300 ml e começa vazio. A cada volta despejamos 100 ml, e só paramos quando ele estiver cheio.", steps: ["Começar com ml = 0.", "Perguntar: 0 < 300? Sim. Despejar 100 ml: ml = 100.", "Perguntar: 100 < 300? Sim. Despejar 100 ml: ml = 200.", "Perguntar: 200 < 300? Sim. Despejar 100 ml: ml = 300.", "Perguntar: 300 < 300? Não. O laço termina e o programa mostra “Copo cheio!”."], code: "int ml = 0;\nwhile (ml < 300)\n{\n    ml += 100;\n    Console.WriteLine($\"Copo com {ml} ml\");\n}\nConsole.WriteLine(\"Copo cheio!\");", flow: ["Copo vazio: ml = 0", "Pergunta → despeja 100 ml (3 vezes)", "ml = 300: cheio, fim"] },
  { title: "Somar de 1 até 4 com for", context: "Um contador visita os números; um acumulador guarda a soma parcial.", steps: ["Começar com soma = 0.", "Somar 1: soma = 1.", "Somar 2 e depois 3: soma = 6.", "Somar 4: soma = 10; o laço termina."], code: "int soma = 0;\nfor (int numero = 1; numero <= 4; numero++)\n{\n    soma += numero;\n}\nConsole.WriteLine(soma); // 10", flow: ["Contador: 1, 2, 3, 4", "Soma parcial: 1 → 3 → 6 → 10", "Total: 10"] },
  { title: "Percorrer e pesquisar um vetor", context: "No vetor { 8, 7, 9 }, queremos somar os valores e localizar o 9.", steps: ["Índices: 8 está em 0, 7 em 1 e 9 em 2.", "Percorrer o vetor e somar: 8 + 7 + 9 = 24.", "Comparar cada valor com 9.", "Encontrar 9 no índice 2."], code: "int[] notas = { 8, 7, 9 };\nint soma = 0;\nint indiceEncontrado = -1;\nfor (int indice = 0; indice < notas.Length; indice++)\n{\n    soma += notas[indice];\n    if (notas[indice] == 9)\n        indiceEncontrado = indice;\n}\nConsole.WriteLine($\"Soma: {soma}; índice do 9: {indiceEncontrado}\");", flow: ["[8] [7] [9]", "Índices 0 → 1 → 2", "Soma 24; 9 no índice 2"] },
  { title: "Encontrar um valor na matriz", context: "Na matriz {{ 1, 2, 3 }, { 4, 5, 6 }}, vamos ler lugares[0, 2].", steps: ["O primeiro índice indica a linha: linha 0.", "O segundo índice indica a coluna: coluna 2.", "Na linha 0, os valores são 1, 2, 3.", "Na coluna 2 está o valor 3."], code: "int[,] lugares = { { 1, 2, 3 }, { 4, 5, 6 } };\nint valor = lugares[0, 2];\nConsole.WriteLine(valor); // 3", flow: ["Linha 0", "Coluna 2", "Valor: 3"] },
  { title: "Calcular uma média com função", context: "Uma função recebe as notas 8 e 10 e devolve a média.", steps: ["Enviar 8 e 10 como argumentos.", "A função recebe esses valores nos parâmetros nota1 e nota2.", "Calcular (8 + 10) / 2 = 9.", "return devolve 9 para quem chamou a função."], code: "static double CalcularMedia(double nota1, double nota2)\n{\n    return (nota1 + nota2) / 2;\n}\n\nConsole.WriteLine(CalcularMedia(8, 10)); // 9", flow: ["Argumentos: 8 e 10", "Calcular a média", "Retorno: 9"] },
  { title: "Dividir o orçamento em tarefas", context: "Para descobrir o saldo do mês, vamos separar o problema em responsabilidades.", steps: ["Somar as receitas em uma tarefa.", "Somar as despesas em outra tarefa.", "Calcular saldo = receitas − despesas.", "Mostrar um resumo com os totais e o saldo."], code: "totalReceitas = somar(receitas)\ntotalDespesas = somar(despesas)\nsaldo = totalReceitas - totalDespesas\nmostrarResumo(totalReceitas, totalDespesas, saldo)", flow: ["Somar receitas", "Somar despesas", "Calcular e mostrar saldo"] },
  { title: "Testar uma função de média", context: "Antes de confiar na média de duas notas entre 0 e 10, escolhemos casos que desafiam a regra.", steps: ["Caso comum: notas 8 e 6 devem produzir 7.", "Limites: notas 0 e 10 devem produzir 5.", "Inválido: nota -1 deve ser rejeitada ou sinalizada.", "Comparar sempre o resultado real com o esperado."], flow: ["Caso comum: 7", "Limites: 5", "Inválido: rejeitar"] },
  { title: "Transformar uma média em C#", context: "As notas são 8, 7 e 9. O algoritmo soma os valores e divide por 3.", steps: ["Guardar as três notas.", "Somar: 8 + 7 + 9 = 24.", "Dividir por 3: 24 / 3 = 8.", "Usar Console.WriteLine para mostrar o resultado."], code: "double nota1 = 8;\ndouble nota2 = 7;\ndouble nota3 = 9;\ndouble media = (nota1 + nota2 + nota3) / 3;\nConsole.WriteLine($\"Média: {media:F1}\");", flow: ["Notas: 8, 7, 9", "Somar 24 e dividir por 3", "Mostrar média: 8"] },
  { title: "Resumir um orçamento mensal", context: "Receitas: R$ 3.200 e R$ 450. Despesas: R$ 1.200, R$ 680 e R$ 300.", steps: ["Somar receitas: 3.200 + 450 = 3.650.", "Somar despesas: 1.200 + 680 + 300 = 2.180.", "Calcular saldo: 3.650 − 2.180 = 1.470.", "Como o saldo é maior que zero, classificá-lo como positivo."], flow: ["Receitas: R$ 3.650", "− despesas: R$ 2.180", "Saldo positivo: R$ 1.470"] }
];
const chapterIllustrations = [
  ["🎒", "🧭", "✅"],
  ["🕑", "✖️", "⏱️"],
  ["🏆", "➕", "🏆"],
  ["🪙", "✖️", "🛍️"],
  ["🍎", "➕", "🥛"],
  ["🧮", "✖️", "✅"],
  ["🎂", "❓", "🎟️"],
  ["📝", "✅", "🎓"],
  ["🥛", "🔁", "🛑"],
  ["🔢", "➕", "🔟"],
  ["🧺", "🔍", "🎯"],
  ["📋", "↕️", "📍"],
  ["📥", "⚙️", "📤"],
  ["🧩", "🛠️", "📊"],
  ["🧪", "🔎", "✅"],
  ["🧠", "⌨️", "🖥️"],
  ["💵", "➖", "✅"]
];
const chapterPhotos = {
  1: {
    src: "imagens/planejar-no-caderno.webp",
    width: 1000,
    height: 667,
    alt: "Pessoa escrevendo em um caderno aberto antes de começar a programar.",
    caption: "Antes de programar, também podemos rascunhar a ideia no papel."
  },
  3: {
    src: "imagens/memoria-em-gavetas.webp",
    width: 800,
    height: 533,
    alt: "Gavetas de madeira identificadas guardam papéis e materiais de desenho.",
    caption: "Uma gaveta identificada ajuda a encontrar o que foi guardado — como um nome ajuda a localizar um valor."
  }
};
const chapterArtwork = [
  { title: "Preparar um sanduíche passo a passo", hero: "🥪", cards: [["💡", "IDEIA"], ["🧾", "PASSOS"], ["✅", "RESULTADO"]] },
  { title: "Transformar horas em minutos", hero: "⏱️", cards: [["🕑", "2 horas"], ["✖️", "× 60"], ["⏰", "120 min"]] },
  { title: "Organizar valores na memória do programa", hero: "🗄️", cards: [["🧺", "nome: Ana"], ["🎂", "idade: 16"], ["🔒", "const: 60"]] },
  { title: "Uma calculadora transforma preço e quantidade em total", hero: "🧮", cards: [["🏷️", "R$ 12,50"], ["🔢", "3 cadernos"], ["🛍️", "R$ 37,50"]] },
  { title: "Somar produtos para fechar a conta", hero: "🛒", cards: [["🍎", "Maçãs"], ["🥛", "Leite"], ["🧾", "R$ 11,50"]] },
  { title: "A precedência organiza as operações da expressão", hero: "🧮", cards: [["2 + 3 × 4", "EXPRESSÃO"], ["3 × 4", "PRIMEIRO"], ["14", "RESULTADO"]] },
  { title: "A previsão do tempo leva a duas decisões diferentes", hero: "🌦️", cards: [["❓", "Está chovendo?"], ["☂️", "SIM · levar"], ["☀️", "NÃO · sair"]] },
  { title: "Conferir uma nota antes de classificar", hero: "📋", cards: [["8,5", "NOTA"], ["0–10", "FAIXA VÁLIDA"], ["🎓", "APROVADO"]] },
  { title: "Encher o copo enquanto ainda couber água", hero: "🥛", cards: [["❓", "O copo está cheio?"], ["💧", "NÃO · despejar 100 ml"], ["✅", "SIM · parar"]] },
  { title: "Regar as plantas uma de cada vez", hero: "🪴", cards: [["1", "PRIMEIRA"], ["2", "PRÓXIMA"], ["5", "TERMINOU"]] },
  { title: "Procurar uma nota percorrendo o vetor", hero: "🗂️", cards: [["0 · 8", "ÍNDICE 0"], ["2 · 9", "ENCONTRADO"], ["30", "SOMA"]] },
  { title: "Encontrar um assento usando linha e coluna", hero: "🪑", cards: [["↕️", "LINHA 0"], ["↔️", "COLUNA 2"], ["3", "VALOR"]] },
  { title: "Uma função recebe dados e devolve uma resposta", hero: "⚙️", cards: [["8 e 10", "ENTRADAS"], ["ƒ", "CALCULAR"], ["9", "RETORNO"]] },
  { title: "Separar um problema em módulos menores", hero: "🧩", cards: [["＋", "RECEITAS"], ["−", "DESPESAS"], ["＝", "SALDO"]] },
  { title: "Testar casos comuns, limites e entradas inválidas", hero: "🧪", cards: [["8 e 6", "CASO COMUM"], ["0 e 10", "LIMITES"], ["−1", "INVÁLIDO"]] },
  { title: "Levar o algoritmo para o código C#", hero: "💻", cards: [["📝", "ALGORITMO"], ["⌨️", "C#"], ["🖥️", "RESULTADO"]] },
  { title: "Receitas e despesas formam o resumo do mês", hero: "🧾", cards: [["R$ 3.650", "RECEITAS"], ["R$ 2.180", "DESPESAS"], ["R$ 1.470", "SALDO"]] }
];
const chapterVisuals = {
  3: {
    title: "Veja como os dados ficam guardados",
    type: "memory",
    items: [["nome", "\"Ana\"", "string"], ["idade", "16", "int"], ["aprovado", "true", "bool"], ["minutosPorHora", "60", "const"]]
  },
  6: {
    title: "A árvore mostra qual conta acontece primeiro",
    type: "expression",
    items: [["2 + 3 × 4", "expressão"], ["3 × 4 = 12", "primeiro: multiplicação"], ["2 + 12 = 14", "depois: adição"]],
    alternate: "(2 + 3) × 4 = 20"
  },
  7: {
    title: "Fluxograma: a condição escolhe um caminho",
    type: "decision",
    question: "Está chovendo?",
    yes: ["SIM", "Levar guarda-chuva ☂️"],
    no: ["NÃO", "Sair sem guarda-chuva ☀️"]
  },
  8: {
    title: "Fluxograma: primeiro validamos, depois classificamos",
    type: "validation",
    question: "Nota entre 0 e 10?",
    paths: [["NÃO", "Mostrar erro"], ["SIM · nota ≥ 7", "Aprovado"], ["SIM · nota < 7", "Recuperação"]]
  },
  9: {
    title: "Animação do while: o copo enche a cada volta",
    type: "loop",
    question: "ml < 300?",
    items: [["0 ml", "despeja 100"], ["100 ml", "despeja 100"], ["200 ml", "despeja 100"], ["300 ml", "cheio: para"]]
  },
  10: {
    title: "Animação do for: contador e acumulador avançam juntos",
    type: "counter",
    items: [["1", "soma = 1"], ["2", "soma = 3"], ["3", "soma = 6"], ["4", "soma = 10"]]
  },
  11: {
    title: "Percorra o vetor: o 9 está na posição de índice 2",
    type: "vector",
    items: [["0", "8"], ["1", "7"], ["2", "9"], ["3", "6"]]
  },
  12: {
    title: "Leia primeiro a linha, depois a coluna",
    type: "matrix",
    rows: [["1", "2", "3"], ["4", "5", "6"]],
    target: "0,2"
  },
  13: {
    title: "Animação da função: argumentos entram e o retorno sai",
    type: "function",
    items: [["nota1", "8"], ["nota2", "10"]],
    operation: "(8 + 10) / 2",
    result: "9"
  },
  14: {
    title: "Fluxo dos módulos: cada tarefa tem uma responsabilidade",
    type: "modules",
    items: [["①", "Somar receitas"], ["②", "Somar despesas"], ["③", "Calcular saldo"]],
    result: "Mostrar resumo"
  },
  15: {
    title: "Três testes revelam problemas diferentes",
    type: "tests",
    items: [["8 e 6", "Esperado: 7", "Caso comum", "ok"], ["0 e 10", "Esperado: 5", "Limites", "ok"], ["-1 e 7", "Esperado: inválido", "Entrada incorreta", "warn"]]
  },
  16: {
    title: "O raciocínio é o mesmo; muda a forma de escrever",
    type: "translation",
    items: [["ler três notas", "double nota1, nota2, nota3"], ["somar e dividir por 3", "(nota1 + nota2 + nota3) / 3"], ["mostrar a média", "Console.WriteLine(media)"]]
  },
  17: {
    title: "Animação do orçamento: receitas menos despesas",
    type: "budget",
    income: [["Receitas", "R$ 3.650", 100], ["Despesas", "R$ 2.180", 60]],
    result: ["Saldo positivo", "R$ 1.470"]
  }
};
const chapterChallenges = [
  { prompt: "Escreva três passos para preparar uma mochila antes da aula e indique o resultado esperado.", answer: "Uma resposta possível: 1. conferir o horário; 2. separar os materiais necessários; 3. colocar os materiais na mochila. Resultado: mochila pronta para a aula.", explanation: "Um algoritmo tem passos claros e ordenados que levam ao resultado. Sua tarefa pode ter outros passos, desde que sejam possíveis de seguir e terminem com a mochila pronta.", flow: ["Conferir horário", "Separar e guardar materiais", "Mochila pronta"], freeResponse: true },
  { prompt: "Uma viagem durou 2,5 horas. Quantos minutos durou?", options: ["120 minutos", "150 minutos", "250 minutos"], correct: 1, answer: "2,5 × 60 = 150 minutos.", explanation: "A entrada é 2,5 horas, o processamento multiplica por 60 e a saída é 150 minutos.", flow: ["2,5 horas", "× 60", "150 minutos"] },
  { prompt: "A pontuação começa em 10 e recebe mais 5. Qual tipo e valor final fazem sentido?", options: ["Uma variável int com valor 15", "Uma constante string com valor 105", "Um bool com valor 15"], correct: 0, answer: "Use int pontuacao = 10; e depois pontuacao += 5;. O valor final é 15.", explanation: "A pontuação pode mudar, então é uma variável. Como é um número inteiro, int é um tipo adequado.", flow: ["Variável int", "10 + 5", "Valor: 15"] },
  { prompt: "Uma caneta custa R$ 4,50. Qual é o total de 4 canetas?", options: ["Entrada: 4,50 e 4; processamento: multiplicar; saída: R$ 18,00", "Entrada: R$ 18,00; processamento: dividir por 4; saída: R$ 4,50", "Entrada: 4,50 e 4; processamento: somar; saída: R$ 8,50"], correct: 0, answer: "4,50 × 4 = R$ 18,00. O preço e a quantidade são entradas; a multiplicação é o processamento; o total é a saída.", explanation: "Identificamos os dados antes de calcular, aplicamos a regra adequada e apresentamos o total.", flow: ["R$ 4,50 × 4", "Multiplicar", "R$ 18,00"] },
  { prompt: "Sem executar, qual é o resultado de 5 + 2 * 3?", options: ["21; soma antes da multiplicação", "11; multiplicação antes da soma", "15; multiplicação de 5 por 3"], correct: 1, answer: "Primeiro 2 × 3 = 6; depois 5 + 6 = 11.", explanation: "Na expressão, a multiplicação tem precedência sobre a adição.", flow: ["5 + 2 × 3", "5 + 6", "11"] },
  { prompt: "Qual expressão vale 40?", options: ["18 / 3 + 2 * 5", "(18 / 3 + 2) * 5", "18 / (3 + 2) * 5"], correct: 1, answer: "(18 / 3 + 2) * 5 = (6 + 2) × 5 = 40.", explanation: "Os parênteses fazem o 6 e o 2 serem somados primeiro; depois o resultado 8 é multiplicado por 5.", flow: ["(18 / 3 + 2) × 5", "(6 + 2) × 5", "40"] },
  { prompt: "Uma pessoa tem 12 anos. A regra é meia-entrada para idade menor ou igual a 12. Qual caminho ela segue?", options: ["Inteira, porque 12 não é menor que 12", "Meia-entrada, porque 12 <= 12 é verdadeiro", "Inválido, porque 12 não pode ser comparado"], correct: 1, answer: "A condição idade <= 12 é verdadeira para 12; a pessoa paga meia-entrada.", explanation: "O operador <= inclui o próprio limite 12. Por isso, a condição é verdadeira.", flow: ["Idade: 12", "12 <= 12: verdadeiro", "Meia-entrada"] },
  { prompt: "Uma nota vale de 0 a 10. Qual condição identifica uma nota inválida?", options: ["nota < 0 || nota > 10", "nota >= 0 && nota <= 10", "nota == 7"], correct: 0, answer: "A nota é inválida quando nota < 0 || nota > 10. Para exigir senha correta e conta ativa, usamos senhaCorreta && contaAtiva.", explanation: "|| significa OU: basta estar abaixo de 0 ou acima de 10 para ser inválida. && exige que as duas condições sejam verdadeiras.", flow: ["nota < 0?", "OU nota > 10?", "Se sim: inválida"] },
  { prompt: "Um copo comporta 250 ml e começa vazio. O laço é while (ml < 250) e despeja 100 ml por volta. Quais valores de ml aparecem na tela?", options: ["100 e 200; depois o laço para", "100, 200 e 300; depois o laço para", "100, 200, 300 e 400; continua até transbordar"], correct: 1, answer: "Aparecem 100, 200 e 300. Com ml = 200, a pergunta 200 < 250 ainda é verdadeira, então há mais uma volta e ml chega a 300.", explanation: "A condição só é verificada no começo de cada volta. Depois de uma volta começada, ela termina inteira, mesmo que o copo passe de 250 ml. Só então 300 < 250 é falso e o laço para.", flow: ["0 → 100 (0 < 250)", "100 → 200 → 300 (200 < 250)", "300 < 250? Não: parar"] },
  { prompt: "Qual total resulta ao somar os números de 1 a 4 com contador e acumulador?", options: ["4", "10", "1234"], correct: 1, answer: "As somas parciais são 1, 3, 6 e 10. O resultado final é 10.", explanation: "O contador visita cada número; o acumulador soma o valor de cada volta, em vez de juntar os algarismos.", flow: ["1", "1 + 2 + 3", "1 + 2 + 3 + 4 = 10"] },
  { prompt: "No vetor { 8, 7, 9, 6 }, em qual índice está 9 e qual é a soma?", options: ["Índice 3; soma 30", "Índice 2; soma 30", "Índice 2; soma 26"], correct: 1, answer: "O 9 está no índice 2; a soma é 8 + 7 + 9 + 6 = 30.", explanation: "Os índices começam em zero: 8 está no 0, 7 no 1, 9 no 2 e 6 no 3. Somando os quatro valores obtemos 30.", flow: ["Índice 0: 8; 1: 7", "Índice 2: 9; 3: 6", "Soma: 30"] },
  { prompt: "Na matriz {{ 1, 2, 3 }, { 4, 5, 6 }}, qual valor está em lugares[1, 2]?", options: ["3", "5", "6"], correct: 2, answer: "A linha 1 é a segunda linha (4, 5, 6); a coluna 2 é o terceiro valor. Portanto, o resultado é 6.", explanation: "A primeira coordenada indica a linha e a segunda a coluna; ambas começam em zero.", flow: ["Linha 1: 4, 5, 6", "Coluna 2", "Valor: 6"] },
  { prompt: "Uma função calcula a área de um retângulo. Que dados recebe e o que devolve?", options: ["Recebe largura e altura; retorna largura * altura", "Recebe a área pronta; não retorna nada", "Recebe um texto; retorna largura + altura"], correct: 0, answer: "A função recebe largura e altura como parâmetros e retorna largura * altura. Por exemplo, 4 × 3 = 12.", explanation: "Parâmetros são os dados de entrada da função; return devolve o resultado calculado.", flow: ["Largura: 4; altura: 3", "Multiplicar 4 × 3", "Retornar área: 12"] },
  { prompt: "Qual sequência divide o cálculo do saldo mensal em responsabilidades claras?", options: ["Mostrar tudo antes de calcular", "Somar receitas, somar despesas, calcular o saldo e mostrar o resumo", "Repetir a soma das receitas dentro da soma das despesas"], correct: 1, answer: "Separe em tarefas: somar receitas, somar despesas, calcular saldo e mostrar o resumo.", explanation: "Cada módulo tem uma responsabilidade identificável, facilitando entender, reutilizar e testar cada parte.", flow: ["Somar receitas", "Somar despesas", "Calcular e mostrar saldo"] },
  { prompt: "Além de testar notas comuns, quais casos ajudam a testar uma média de notas entre 0 e 10?", options: ["Somente repetir 8 e 6", "Testar os limites 0 e 10 e uma nota inválida, como -1", "Testar apenas o resultado arredondado"], correct: 1, answer: "Teste os limites (0 e 10) e uma entrada inválida, como -1, e compare os resultados ao esperado.", explanation: "Casos de limite e entradas inválidas ajudam a revelar erros que valores comuns podem não mostrar.", flow: ["Caso comum", "Limites: 0 e 10", "Inválido: -1"] },
  { prompt: "Qual instrução C# mostra na tela o valor de uma variável chamada total?", options: ["Console.ReadLine(total);", "Console.WriteLine(total);", "total = Console.WriteLine;"], correct: 1, answer: "Console.WriteLine(total); mostra o valor de total na tela.", explanation: "WriteLine escreve uma saída. ReadLine faz o caminho oposto: lê texto digitado pela pessoa.", flow: ["Variável total", "Console.WriteLine", "Valor na tela"] },
  { prompt: "Qual conjunto classifica corretamente estes saldos?", options: ["Receitas 100 e despesas 70: positivo; 50 e 80: negativo; 50 e 50: zero", "Receitas 100 e despesas 70: negativo; 50 e 80: zero; 50 e 50: positivo", "Todos são positivos porque há receitas"], correct: 0, answer: "100 − 70 = 30 positivo; 50 − 80 = -30 negativo; 50 − 50 = 0.", explanation: "Primeiro subtraímos despesas de receitas. O sinal do saldo determina a classificação: maior que zero, menor que zero ou igual a zero.", flow: ["100 − 70 = 30: positivo", "50 − 80 = -30: negativo", "50 − 50 = 0: zerado"] }
];
const chapterObjectives = [
  "Explicar o que é lógica de programação e reconhecer um algoritmo em uma tarefa conhecida.",
  "Separar um problema em dados de entrada, processamento e resultado esperado.",
  "Diferenciar variáveis, constantes e tipos básicos de dados.",
  "Identificar dados de entrada, transformações e saídas em um programa simples.",
  "Reconhecer operações aritméticas, relacionais e lógicas em uma sequência.",
  "Prever o resultado de expressões usando precedência e parênteses.",
  "Representar uma escolha binária usando uma condição.",
  "Combinar condições e validar valores antes de utilizá-los.",
  "Explicar, com um exemplo do dia a dia, como um laço repete instruções enquanto uma condição for verdadeira, e diferenciar while de do...while.",
  "Usar um laço contado, um contador e um acumulador para processar valores.",
  "Percorrer um vetor, calcular seus valores e realizar uma pesquisa linear.",
  "Acessar e percorrer uma matriz usando linha e coluna.",
  "Explicar parâmetros e retornos de uma função ou procedimento.",
  "Dividir uma tarefa maior em módulos com responsabilidades identificáveis.",
  "Propor casos de teste e acompanhar a execução para localizar erros.",
  "Relacionar os passos de um algoritmo a instruções correspondentes em C#.",
  "Integrar entrada, processamento, decisão, coleção e funções em um pequeno programa."
];

function readStoredValue(key, fallback) {
  if (!storageAvailable) return fallback;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    storageAvailable = false;
    console.warn("O armazenamento local está indisponível; o progresso ficará nesta sessão.", error);
    return fallback;
  }
}

function readProgress() {
  const raw = readStoredValue(progressKey, null);
  if (raw === null) return [...progressCache];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new TypeError("O progresso salvo não é uma lista.");
    const validIds = new Set(completeButtons.map((button) => button.dataset.complete));
    progressCache = [...new Set(parsed.map(String).filter((id) => validIds.has(id)))];
    return [...progressCache];
  } catch (error) {
    console.warn("O progresso salvo está inválido e será reiniciado.", error);
    progressCache = [];
    return [];
  }
}

function saveProgress(progress) {
  progressCache = [...progress];
  if (!storageAvailable) return;
  try {
    localStorage.setItem(progressKey, JSON.stringify(progressCache));
  } catch (error) {
    storageAvailable = false;
    console.warn("Não foi possível salvar o progresso; ele ficará disponível nesta sessão.", error);
    announce("O navegador não permitiu salvar o progresso. Ele será mantido apenas enquanto esta página estiver aberta.");
  }
}

function announce(message) {
  const status = document.querySelector("#page-status");
  status.textContent = message;
}

function updateProgress() {
  const progress = readProgress();
  const completed = new Set(progress);
  for (const button of completeButtons) {
    const done = completed.has(button.dataset.complete);
    button.classList.toggle("done", done);
    button.setAttribute("aria-pressed", String(done));
    button.innerHTML = done
      ? "<span aria-hidden=\"true\">✓</span> Concluído — clique para desfazer"
      : "<span aria-hidden=\"true\">✓</span> Marcar como concluído";
  }
  progressCount.textContent = String(progress.length);
  readingProgress.value = progress.length;
  const allDone = progress.length === completeButtons.length;
  readingLabel.textContent = allDone
    ? "Parabéns! Você concluiu todos os capítulos."
    : `${progress.length} de ${completeButtons.length} capítulos concluídos`;
  readingProgress.closest(".reading-progress").classList.toggle("all-done", allDone);
  resetProgressButton.hidden = progress.length === 0;
}

for (const button of completeButtons) {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const progress = readProgress();
    const id = button.dataset.complete;
    const next = progress.includes(id) ? progress.filter((item) => item !== id) : [...progress, id];
    saveProgress(next);
    updateProgress();
  });
}

resetProgressButton.addEventListener("click", () => {
  if (!window.confirm("Zerar o progresso e marcar todos os capítulos como não concluídos?")) return;
  saveProgress([]);
  updateProgress();
  announce("Progresso zerado.");
});

function setResumeLink(chapterId) {
  const section = lessonSections.find((item) => item.id === chapterId);
  if (!section || !continueReading) return;
  continueReading.href = `#${section.id}`;
  continueReading.textContent = `Continuar: ${section.querySelector("h2").textContent}`;
}

const lastChapter = readStoredValue(lastChapterKey, "fundamentos");
setResumeLink(lastChapter);

function createStepPlayer(getNodes) {
  const controls = document.createElement("div");
  controls.className = "visual-controls";
  const play = document.createElement("button");
  play.type = "button";
  play.className = "visual-play";
  play.textContent = "▶ Animar passo a passo";
  const status = document.createElement("span");
  status.className = "visual-status";
  status.setAttribute("aria-live", "polite");
  status.setAttribute("role", "status");
  status.textContent = "A animação destaca cada etapa.";
  play.addEventListener("click", async () => {
    play.disabled = true;
    const visualNodes = [...getNodes()];
    visualNodes.forEach((node) => node.classList.remove("visual-active", "visual-complete"));
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 520;
    try {
      for (const [index, node] of visualNodes.entries()) {
        node.classList.add("visual-active");
        status.textContent = `Etapa ${index + 1} de ${visualNodes.length}: ${node.dataset.stepLabel}.`;
        if (delay) await new Promise((resolve) => window.setTimeout(resolve, delay));
        node.classList.remove("visual-active");
        node.classList.add("visual-complete");
      }
      status.textContent = "Pronto! A sequência completa está destacada.";
    } finally {
      play.disabled = false;
    }
  });
  controls.append(play, status);
  return controls;
}

const illustrationRedraws = [];
for (const section of lessonSections) {
  const number = Number(section.dataset.lesson);
  const objective = chapterObjectives[number - 1];
  if (objective) {
    const objectiveElement = document.createElement("p");
    objectiveElement.className = "chapter-objective";
    const label = document.createElement("strong");
    label.textContent = "Ao final deste capítulo, você poderá: ";
    objectiveElement.append(label, document.createTextNode(objective));
    section.querySelector(".section-heading").append(objectiveElement);
  }
  const previous = lessonSections.find((item) => Number(item.dataset.lesson) === number - 1);
  const next = lessonSections.find((item) => Number(item.dataset.lesson) === number + 1);
  const navigation = document.createElement("nav");
  navigation.className = "chapter-navigation";
  navigation.setAttribute("aria-label", `Navegação do capítulo ${number}`);
  if (previous) {
    const previousLink = document.createElement("a");
    previousLink.href = `#${previous.id}`;
    previousLink.innerHTML = `<span aria-hidden="true">←</span> Capítulo ${number - 1}`;
    navigation.append(previousLink);
  } else {
    navigation.append(document.createElement("span"));
  }
  if (next) {
    const nextLink = document.createElement("a");
    nextLink.href = `#${next.id}`;
    nextLink.innerHTML = `Próximo capítulo <span aria-hidden="true">→</span>`;
    navigation.append(nextLink);
  } else {
    const finishLink = document.createElement("a");
    finishLink.href = "#praticar";
    finishLink.innerHTML = `Ir para a revisão <span aria-hidden="true">→</span>`;
    navigation.append(finishLink);
  }
  section.append(navigation);
}

for (const section of lessonSections) {
  const number = Number(section.dataset.lesson);
  const challenge = chapterChallenges[number - 1];
  const example = workedExamples[number - 1];
  const completeButton = section.querySelector("[data-complete]");
  if (!challenge || !example || !completeButton) continue;

  const createIllustration = (title, steps, className) => {
    const figure = document.createElement("figure");
    figure.className = `concept-visual ${className}`;
    const caption = document.createElement("figcaption");
    caption.textContent = title;
    const sceneConfig = chapterVisuals[number];
    if (sceneConfig) {
      const scene = document.createElement("div");
      scene.className = `visual-scene scene-${sceneConfig.type}`;
      scene.setAttribute("role", "group");
      scene.setAttribute("aria-label", title);
      const createElement = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
      };
      const addNode = (container, className, text, label) => {
        const element = createElement("div", `visual-node ${className || ""}`.trim());
        element.dataset.stepLabel = label || text;
        if (text) element.append(document.createTextNode(text));
        container.append(element);
        return element;
      };
      const addArrow = (container, text = "→") => container.append(createElement("span", "visual-arrow", text));
      const addTag = (container, text) => container.append(createElement("span", "visual-tag", text));

      if (sceneConfig.type === "memory") {
        const shelf = createElement("div", "memory-board");
        for (const [index, [name, value, type]] of sceneConfig.items.entries()) {
          const box = addNode(shelf, "memory-slot", "", `${name}: ${value}, ${type}`);
          box.append(createElement("span", "memory-box-icon", ["🧺", "🎂", "✅", "⏱️"][index]));
          box.append(createElement("span", "memory-box-name", name));
          box.append(createElement("strong", "memory-box-value", value));
          box.append(createElement("small", "memory-box-type", type));
        }
        scene.append(shelf, createElement("p", "scene-caption", "Variável: o valor pode mudar. Constante: guardamos um valor que não deve ser alterado."));
      } else if (sceneConfig.type === "expression") {
        const tree = createElement("div", "expression-tree");
        const root = addNode(tree, "expression-root", sceneConfig.items[0][0], "Expressão: 2 mais 3 vezes 4");
        addTag(root, sceneConfig.items[0][1]);
        const children = createElement("div", "expression-children");
        for (const [index, [text, label]] of sceneConfig.items.slice(1).entries()) {
          const child = addNode(children, `expression-child expression-child-${index + 1}`, text, label);
          addTag(child, index === 0 ? "1º" : "2º");
        }
        tree.append(children);
        scene.append(tree, createElement("p", "scene-note", `Com parênteses: ${sceneConfig.alternate}`));
      } else if (sceneConfig.type === "decision" || sceneConfig.type === "validation") {
        const start = addNode(scene, "flow-start", sceneConfig.type === "decision" ? "Você vai sair" : "Receber nota: 8,5", "Ponto de partida");
        const line = createElement("span", "flow-connector", "↓");
        const condition = addNode(scene, "flow-condition", sceneConfig.question, "Verificar a condição: " + sceneConfig.question);
        const branches = createElement("div", "flow-branches");
        const paths = sceneConfig.type === "decision" ? [sceneConfig.yes, sceneConfig.no] : sceneConfig.paths;
        for (const [index, [label, outcome]] of paths.entries()) {
          const branch = createElement("div", `flow-branch ${index === 0 ? "branch-yes" : "branch-no"}`);
          const arrow = addNode(branch, "flow-branch-label", index === 0 ? "↙" : "↘", `${label}: ${outcome}`);
          addTag(arrow, label);
          addNode(branch, "flow-outcome", outcome, outcome);
          branches.append(branch);
        }
        scene.append(start, line, condition, branches);
      } else if (sceneConfig.type === "loop") {
        const condition = addNode(scene, "loop-condition", sceneConfig.question, "Condição verificada antes de cada volta");
        const timeline = createElement("ol", "loop-timeline");
        for (const [index, [balance, instruction]] of sceneConfig.items.entries()) {
          const item = addNode(timeline, `loop-tick ${index === sceneConfig.items.length - 1 ? "loop-stop" : ""}`, "", `Saldo ${balance}: ${instruction}`);
          item.append(createElement("strong", "loop-value", balance));
          item.append(createElement("span", "loop-instruction", instruction));
        }
        scene.append(condition, createElement("span", "loop-return", "↶ enquanto a condição for verdadeira"), timeline);
      } else if (sceneConfig.type === "counter") {
        const timeline = createElement("div", "counter-timeline");
        for (const [index, [counter, sum]] of sceneConfig.items.entries()) {
          const item = addNode(timeline, "counter-step", "", `Volta ${counter}; ${sum}`);
          item.append(createElement("span", "counter-round", `Volta ${counter}`));
          item.append(createElement("strong", "counter-total", sum));
          if (index < sceneConfig.items.length - 1) addArrow(timeline);
        }
        scene.append(createElement("p", "scene-caption", "A cada volta, o contador avança e o acumulador guarda a soma parcial."), timeline);
      } else if (sceneConfig.type === "vector") {
        const vector = createElement("div", "vector-board");
        for (const [index, [position, value]] of sceneConfig.items.entries()) {
          const cell = addNode(vector, `vector-cell ${value === "9" ? "vector-found" : ""}`, "", `Índice ${position}, valor ${value}${value === "9" ? ", encontrado" : ""}`);
          cell.append(createElement("small", "", `índice ${position}`));
          cell.append(createElement("strong", "", value));
          cell.append(createElement("span", "vector-scan", value === "9" ? "Encontrado!" : "verificar"));
          if (index < sceneConfig.items.length - 1) addArrow(vector);
        }
        scene.append(vector, createElement("p", "scene-caption", "A pesquisa linear compara cada valor da esquerda para a direita até encontrar o procurado."));
      } else if (sceneConfig.type === "matrix") {
        const matrix = createElement("div", "matrix-board");
        matrix.append(createElement("span", "matrix-axis-title", "LINHA ↓  ·  COLUNA →"));
        const grid = createElement("div", "matrix-grid");
        for (const [rowIndex, row] of sceneConfig.rows.entries()) {
          for (const [columnIndex, value] of row.entries()) {
            const target = sceneConfig.target === `${rowIndex},${columnIndex}`;
            const cell = addNode(grid, `matrix-cell ${target ? "matrix-target" : ""}`, value, `Linha ${rowIndex}, coluna ${columnIndex}: ${value}${target ? ", valor procurado" : ""}`);
            addTag(cell, `[${rowIndex},${columnIndex}]`);
          }
        }
        matrix.append(grid, createElement("p", "matrix-result", "lugares[0, 2] = 3"));
        scene.append(matrix);
      } else if (sceneConfig.type === "function") {
        const args = createElement("div", "function-arguments");
        for (const [name, value] of sceneConfig.items) {
          const arg = addNode(args, "function-argument", "", `${name} recebe ${value}`);
          arg.append(createElement("small", "", name));
          arg.append(createElement("strong", "", value));
        }
        addArrow(args, "→");
        const body = addNode(args, "function-body", "", `Calcular média: ${sceneConfig.operation}`);
        body.append(createElement("span", "function-symbol", "ƒ"));
        body.append(createElement("strong", "", "CalcularMedia"));
        body.append(createElement("small", "", sceneConfig.operation));
        addArrow(args, "→");
        const result = addNode(args, "function-return", "", `return devolve ${sceneConfig.result}`);
        result.append(createElement("small", "", "RETORNO"));
        result.append(createElement("strong", "", sceneConfig.result));
        scene.append(args);
      } else if (sceneConfig.type === "modules") {
        const modules = createElement("div", "module-board");
        const cards = createElement("div", "module-cards");
        for (const [numberLabel, task] of sceneConfig.items) {
          const module = addNode(cards, "module-card", "", `${numberLabel} ${task}`);
          module.append(createElement("span", "module-icon", numberLabel));
          module.append(createElement("strong", "", task));
        }
        const connector = createElement("span", "module-connector", "↓ ↓ ↓");
        const summary = addNode(modules, "module-summary", sceneConfig.result, sceneConfig.result);
        modules.append(cards, connector, summary);
        scene.append(modules);
      } else if (sceneConfig.type === "tests") {
        const tests = createElement("div", "test-board");
        for (const [test, expected, kind, status] of sceneConfig.items) {
          const card = addNode(tests, `test-card test-${status}`, "", `${kind}: entrada ${test}; ${expected}`);
          card.append(createElement("span", "test-icon", status === "ok" ? "✓" : "!"));
          card.append(createElement("strong", "", kind));
          card.append(createElement("span", "test-input", `Entradas: ${test}`));
          card.append(createElement("span", "test-expected", expected));
        }
        scene.append(tests);
      } else if (sceneConfig.type === "translation") {
        const translation = createElement("div", "translation-board");
        for (const [index, [algorithm, csharp]] of sceneConfig.items.entries()) {
          const row = createElement("div", "translation-row");
          const informal = addNode(row, "translation-algorithm", algorithm, `Algoritmo: ${algorithm}`);
          addTag(informal, "ALGORITMO");
          addArrow(row, "→");
          const implementation = addNode(row, "translation-code", csharp, `C#: ${csharp}`);
          addTag(implementation, "C#");
          translation.append(row);
        }
        scene.append(translation);
      } else if (sceneConfig.type === "budget") {
        const bars = createElement("div", "budget-board");
        for (const [label, amount, width] of sceneConfig.income) {
          const row = createElement("div", "budget-row");
          const details = createElement("div", "budget-details");
          details.append(createElement("span", "", label));
          details.append(createElement("strong", "", amount));
          const bar = addNode(row, "budget-bar-track", "", `${label}: ${amount}`);
          const fill = createElement("span", `budget-bar-fill ${label === "Despesas" ? "expense-fill" : ""}`);
          fill.style.width = `${width}%`;
          bar.append(fill);
          row.append(details, bar);
          bars.append(row);
        }
        addNode(bars, "budget-result", `${sceneConfig.result[0]} · ${sceneConfig.result[1]}`, `${sceneConfig.result[0]}: ${sceneConfig.result[1]}`);
        scene.append(bars);
      }

      figure.append(caption, scene, createStepPlayer(() => scene.querySelectorAll(".visual-node")));
      return figure;
    }

    const illustration = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    illustration.setAttribute("role", "img");
    illustration.setAttribute("aria-label", `${title}: ${steps.join("; ")}`);
    illustration.classList.add("chapter-illustration");
    const colors = [
      { fill: "#fff7e8", stroke: "#f0d9a8", ink: "#9b6a20" },
      { fill: "#f0edff", stroke: "#d8d2ff", ink: "#5a4bb6" },
      { fill: "#eaf7f0", stroke: "#cbe9d8", ink: "#32815f" }
    ];
    const drawIllustration = () => {
      const compact = window.matchMedia("(max-width: 640px)").matches;
      illustration.replaceChildren();
      illustration.setAttribute("viewBox", compact ? "0 0 440 515" : "0 0 900 230");
      let drawingTarget = illustration;
      const addSvgElement = (name, attributes, text) => {
        const element = document.createElementNS("http://www.w3.org/2000/svg", name);
        for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
        if (text) element.textContent = text;
        drawingTarget.append(element);
        return element;
      };
      addSvgElement("rect", { width: compact ? "440" : "900", height: compact ? "515" : "230", rx: "20", fill: "#f5f4ff" });
      for (const [index, text] of steps.entries()) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.classList.add("visual-node");
        group.dataset.stepLabel = text;
        illustration.append(group);
        drawingTarget = group;
        const x = compact ? 20 : [26, 326, 626][index];
        const y = compact ? 18 + index * 165 : 25;
        const width = compact ? 400 : 248;
        const height = compact ? 140 : 180;
        const palette = colors[index];
        addSvgElement("rect", { x: String(x), y: String(y), width: String(width), height: String(height), rx: "17", fill: "#ffffff", stroke: palette.stroke, "stroke-width": "2" });
        const badgeX = compact ? x + 29 : x + 28;
        const badgeY = compact ? y + 28 : y + 28;
        addSvgElement("circle", { cx: String(badgeX), cy: String(badgeY), r: "15", fill: palette.fill });
        addSvgElement("text", { x: String(badgeX), y: String(badgeY + 4), "text-anchor": "middle", fill: palette.ink, "font-family": "Arial, sans-serif", "font-size": "11", "font-weight": "700" }, String(index + 1));
        addSvgElement("text", { x: String(compact ? x + 54 : x + 52), y: String(badgeY + 4), fill: "#72778b", "font-family": "Arial, sans-serif", "font-size": compact ? "12" : "11", "font-weight": "700", "letter-spacing": "1" }, ["ENTRADA", "PROCESSO", "RESULTADO"][index]);
        addSvgElement("text", { x: String(compact ? x + 54 : x + 124), y: String(compact ? y + 88 : y + 86), "text-anchor": compact ? "start" : "middle", "font-family": "Segoe UI Emoji, Segoe UI Symbol, sans-serif", "font-size": compact ? "39" : "37" }, chapterIllustrations[number - 1][index]);
        const words = text.split(/\s+/);
        const lines = [""];
        const lineLimit = compact ? 34 : 24;
        for (const word of words) {
          const lineIndex = lines.length - 1;
          if (`${lines[lineIndex]} ${word}`.trim().length > lineLimit && lines[lineIndex]) lines.push(word);
          else lines[lineIndex] = `${lines[lineIndex]} ${word}`.trim();
        }
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const textX = compact ? x + 112 : x + 124;
        const textY = compact ? y + (lines.length > 1 ? 78 : 88) : y + (lines.length > 1 ? 132 : 141);
        textElement.setAttribute("x", String(textX));
        textElement.setAttribute("y", String(textY));
        textElement.setAttribute("text-anchor", compact ? "start" : "middle");
        textElement.setAttribute("fill", "#34394d");
        textElement.setAttribute("font-family", "Arial, sans-serif");
        textElement.setAttribute("font-size", compact ? "16" : "15");
        textElement.setAttribute("font-weight", "700");
        for (const [lineIndex, line] of lines.entries()) {
          const span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          span.setAttribute("x", String(textX));
          if (lineIndex) span.setAttribute("dy", compact ? "20" : "18");
          span.textContent = line;
          textElement.append(span);
        }
        drawingTarget.append(textElement);
        drawingTarget = illustration;
        if (index < steps.length - 1) {
          const path = compact
            ? `M ${x + width / 2} ${y + height + 1} V ${y + 158} M ${x + width / 2 - 6} ${y + 152} L ${x + width / 2} ${y + 158} L ${x + width / 2 + 6} ${y + 152}`
            : `M ${x + 262} 115 H ${x + 286} M ${x + 280} 109 L ${x + 286} 115 L ${x + 280} 121`;
          addSvgElement("path", { d: path, fill: "none", stroke: "#8173da", "stroke-width": "3", "stroke-linecap": "round", "stroke-linejoin": "round" });
        }
      }
    };
    drawIllustration();
    illustrationRedraws.push(drawIllustration);
    figure.append(caption, illustration, createStepPlayer(() => illustration.querySelectorAll(".visual-node")));
    return figure;
  };

  const exampleSection = document.createElement("section");
  exampleSection.className = "worked-example";
  const exampleHeading = document.createElement("h3");
  exampleHeading.textContent = `Exemplo resolvido: ${example.title}`;
  const context = document.createElement("p");
  context.className = "worked-context";
  context.textContent = example.context;
  const exampleSteps = document.createElement("ol");
  exampleSteps.className = "worked-steps";
  for (const step of example.steps) {
    const item = document.createElement("li");
    item.textContent = step;
    exampleSteps.append(item);
  }
  exampleSection.append(exampleHeading, context, exampleSteps);
  if (example.code) {
    const codeExample = document.createElement("div");
    codeExample.className = "code-example worked-code";
    const header = document.createElement("div");
    header.className = "code-heading";
    const label = document.createElement("span");
    label.textContent = "Solução completa";
    const language = document.createElement("span");
    language.className = "code-language";
    language.textContent = number === 1 || number === 14 ? "ALGORITMO" : "C#";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = example.code;
    pre.append(code);
    header.append(label, language);
    codeExample.append(header, pre);
    exampleSection.append(codeExample);
  }
  const exampleVisual = createIllustration("Veja o caminho do exemplo", example.flow, "example-visual");

  const createChapterArtwork = (artwork) => {
    const figure = document.createElement("figure");
    figure.className = "chapter-artwork";
    const image = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    image.classList.add("chapter-artwork-image");
    image.setAttribute("role", "img");
    image.setAttribute("aria-label", `${artwork.title}. ${artwork.cards.map(([, label]) => label).join("; ")}.`);
    const palette = [
      { wall: "#e7f0ff", accent: "#5e83c7", desk: "#bb8c60", card: "#ffffff" },
      { wall: "#e8f5f1", accent: "#52937d", desk: "#c49a6a", card: "#ffffff" },
      { wall: "#f4eee6", accent: "#95724c", desk: "#ad7d50", card: "#fffdf8" }
    ][(number - 1) % 3];
    const drawArtwork = () => {
      const compact = window.matchMedia("(max-width: 640px)").matches;
      const width = compact ? 480 : 760;
      const height = compact ? 620 : 280;
      image.replaceChildren();
      image.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const add = (tag, attributes, text) => {
        const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
        if (text) element.textContent = text;
        image.append(element);
        return element;
      };
      const wrapText = (value, maxLength) => {
        const lines = [""];
        for (const word of value.split(/\s+/)) {
          const current = lines.length - 1;
          if (`${lines[current]} ${word}`.trim().length > maxLength && lines[current]) lines.push(word);
          else lines[current] = `${lines[current]} ${word}`.trim();
        }
        return lines;
      };
      add("rect", { width: String(width), height: String(height), rx: "20", fill: palette.wall });
      add("circle", { cx: compact ? "441" : "720", cy: compact ? "25" : "22", r: compact ? "54" : "67", fill: "#ffffff", opacity: ".33" });
      const windowX = compact ? 25 : 34;
      const windowY = compact ? 19 : 28;
      const windowW = compact ? 146 : 218;
      const windowH = compact ? 124 : 157;
      add("rect", { x: String(windowX), y: String(windowY), width: String(windowW), height: String(windowH), rx: "12", fill: "#f9fbff", stroke: "#ffffff", "stroke-width": "8" });
      add("rect", { x: String(windowX + 8), y: String(windowY + 8), width: String(windowW - 16), height: String(windowH - 16), rx: "7", fill: "#d8ecf4" });
      add("circle", { cx: String(windowX + windowW - 42), cy: String(windowY + 39), r: "17", fill: "#f4c86f" });
      add("path", { d: `M ${windowX + 8} ${windowY + windowH - 36} Q ${windowX + 59} ${windowY + 74} ${windowX + 112} ${windowY + windowH - 39} T ${windowX + windowW - 8} ${windowY + windowH - 42} V ${windowY + windowH - 8} H ${windowX + 8} Z`, fill: "#a9d4bb" });
      add("path", { d: `M ${windowX + windowW / 2} ${windowY + 7} V ${windowY + windowH - 7} M ${windowX + 8} ${windowY + windowH / 2} H ${windowX + windowW - 8}`, stroke: "#ffffff", "stroke-width": "7" });
      add("rect", { x: "0", y: compact ? "269" : "215", width: String(width), height: String(compact ? 351 : 65), fill: palette.desk });
      add("path", { d: `M 0 ${compact ? 269 : 215} H ${width}`, stroke: "#e0bd92", "stroke-width": "8" });
      add("path", { d: `M 0 ${compact ? 290 : 237} H ${width}`, stroke: "#8f6746", "stroke-width": "2", opacity: ".5" });
      const centerX = compact ? 344 : 288;
      const centerY = compact ? 158 : 145;
      add("ellipse", { cx: String(centerX), cy: String(centerY + (compact ? 51 : 63)), rx: compact ? "64" : "91", ry: compact ? "12" : "19", fill: "#574934", opacity: ".17" });
      add("circle", { cx: String(centerX), cy: String(centerY), r: compact ? "57" : "83", fill: "#fffaf0", stroke: "#ffffff", "stroke-width": "9" });
      add("circle", { cx: String(centerX), cy: String(centerY), r: compact ? "48" : "73", fill: "#ffffff" });
      add("text", { x: String(centerX), y: String(centerY + (compact ? 20 : 32)), "text-anchor": "middle", "font-family": "\"Segoe UI Emoji\", \"Segoe UI Symbol\", sans-serif", "font-size": compact ? "53" : "78" }, artwork.hero);
      if (!compact) {
        add("text", { x: "36", y: "202", fill: "#ffffff", "font-family": "Arial, sans-serif", "font-size": "10", "font-weight": "800", "letter-spacing": "1.2" }, `CAPÍTULO ${String(number).padStart(2, "0")}`);
      }
      const cards = artwork.cards;
      for (const [index, [icon, label]] of cards.entries()) {
        const x = compact ? 17 : 425;
        const y = compact ? 304 + index * 99 : 34 + index * 72;
        const cardW = compact ? 446 : 300;
        const cardH = compact ? 82 : 59;
        add("rect", { x: String(x), y: String(y + 4), width: String(cardW), height: String(cardH), rx: "12", fill: "#4d584d", opacity: ".13" });
        add("rect", { x: String(x), y: String(y), width: String(cardW), height: String(cardH), rx: "12", fill: palette.card, stroke: "#ffffff", "stroke-width": "2" });
        const iconX = compact ? x + 46 : x + 40;
        const iconY = compact ? y + 41 : y + 34;
        add("circle", { cx: String(iconX), cy: String(iconY), r: compact ? "25" : "20", fill: index === 0 ? "#fff4dc" : index === 1 ? "#eeeaff" : "#e8f6ee" });
        add("text", { x: String(iconX), y: String(iconY + (compact ? 9 : 8)), "text-anchor": "middle", "font-family": "\"Segoe UI Emoji\", \"Segoe UI Symbol\", sans-serif", "font-size": compact ? "27" : "21" }, icon);
        const lines = wrapText(label, 30);
        const textX = compact ? x + 91 : x + 75;
        const textY = compact ? y + 46 - (lines.length - 1) * 8 : y + 29 - (lines.length - 1) * 6;
        const text = add("text", { x: String(textX), y: String(textY), "text-anchor": "start", fill: "#41475a", "font-family": "Arial, sans-serif", "font-size": compact ? "18" : "14", "font-weight": "700" });
        for (const [lineIndex, line] of lines.entries()) {
          const span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          span.setAttribute("x", String(textX));
          if (lineIndex) span.setAttribute("dy", compact ? "15" : "17");
          span.textContent = line;
          text.append(span);
        }
      }
    };
    drawArtwork();
    illustrationRedraws.push(drawArtwork);
    const caption = document.createElement("figcaption");
    caption.textContent = artwork.title;
    figure.append(image, caption);
    return figure;
  };

  const chapterArtworkFigure = createChapterArtwork(chapterArtwork[number - 1]);

  const challengeSection = document.createElement("section");
  challengeSection.className = "chapter-challenge";
  challengeSection.setAttribute("aria-labelledby", `challenge-title-${number}`);
  const challengeHeading = document.createElement("h3");
  challengeHeading.id = `challenge-title-${number}`;
  challengeHeading.textContent = `Desafio do capítulo ${String(number).padStart(2, "0")}`;
  const prompt = document.createElement("p");
  prompt.className = "challenge-prompt";
  prompt.textContent = challenge.prompt;
  challengeSection.append(challengeHeading, prompt);

  let selectedOption = null;
  if (challenge.freeResponse) {
    const responseLabel = document.createElement("label");
    responseLabel.className = "challenge-response-label";
    responseLabel.htmlFor = `challenge-response-${number}`;
    responseLabel.textContent = "Escreva seus passos:";
    const responseInput = document.createElement("textarea");
    responseInput.id = responseLabel.htmlFor;
    responseInput.className = "challenge-response";
    responseInput.rows = 4;
    responseInput.placeholder = "1. Primeiro passo…\n2. Segundo passo…\n3. Terceiro passo…\nResultado esperado: …";
    responseInput.setAttribute("aria-describedby", `challenge-feedback-${number}`);
    challengeSection.append(responseLabel, responseInput);
  } else {
    const options = document.createElement("div");
    options.className = "challenge-options";
    options.setAttribute("role", "group");
    options.setAttribute("aria-label", "Escolha uma resposta");
    challenge.options.forEach((optionText, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "challenge-option";
      option.textContent = optionText;
      option.setAttribute("aria-pressed", "false");
      option.addEventListener("click", () => {
        selectedOption = index;
        options.querySelectorAll("button").forEach((button) => {
          const selected = button === option;
          button.classList.toggle("selected", selected);
          button.setAttribute("aria-pressed", String(selected));
        });
      });
      options.append(option);
    });
    challengeSection.append(options);
  }

  const checkButton = document.createElement("button");
  checkButton.type = "button";
  checkButton.className = "button button-small challenge-check";
  checkButton.textContent = challenge.freeResponse ? "Ver uma resposta possível" : "Conferir resposta";
  const feedback = document.createElement("p");
  feedback.className = "challenge-feedback";
  feedback.id = `challenge-feedback-${number}`;
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  feedback.hidden = true;
  const correction = document.createElement("div");
  correction.className = "challenge-correction";
  correction.hidden = true;
  const correctionHeading = document.createElement("h4");
  correctionHeading.textContent = "Correção explicada";
  const answer = document.createElement("p");
  answer.className = "challenge-answer";
  answer.textContent = challenge.answer;
  const explanation = document.createElement("p");
  explanation.className = "challenge-explanation";
  explanation.textContent = challenge.explanation;
  const correctionVisual = createIllustration("A resposta em uma imagem", challenge.flow, "correction-visual");
  correction.append(correctionHeading, answer, explanation, correctionVisual);

  checkButton.addEventListener("click", () => {
    if (challenge.freeResponse) {
      const response = challengeSection.querySelector("textarea").value.trim();
      if (!response) {
        feedback.textContent = "Escreva sua resposta antes de conferir o exemplo.";
        feedback.className = "challenge-feedback try-again";
        feedback.hidden = false;
        challengeSection.querySelector("textarea").focus();
        return;
      }
      feedback.textContent = "Resposta registrada. Compare seus passos e o resultado esperado com esta possibilidade.";
      feedback.className = "challenge-feedback";
    } else if (selectedOption === null) {
      feedback.textContent = "Escolha uma alternativa antes de conferir.";
      feedback.className = "challenge-feedback try-again";
      feedback.hidden = false;
      challengeSection.querySelector(".challenge-option").focus();
      return;
    } else {
      const isCorrect = selectedOption === challenge.correct;
      feedback.textContent = isCorrect
        ? "Correto! Confira abaixo como chegar à resposta."
        : "Ainda não. Veja a correção passo a passo e tente novamente.";
      feedback.className = `challenge-feedback ${isCorrect ? "good" : "try-again"}`;
    }
    feedback.hidden = false;
    correction.hidden = false;
  });
  challengeSection.append(checkButton, feedback, correction);

  const practicePrompt = section.querySelector(".practice-prompt");
  const exampleElements = [exampleSection, chapterArtworkFigure, exampleVisual];
  const photo = chapterPhotos[number];
  if (photo) {
    const photoFigure = document.createElement("figure");
    photoFigure.className = "chapter-photo";
    const image = document.createElement("img");
    image.src = photo.src;
    image.width = photo.width;
    image.height = photo.height;
    image.decoding = "async";
    image.alt = photo.alt;
    image.loading = "lazy";
    const photoCaption = document.createElement("figcaption");
    photoCaption.textContent = photo.caption;
    photoFigure.append(image, photoCaption);
    exampleElements.push(photoFigure);
  }
  completeButton.before(...exampleElements);
  if (practicePrompt) exampleElements[exampleElements.length - 1].after(practicePrompt);
  completeButton.before(challengeSection);
}

let illustrationResizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(illustrationResizeTimer);
  illustrationResizeTimer = window.setTimeout(() => illustrationRedraws.forEach((redraw) => redraw()), 120);
});

const csharpKeywords = new Set([
  "bool", "break", "case", "const", "continue", "decimal", "default", "do", "double", "else",
  "false", "for", "foreach", "if", "int", "new", "null", "out", "return", "static", "string",
  "switch", "true", "var", "void", "while"
]);
const csharpTokenPattern = new RegExp(
  `(\\/\\/[^\\n]*|"(?:\\\\.|[^"\\\\])*"|\\b(?:${[...csharpKeywords].join("|")})\\b|\\b\\d+(?:\\.\\d+)?m?\\b|==|!=|<=|>=|&&|\\|\\||\\+=|-=|[{}()[\\].,;:+*/%=<>!&|?-])`,
  "g"
);

for (const codeExample of document.querySelectorAll(".code-example")) {
  if (codeExample.querySelector(".code-language")?.textContent.trim() !== "C#") continue;
  const codeElement = codeExample.querySelector("pre code");
  if (!codeElement) continue;
  const source = codeElement.textContent;
  const fragment = document.createDocumentFragment();
  let offset = 0;
  for (const match of source.matchAll(csharpTokenPattern)) {
    const [token] = match;
    const start = match.index;
    if (start > offset) fragment.append(document.createTextNode(source.slice(offset, start)));
    const span = document.createElement("span");
    span.className = token.startsWith("//") ? "token-comment"
      : token.startsWith("\"") ? "token-string"
        : csharpKeywords.has(token) ? "token-keyword"
          : /^\d/.test(token) ? "token-number" : "token-operator";
    span.textContent = token;
    fragment.append(span);
    offset = start + token.length;
  }
  if (offset < source.length) fragment.append(document.createTextNode(source.slice(offset)));
  codeElement.replaceChildren(fragment);
}

for (const codeBlock of document.querySelectorAll(".code-example pre")) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-code";
  button.textContent = "Copiar código";
  const header = codeBlock.closest(".code-example").querySelector(".code-heading");
  const chapterNumber = codeBlock.closest(".lesson-section")?.dataset.lesson;
  const where = chapterNumber ? ` (capítulo ${chapterNumber})` : "";
  button.setAttribute("aria-label", `Copiar código: ${header.querySelector("span").textContent}${where}`);
  header.append(button);
  button.addEventListener("click", async () => {
    const text = codeBlock.innerText;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const temporary = document.createElement("textarea");
        temporary.value = text;
        temporary.setAttribute("readonly", "");
        temporary.className = "clipboard-temporary";
        document.body.append(temporary);
        let copied;
        try {
          temporary.select();
          copied = document.execCommand("copy");
        } finally {
          temporary.remove();
        }
        if (!copied) throw new Error("O navegador não conseguiu copiar o código.");
      }
      announce("Código copiado para a área de transferência.");
      button.textContent = "Copiado";
      window.setTimeout(() => { button.textContent = "Copiar código"; }, 1800);
    } catch (error) {
      console.error("Falha ao copiar o código.", error);
      announce("Não foi possível copiar automaticamente. Selecione e copie o código manualmente.");
    }
  });
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("open", !isOpen);
});

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("open");
}

mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const sidebar = document.querySelector(".sidebar");
const sidebarLinks = document.querySelector("#indice-capitulos");
if (sidebar && sidebarLinks) {
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "sidebar-toggle";
  toggle.setAttribute("aria-controls", sidebarLinks.id);
  const setCollapsed = (collapsed) => {
    sidebar.classList.toggle("collapsed", collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.innerHTML = `<span>Índice do livro · ${lessonSections.length} capítulos</span><span aria-hidden="true">${collapsed ? "▾" : "▴"}</span>`;
  };
  sidebar.classList.add("has-toggle");
  sidebar.insertBefore(toggle, sidebarLinks);
  setCollapsed(mobileQuery.matches);
  toggle.addEventListener("click", () => setCollapsed(!sidebar.classList.contains("collapsed")));
  sidebarLinks.addEventListener("click", (event) => {
    if (mobileQuery.matches && event.target.closest("a")) setCollapsed(true);
  });
  mobileQuery.addEventListener("change", (event) => setCollapsed(event.matches));
}

const backToTop = document.querySelector("#back-to-top");
const hero = document.querySelector("#inicio");
if (backToTop && hero && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    backToTop.classList.toggle("visible", !entry.isIntersecting);
  }, { rootMargin: "-300px 0px 0px 0px" }).observe(hero);
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const ageInput = document.querySelector("#idade-ingresso");
document.querySelector("#verificar-idade").addEventListener("click", () => {
  const age = ageInput.value.trim() === "" ? Number.NaN : Number(ageInput.value);
  const result = document.querySelector("#resultado-idade");
  if (!Number.isInteger(age) || age < 0 || age > 120) {
    ageInput.setAttribute("aria-invalid", "true");
    result.textContent = "Digite uma idade válida entre 0 e 120.";
    result.classList.add("input-error");
    ageInput.focus();
    return;
  }
  ageInput.removeAttribute("aria-invalid");
  result.classList.remove("input-error");
  result.textContent = age <= 12 ? "A pessoa paga meia-entrada: idade menor ou igual a 12." : "A pessoa paga o ingresso inteiro: idade acima de 12.";
});

document.querySelector("#iniciar-contagem").addEventListener("click", async (event) => {
  const input = document.querySelector("#numero-voltas");
  const output = document.querySelector("#resultado-voltas");
  const count = input.value.trim() === "" ? Number.NaN : Number(input.value);
  if (!Number.isInteger(count) || count < 1 || count > 12) {
    input.setAttribute("aria-invalid", "true");
    output.textContent = "Escolha um número inteiro de voltas entre 1 e 12.";
    output.classList.add("input-error");
    input.focus();
    return;
  }
  input.removeAttribute("aria-invalid");
  output.classList.remove("input-error");
  const button = event.currentTarget;
  button.disabled = true;
  try {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
    for (let turn = 1; turn <= count; turn += 1) {
      output.textContent = `Volta ${turn} de ${count} — repetindo a instrução...`;
      if (delay) await new Promise((resolve) => window.setTimeout(resolve, delay));
    }
    output.textContent = `Laço encerrado: foram ${count} voltas.`;
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#calcular-media").addEventListener("click", () => {
  const fields = [...document.querySelectorAll(".nota-turma")];
  const grades = fields.map((field) => field.value.trim() === "" ? Number.NaN : Number(field.value));
  const invalidIndex = grades.findIndex((grade) => !Number.isFinite(grade) || grade < 0 || grade > 10);
  const result = document.querySelector("#resultado-media");
  if (invalidIndex !== -1) {
    fields.forEach((field, index) => {
      if (index === invalidIndex) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
    });
    result.textContent = "Confira as notas: cada valor precisa estar entre 0 e 10.";
    result.classList.add("input-error");
    fields[invalidIndex].focus();
    return;
  }
  fields.forEach((field) => field.removeAttribute("aria-invalid"));
  const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  result.classList.remove("input-error");
  result.textContent = `A média é ${average.toFixed(2).replace(".", ",")}.`;
});

const quizCards = [...document.querySelectorAll(".quiz-card")];
const quizScore = document.querySelector("#quiz-score");
const firstAttempts = new Map();

function updateQuizScore() {
  if (!quizScore) return;
  const answered = firstAttempts.size;
  const correct = [...firstAttempts.values()].filter(Boolean).length;
  quizScore.textContent = answered === 0
    ? "Responda às perguntas para ver sua pontuação."
    : `Acertos na primeira tentativa: ${correct} de ${quizCards.length} (${answered} respondida${answered === 1 ? "" : "s"}).`;
  if (answered > 0) {
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Recomeçar revisão";
    retry.addEventListener("click", () => {
      firstAttempts.clear();
      for (const card of quizCards) {
        card.querySelectorAll(".quiz-options button").forEach((option) => {
          option.classList.remove("correct-answer", "wrong-answer");
          option.setAttribute("aria-pressed", "false");
        });
        const cardFeedback = card.querySelector(".quiz-feedback");
        cardFeedback.textContent = "";
        cardFeedback.className = "quiz-feedback";
      }
      updateQuizScore();
    });
    quizScore.append(retry);
  }
}

quizCards.forEach((card) => {
  const feedback = card.querySelector(".quiz-feedback");
  card.querySelectorAll(".quiz-options button").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      if (!firstAttempts.has(card)) {
        firstAttempts.set(card, button.dataset.correct === "true");
        updateQuizScore();
      }
      card.querySelectorAll(".quiz-options button").forEach((option) => {
        option.classList.remove("correct-answer", "wrong-answer");
        option.setAttribute("aria-pressed", "false");
      });
      const isCorrect = button.dataset.correct === "true";
      button.classList.add(isCorrect ? "correct-answer" : "wrong-answer");
      button.setAttribute("aria-pressed", "true");
      feedback.textContent = `${isCorrect ? "Correto!" : "Ainda não."} ${button.dataset.explanation}`;
      feedback.className = `quiz-feedback ${isCorrect ? "good" : "try-again"}`;
    });
  });
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const chapter = entry.target;
      sideLinks.forEach((link) => {
        const active = link.hash === `#${chapter.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      setResumeLink(chapter.id);
      if (storageAvailable) {
        try {
          localStorage.setItem(lastChapterKey, chapter.id);
        } catch (error) {
          storageAvailable = false;
          console.warn("Não foi possível salvar o capítulo atual.", error);
        }
      }
    }
  }, { rootMargin: "-20% 0px -65% 0px" });
  lessonSections.forEach((section) => sectionObserver.observe(section));
}

function setupWhileSimulator() {
  const root = document.querySelector("#sim-while");
  if (!root) return;
  const capacity = 300;
  const dose = 100;
  const maxForgetfulLaps = 5;
  const water = root.querySelector("#sim-water");
  const glass = root.querySelector("#sim-glass-svg");
  const mlLabel = root.querySelector("#sim-ml");
  const lapsLabel = root.querySelector("#sim-laps");
  const status = root.querySelector("#sim-status");
  const output = root.querySelector("#sim-output");
  const initialInput = root.querySelector("#sim-inicial");
  const forgetBox = root.querySelector("#sim-esqueceu");
  const nextButton = root.querySelector("#sim-next");
  const autoButton = root.querySelector("#sim-auto");
  const resetButton = root.querySelector("#sim-reset");
  const initLabel = root.querySelector("#sim-init");
  const bodyLine = root.querySelectorAll("#sim-code li[data-line='body']")[0];
  const codeLines = [...root.querySelectorAll("#sim-code li[data-line]")];
  const bodyLineHtml = bodyLine.innerHTML;
  const glassTop = 20;
  const glassBottom = 178;

  let ml = 0;
  let laps = 0;
  let next = "check";
  let conditionResult = false;
  let runToken = 0;
  let printed = [];

  const highlight = (line) => {
    for (const element of codeLines) {
      const active = element.dataset.line === line;
      element.classList.toggle("active", active);
      if (active) element.setAttribute("aria-current", "step");
      else element.removeAttribute("aria-current");
    }
  };

  const render = () => {
    const level = Math.min(ml, capacity) / capacity;
    const height = Math.round((glassBottom - glassTop) * level);
    water.setAttribute("y", String(glassBottom - height));
    water.setAttribute("height", String(height));
    mlLabel.textContent = `${ml} ml`;
    lapsLabel.textContent = `Voltas: ${laps}`;
    glass.setAttribute("aria-label", `Copo com ${ml} ml de água`);
    output.replaceChildren();
    if (printed.length === 0) {
      const empty = document.createElement("span");
      empty.className = "sim-output-empty";
      empty.textContent = "(nada foi mostrado ainda)";
      output.append(empty);
    }
    for (const line of printed) {
      const row = document.createElement("span");
      row.textContent = line;
      output.append(row);
    }
  };

  const updateBodyLine = () => {
    if (forgetBox.checked) {
      bodyLine.textContent = "    // ml += 100;   ← esquecemos esta linha!";
      bodyLine.classList.add("forgot");
    } else {
      bodyLine.innerHTML = bodyLineHtml;
      bodyLine.classList.remove("forgot");
    }
  };

  const setButtons = (running) => {
    const finished = next === "finished";
    nextButton.disabled = finished || running;
    autoButton.disabled = finished || running;
    initialInput.disabled = running;
    forgetBox.disabled = running;
  };

  const reset = () => {
    runToken += 1;
    const raw = initialInput.value.trim();
    const value = raw === "" ? Number.NaN : Number(raw);
    if (!Number.isInteger(value) || value < 0 || value > 400) {
      initialInput.setAttribute("aria-invalid", "true");
      status.textContent = "Escolha um número inteiro de 0 a 400 para a água inicial.";
      status.classList.add("input-error");
      initialInput.focus();
      return false;
    }
    initialInput.removeAttribute("aria-invalid");
    status.classList.remove("input-error");
    ml = value;
    laps = 0;
    next = "check";
    conditionResult = false;
    printed = [];
    initLabel.textContent = String(ml);
    updateBodyLine();
    highlight("init");
    render();
    setButtons(false);
    status.textContent = `A variável ml foi criada com o valor ${ml}: o copo começa com ${ml} ml. Clique em “Próximo passo”.`;
    return true;
  };

  const advance = () => {
    if (next === "check") {
      conditionResult = ml < capacity;
      highlight("check");
      if (conditionResult) {
        status.textContent = `Pergunta: ml < ${capacity}? Como ml vale ${ml}, a resposta é SIM. O programa entra no bloco.`;
        next = "body";
      } else {
        status.textContent = `Pergunta: ml < ${capacity}? Como ml vale ${ml}, a resposta é NÃO. O laço termina e o programa segue para a linha depois dele.`;
        next = "end";
      }
    } else if (next === "body") {
      laps += 1;
      highlight("body");
      if (!forgetBox.checked) ml += dose;
      printed.push(`Copo com ${ml} ml`);
      if (forgetBox.checked && laps >= maxForgetfulLaps) {
        status.textContent = `Volta ${laps}: como o ml += 100 foi esquecido, ml continua ${ml} e a pergunta sempre dá SIM. Isso é um laço infinito. Interrompi a simulação aqui; num programa real, ele travaria.`;
        status.classList.add("input-error");
        next = "finished";
      } else {
        status.classList.remove("input-error");
        status.textContent = forgetBox.checked
          ? `Volta ${laps}: o bloco rodou, mas ml continua ${ml}, porque a linha que despeja água foi esquecida. O programa volta para a pergunta.`
          : `Volta ${laps}: despejamos ${dose} ml, então ml agora vale ${ml}. O programa mostrou “Copo com ${ml} ml” e volta para a pergunta.`;
        next = "check";
      }
    } else if (next === "end") {
      highlight("end");
      printed.push("Copo cheio!");
      status.textContent = laps === 0
        ? "Fim. O laço não rodou nenhuma vez, porque a pergunta já começou com NÃO. Por isso o while pode não executar o bloco."
        : `Fim. O laço rodou ${laps} ${laps === 1 ? "vez" : "vezes"} e o programa mostrou “Copo cheio!”.`;
      next = "finished";
    }
    render();
    setButtons(false);
  };

  nextButton.addEventListener("click", advance);
  resetButton.addEventListener("click", reset);
  initialInput.addEventListener("change", reset);
  forgetBox.addEventListener("change", reset);
  autoButton.addEventListener("click", async () => {
    const token = ++runToken;
    setButtons(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 800;
    while (next !== "finished" && token === runToken) {
      advance();
      setButtons(true);
      if (delay) await new Promise((resolve) => window.setTimeout(resolve, delay));
    }
    if (token === runToken) setButtons(false);
  });
  reset();
}

setupWhileSimulator();

document.querySelector("#ano-atual").textContent = String(new Date().getFullYear());
updateProgress();
