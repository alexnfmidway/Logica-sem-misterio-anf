const progressKey = "logica-sem-misterio-progresso";
const lastChapterKey = "logica-sem-misterio-ultimo-capitulo";
const lessonSections = [...document.querySelectorAll(".lesson-section")];
const completeButtons = [...document.querySelectorAll("[data-complete]")];
const sideLinks = [...document.querySelectorAll(".side-link")];
const progressCount = document.querySelector("#progress-count");
const readingProgress = document.querySelector("#reading-progress");
const readingLabel = document.querySelector("#reading-label");
const continueReading = document.querySelector("#continue-reading");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#menu-principal");
let progressCache = [];
let storageAvailable = true;

const chapterChallenges = [
  { prompt: "Descreva em três passos uma tarefa cotidiana e indique qual é o resultado esperado.", answer: "Uma boa resposta tem instruções ordenadas, sem depender de adivinhações. Por exemplo: separar os ingredientes, misturá-los e servir o resultado." },
  { prompt: "Uma viagem durou 3 horas. Quantos minutos durou? Escreva a entrada, a regra e a saída.", answer: "Entrada: 3 horas. Regra: multiplicar por 60. Saída: 180 minutos." },
  { prompt: "Uma pontuação começa em 10 e recebe mais 5 pontos. Que tipo de dado pode guardá-la e qual valor fica ao final?", answer: "Use uma variável inteira, por exemplo int pontuacao = 10; depois pontuacao += 5;. O valor final é 15." },
  { prompt: "Um ingresso custa R$ 18,00. Calcule o custo de 4 ingressos e indique entradas e saída.", answer: "O processamento é 18 × 4, portanto a saída é R$ 72,00. Em C#, decimal é adequado para valores monetários." },
  { prompt: "Sem executar, calcule 5 + 2 * 3. Qual operação acontece primeiro?", answer: "A multiplicação vem primeiro: 2 × 3 = 6; depois 5 + 6 = 11." },
  { prompt: "Reescreva 18 / 3 + 2 * 5 para que o resultado seja 40.", answer: "Agrupe primeiro a soma: (18 / 3 + 2) * 5. O resultado é (6 + 2) × 5 = 40." },
  { prompt: "Uma pessoa tem 12 anos. Se a regra de meia-entrada é idade menor ou igual a 12, qual caminho deve ser escolhido?", answer: "A condição idade <= 12 é verdadeira para 12. O programa deve escolher o caminho da meia-entrada." },
  { prompt: "Como testar se uma nota está fora do intervalo de 0 a 10? E como combinar senha correta e conta ativa?", answer: "Nota inválida: nota < 0 || nota > 10. Acesso permitido somente com ambas verdadeiras: senhaCorreta && contaAtiva." },
  { prompt: "O saldo começa em 25 e você retira 10 enquanto houver pelo menos 10. Quais saldos aparecem?", answer: "A sequência é 15 e 5. Na próxima verificação, 5 >= 10 é falso e o laço termina." },
  { prompt: "Use um contador e acumulador para somar os números de 1 a 4. Qual resultado final deve aparecer?", answer: "As somas parciais são 1, 3, 6 e 10. O acumulador começa em zero e recebe cada novo valor." },
  { prompt: "No vetor { 8, 7, 9, 6 }, qual índice guarda 9? Qual é a soma dos valores?", answer: "O valor 9 está no índice 2. A soma é 8 + 7 + 9 + 6 = 30." },
  { prompt: "Na matriz do capítulo, qual valor está em lugares[0, 2]?", answer: "A linha 0 contém 1, 2 e 3. Na coluna 2 está o valor 3." },
  { prompt: "Que parâmetro e retorno teria uma função que calcula a área de um retângulo?", answer: "Ela recebe largura e altura como parâmetros e retorna largura * altura. Em C#, pode retornar double." },
  { prompt: "Divida o cálculo do saldo mensal em pelo menos três responsabilidades nomeadas.", answer: "Uma decomposição possível: somar receitas, somar despesas e calcular/mostrar o saldo. Cada tarefa pode virar uma função." },
  { prompt: "Além de um caso comum, quais dois casos importantes testar em um cálculo de média de notas entre 0 e 10?", answer: "Teste valores nos limites (0 e 10) e uma entrada inválida, como nota negativa ou acima de 10. Compare cada resultado ao esperado." },
  { prompt: "Qual instrução C# mostra uma variável chamada total na tela?", answer: "Use Console.WriteLine(total);. A lógica define o que calcular; essa instrução é a forma C# de exibir o valor." },
  { prompt: "Proponha três testes para o projeto final: um saldo positivo, um negativo e um zerado.", answer: "Com receitas 100 e despesas 70, saldo 30 positivo; receitas 50 e despesas 80, saldo -30 negativo; receitas e despesas 50, saldo zero." }
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
  "Distinguir laços que testam a condição antes ou depois de executar.",
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
  readingLabel.textContent = `${progress.length} de ${completeButtons.length} capítulos concluídos`;
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

function setResumeLink(chapterId) {
  const section = lessonSections.find((item) => item.id === chapterId);
  if (!section || !continueReading) return;
  continueReading.href = `#${section.id}`;
  continueReading.textContent = `Continuar: ${section.querySelector("h2").textContent}`;
}

const lastChapter = readStoredValue(lastChapterKey, "fundamentos");
setResumeLink(lastChapter);

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
  const completeButton = section.querySelector("[data-complete]");
  if (!challenge || !completeButton) continue;

  const wrapper = document.createElement("details");
  wrapper.className = "chapter-challenge";
  const summary = document.createElement("summary");
  summary.textContent = `Desafio do capítulo ${String(number).padStart(2, "0")}`;
  const prompt = document.createElement("p");
  prompt.textContent = challenge.prompt;
  const reveal = document.createElement("button");
  reveal.type = "button";
  reveal.className = "reveal-answer";
  reveal.textContent = "Ver uma resposta comentada";
  reveal.setAttribute("aria-expanded", "false");
  const answer = document.createElement("p");
  answer.className = "challenge-answer";
  answer.id = `challenge-answer-${number}`;
  answer.textContent = challenge.answer;
  answer.hidden = true;
  reveal.setAttribute("aria-controls", answer.id);
  reveal.addEventListener("click", () => {
    answer.hidden = !answer.hidden;
    reveal.setAttribute("aria-expanded", String(!answer.hidden));
    reveal.textContent = answer.hidden ? "Ver uma resposta comentada" : "Ocultar resposta";
  });
  wrapper.append(summary, prompt, reveal, answer);
  completeButton.before(wrapper);
}

const csharpKeywords = new Set([
  "bool", "break", "const", "decimal", "double", "else", "false", "for",
  "if", "int", "return", "static", "string", "true", "while"
]);
const csharpTokenPattern = /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|\b(?:bool|break|const|decimal|double|else|false|for|if|int|return|static|string|true|while)\b|\b\d+(?:\.\d+)?m?\b|==|!=|<=|>=|&&|\|\||\+=|-=|[{}()[\].,;:+*/%=<>!&|?-])/g;

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
  button.setAttribute("aria-label", "Copiar exemplo de código");
  const header = codeBlock.closest(".code-example").querySelector(".code-heading");
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

document.querySelectorAll(".quiz-card").forEach((card) => {
  const feedback = card.querySelector(".quiz-feedback");
  card.querySelectorAll(".quiz-options button").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
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

document.querySelector("#ano-atual").textContent = String(new Date().getFullYear());
updateProgress();
