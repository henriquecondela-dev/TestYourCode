// Página do desafio no telemóvel: separadores Problem/Code e a fila de teclas.
// No computador os elementos existem mas ficam escondidos pelo CSS.
(function () {
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const section = document.querySelector(".challenge-section");
    const textarea = document.getElementById("code");

    // 1) No telemóvel o tempo vai para a barra de cima (ao lado do Submit)
    //    e os participantes vão para a barra de baixo, junto ao "Your Status".
    if (mobile) {
        const topBar = document.getElementById("top-bar");
        const timer = document.getElementById("challenge-timer");
        topBar.insertBefore(timer, topBar.querySelector(".butons"));

        const participants = document.getElementById("participants-container");
        document.querySelector(".bottom-side").appendChild(participants);
    }

    // 2) Separadores Problem / Code
    const tabs = document.querySelectorAll("#m-tabs button");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.toggle("on", t === tab));
            section.classList.toggle("show-code", tab.dataset.tab === "code");
        });
    });

    // 3) Teclas que no teclado do telemóvel estão escondidas
    const PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"' };
    const keys = document.getElementById("m-keys");

    // pointerdown + preventDefault: o textarea não perde o foco,
    // por isso o teclado do telemóvel não fecha ao tocar numa tecla
    keys.addEventListener("pointerdown", (event) => {
        if (event.target.closest("button")) event.preventDefault();
    });

    keys.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button || textarea.disabled) return;

        const key = button.dataset.key;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (key === "tab") {
            textarea.setRangeText("    ", start, end, "end");
        } else if (PAIRS[key]) {
            // Abre e fecha logo, e põe o cursor no meio: ( | )
            const selected = textarea.value.slice(start, end);
            textarea.setRangeText(key + selected + PAIRS[key], start, end, "end");
            textarea.setSelectionRange(start + 1, start + 1 + selected.length);
        } else {
            textarea.setRangeText(key, start, end, "end");
        }

        textarea.focus();
        // Avisa o challenge.js para actualizar os números das linhas
        textarea.dispatchEvent(new Event("input"));
    });
})();
