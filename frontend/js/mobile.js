// Extras do Dashboard só para o telemóvel.
// O CSS (mobile.css) é que decide quando isto aparece; aqui só se cria o conteúdo.
import { getMyGroups } from "../data/mygroups.js";

// 1) Botões no lugar dos <select> (Difficulty, Category, Language).
//    O <select> continua lá, escondido: o index.js lê o .value dele como sempre.
function chipsFor(select, { order = null, segmented = false } = {}) {
    const box = document.createElement("div");
    box.classList.add("m-chips");
    if (segmented) box.classList.add("m-seg");

    let options = [...select.options];
    if (order) {
        options.sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value));
    }
    options.forEach(option => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.textContent = option.textContent;
        chip.dataset.value = option.value;
        chip.addEventListener("click", () => {
            if (select.disabled) return;
            select.value = option.value;
            select.dispatchEvent(new Event("change"));
            paint();
        });
        box.appendChild(chip);
    });

    function paint() {
        box.querySelectorAll("button").forEach(chip => {
            chip.classList.toggle("on", chip.dataset.value === select.value);
            chip.disabled = select.disabled;
        });
    }

    // Quando o index.js bloqueia o select (depois de gerar o problema), bloqueia os botões também
    new MutationObserver(paint).observe(select, { attributes: true, attributeFilter: ["disabled"] });
    select.addEventListener("change", paint);

    select.classList.add("has-chips");
    select.after(box);
    paint();
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;

chipsFor(document.getElementById("difficulty"), { segmented: true });
chipsFor(document.getElementById("category"));
chipsFor(document.getElementById("language"), {
    order: ["JAVA", "PHYTON", "C", "CPP", "JAVASCRIPT", "C_CHARP"]
});

// 1b) Painel "Challenge settings" igual ao mockup (só no telemóvel)
if (isMobile) setupStartSheet();

function setupStartSheet() {
    const settings = document.getElementById("start-settings-modal");
    const fields = settings.querySelectorAll(".field");
    const [timeField, difficultyField, categoryField, languageField, modeField] = fields;

    // Títulos curtos
    settings.querySelector(".headLink").textContent = "Challenge settings";
    timeField.querySelector(".link").textContent = "Time";
    difficultyField.querySelector(".link").textContent = "Difficulty";
    categoryField.querySelector(".link").textContent = "Category";
    languageField.querySelector(".link").textContent = "Language";
    modeField.querySelector(".link").textContent = "Mode";
    modeField.querySelector('input[value="NORMAL"] + span').textContent = "Normal (AI)";

    // Mode passa a ser o primeiro campo (logo a seguir ao título)
    settings.querySelector(".headLink").after(modeField);

    // Tempo: cada caixa com o nome por baixo (hours / min / sec)
    [["hours", "hours"], ["minutes", "min"], ["seconds", "sec"]].forEach(([id, unit]) => {
        const input = document.getElementById(id);
        const box = document.createElement("div");
        box.classList.add("m-time-box");
        const label = document.createElement("small");
        label.classList.add("m-unit");
        label.textContent = unit;
        input.before(box);
        box.append(input, label);
    });

    // Barra de passos (1 · 2 · 3) no topo de cada passo
    ["start-modal", "start-settings-modal", "start-summary-modal"].forEach((id, index) => {
        const modal = document.getElementById(id);
        const steps = document.createElement("div");
        steps.classList.add("m-steps");
        for (let i = 0; i < 3; i++) {
            const bar = document.createElement("i");
            if (i <= index) bar.classList.add("on");
            steps.appendChild(bar);
        }
        modal.querySelector(".headLink").before(steps);
    });

    // Sem o botão "Generate Problem": o Next gera o problema e só depois avança
    const generateBtn = document.getElementById("generateProblem-btn");
    const nextBtn = document.getElementById("next2-btn");
    settings.addEventListener("click", (event) => {
        if (!event.target.closest("#next2-btn")) return;
        if (generateBtn.classList.contains("genarated")) return; // já gerado: segue normal
        if (nextBtn.classList.contains("waiting")) {
            event.stopPropagation();
            return;
        }
        // Pára o clique aqui (fase de captura) para o index.js não ver o Next ainda
        event.stopPropagation();
        nextBtn.classList.add("waiting");
        nextBtn.textContent = "Generating...";
        generateBtn.click();

        const check = setInterval(() => {
            const ready = generateBtn.classList.contains("genarated");
            const failed = !ready && !generateBtn.classList.contains("spinning");
            if (ready || failed) {
                clearInterval(check);
                nextBtn.classList.remove("waiting");
                nextBtn.textContent = "Next";
                if (ready) nextBtn.click();
            }
        }, 300);
    }, true);

    // Tocar fora do painel (na parte escura) fecha-o
    ["creat-overlay", "join-overlay", "start-overlay"].forEach(id => {
        const overlay = document.getElementById(id);
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) overlay.style.display = "none";
        });
    });
}

// 2) Lista "My groups" (os grupos que tu criaste)
const list = document.getElementById("m-groups-list");
const count = document.getElementById("m-groups-count");

async function loadMyGroups() {
    if (!list) return;
    const groups = await getMyGroups();
    list.innerHTML = "";

    if (!groups || groups.length === 0) {
        const empty = document.createElement("p");
        empty.classList.add("m-groups-empty");
        empty.textContent = "You haven't created any group yet.";
        list.appendChild(empty);
        count.textContent = "0";
        return;
    }

    count.textContent = groups.length;
    groups.forEach(group => {
        const card = document.createElement("div");
        card.classList.add("m-group");

        const name = document.createElement("b");
        name.textContent = group.name;

        const info = document.createElement("small");
        const members = group.members ?? group._count?.member ?? 0;
        const challenges = group.challenges ?? group._count?.challenges ?? 0;
        info.textContent = `${members} member${members === 1 ? "" : "s"} · ${challenges} challenge${challenges === 1 ? "" : "s"}`;

        card.append(name, info);
        // Tocar num grupo abre o "Start a challenge"
        card.addEventListener("click", () => {
            document.getElementById("startGroup-btn").click();
        });
        list.appendChild(card);
    });
}

loadMyGroups();

// Depois de criar um grupo, actualiza a lista
document.getElementById("creatgroup-btn")?.addEventListener("click", () => {
    setTimeout(loadMyGroups, 1500);
});
