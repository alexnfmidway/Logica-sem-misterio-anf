const progressKey = "logica-sem-misterio-progresso";
const completeButtons = [...document.querySelectorAll("[data-complete]")];
const progressCount = document.querySelector("#progress-count");

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey) || "[]");
    return Array.isArray(saved) ? saved.filter((item) => /^[1-7]$/.test(String(item))) : [];
  } catch (error) {
    console.warn("Não foi possível recuperar o progresso salvo.", error);
    return [];
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  } catch (error) {
    console.warn("Não foi possível salvar o progresso neste navegador.", error);
  }
}

function updateProgress() {
  const progress = readProgress();
  for (const button of completeButtons) {
    const done = progress.includes(button.dataset.complete);
    button.classList.toggle("done", done);
    button.setAttribute("aria-pressed", String(done));
    button.innerHTML = done
      ? "<span aria-hidden=\"true\">✓</span> Entendido — clique para desfazer"
      : "<span aria-hidden=\"true\">✓</span> Marcar como entendido";
  }
  progressCount.textContent = String(progress.length);
}

for (const button of completeButtons) {
  button.addEventListener("click", () => {
    const progress = readProgress();
    const id = button.dataset.complete;
    const next = progress.includes(id) ? progress.filter((item) => item !== id) : [...progress, id];
    saveProgress(next);
    updateProgress();
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#menu-principal");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("open", !isOpen);
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("open");
}));

const ageInput = document.querySelector("#idade-ingresso");
document.querySelector("#verificar-idade").addEventListener("click", () => {
  const age = ageInput.value.trim() === "" ? Number.NaN : Number(ageInput.value);
  const result = document.querySelector("#resultado-idade");
  if (!Number.isInteger(age) || age < 0 || age > 120) {
    result.textContent = "Digite uma idade válida entre 0 e 120.";
    result.classList.add("input-error");
    return;
  }
  result.classList.remove("input-error");
  result.textContent = age <= 12 ? "A pessoa paga meia-entrada 🎟️" : "A pessoa paga o ingresso inteiro 🎫";
});

document.querySelector("#iniciar-contagem").addEventListener("click", async (event) => {
  const input = document.querySelector("#numero-voltas");
  const output = document.querySelector("#resultado-voltas");
  const count = input.value.trim() === "" ? Number.NaN : Number(input.value);
  if (!Number.isInteger(count) || count < 1 || count > 12) {
    output.textContent = "Escolha um número de voltas entre 1 e 12.";
    output.classList.add("input-error");
    return;
  }
  output.classList.remove("input-error");
  const button = event.currentTarget;
  button.disabled = true;
  for (let turn = 1; turn <= count; turn += 1) {
    output.textContent = `Volta ${turn} de ${count} — repetindo a instrução...`;
    await new Promise((resolve) => window.setTimeout(resolve, 220));
  }
  output.textContent = `Laço encerrado: foram ${count} voltas.`;
  button.disabled = false;
});

document.querySelector("#calcular-media").addEventListener("click", () => {
  const fields = [...document.querySelectorAll(".nota-turma")];
  const grades = fields.map((field) => field.value.trim() === "" ? Number.NaN : Number(field.value));
  const result = document.querySelector("#resultado-media");
  if (grades.some((grade) => !Number.isFinite(grade) || grade < 0 || grade > 10)) {
    result.textContent = "Confira as notas: cada valor precisa estar entre 0 e 10.";
    result.classList.add("input-error");
    return;
  }
  const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  result.classList.remove("input-error");
  result.textContent = `A média é ${average.toFixed(2).replace(".", ",")}.`;
});

document.querySelectorAll(".quiz-card").forEach((card) => {
  const feedback = card.querySelector(".quiz-feedback");
  card.querySelectorAll(".quiz-options button").forEach((button) => {
    button.addEventListener("click", () => {
      card.querySelectorAll(".quiz-options button").forEach((option) => option.classList.remove("correct-answer", "wrong-answer"));
      const isCorrect = button.dataset.correct === "true";
      button.classList.add(isCorrect ? "correct-answer" : "wrong-answer");
      feedback.textContent = isCorrect
        ? "Isso mesmo! Você identificou a estrutura certa. ✨"
        : "Quase! Pense em qual estrutura combina com essa tarefa e tente outra vez.";
      feedback.className = `quiz-feedback ${isCorrect ? "good" : "try-again"}`;
    });
  });
});

const sections = [...document.querySelectorAll(".lesson-section")];
const sideLinks = [...document.querySelectorAll(".side-link")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        sideLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
      }
    }
  }, { rootMargin: "-20% 0px -65% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}

document.querySelector("#ano-atual").textContent = String(new Date().getFullYear());
updateProgress();
