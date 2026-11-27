const TEMA_GUARDADO = "tema";

function aplicarTema(tema) {
    if (tema === "escuro") {
        document.documentElement.setAttribute("data-tema", "escuro");
    } else {
        document.documentElement.removeAttribute("data-tema");
    }
}
function lerTema() {
    try {
        return localStorage.getItem(TEMA_GUARDADO);
    } catch (error) {
        return null;
    }
}
function guardarTema(tema) {
    try {
        localStorage.setItem(TEMA_GUARDADO, tema);
    } catch (error) {
        console.error("ERRO: was not possible to save the theme", error.message);
    }
}
aplicarTema(lerTema());

document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("tema-btn");
    if (!botao) return;
    function actualizarBotao() {
        const escuro = document.documentElement.getAttribute("data-tema") === "escuro";
        const portugues = document.documentElement.lang === "pt";
        botao.textContent = escuro ? "☀" : "☾";
        if (portugues) {
            botao.title = escuro ? "Modo claro" : "Modo escuro";
        } else {
            botao.title = escuro ? "Light mode" : "Dark mode";
        }
    }
    actualizarBotao();
    botao.addEventListener("click", () => {
        const escuro = document.documentElement.getAttribute("data-tema") === "escuro";
        const novoTema = escuro ? "claro" : "escuro";
        aplicarTema(novoTema);
        guardarTema(novoTema);
        actualizarBotao();
    });
});
