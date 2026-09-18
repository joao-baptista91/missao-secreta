// Hash SHA-256 do código secreto (não fica escrito em texto simples no código-fonte).
// Gerado a partir do código real — quem inspecionar o ficheiro só vê esta sequência,
// não o código em si.
const CODIGO_HASH = "d896af65d5b6b01300e22d3778efe9dc777fcde29ff9a6f2dd04242a7b0367ac";

async function calcularHash(texto) {
    const dados = new TextEncoder().encode(texto);
    const bufferHash = await crypto.subtle.digest("SHA-256", dados);
    const bytes = Array.from(new Uint8Array(bufferHash));
    return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

let audioContext;

function iniciarSom() {

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

function tocarSom(tipo) {

    iniciarSom();

    const oscilador = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);

    const agora = audioContext.currentTime;

    if (tipo === "sucesso") {

        oscilador.type = "sine";

        oscilador.frequency.setValueAtTime(392, agora);
        oscilador.frequency.setValueAtTime(523, agora + 0.15);
        oscilador.frequency.setValueAtTime(659, agora + 0.3);
        oscilador.frequency.setValueAtTime(784, agora + 0.45);

        ganho.gain.setValueAtTime(0.25, agora);
        ganho.gain.exponentialRampToValueAtTime(0.01, agora + 1);

        oscilador.start(agora);
        oscilador.stop(agora + 1);

    } else {

        oscilador.type = "sawtooth";

        oscilador.frequency.setValueAtTime(180, agora);
        oscilador.frequency.exponentialRampToValueAtTime(80, agora + 0.3);

        ganho.gain.setValueAtTime(0.18, agora);
        ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.3);

        oscilador.start(agora);
        oscilador.stop(agora + 0.3);
    }
}

async function verificar() {

    const codigo = document.getElementById("codigo").value.trim();
    const resultado = document.getElementById("resultado");
    const erro = document.getElementById("erro");

    const hashIntroduzido = await calcularHash(codigo);

    if (hashIntroduzido === CODIGO_HASH) {

        tocarSom("sucesso");

        erro.textContent = "";
        resultado.style.display = "block";

        document.getElementById("codigo").style.display = "none";

        document.querySelector("button").style.display = "none";

        resultado.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } else {

        tocarSom("erro");

        resultado.style.display = "none";
        erro.textContent = "⚠️ Código incorreto. A missão permanece selada!";

        const campo = document.getElementById("codigo");

        campo.value = "";

        campo.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-10px)" },
                { transform: "translateX(10px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 400
            }
        );
    }
}

document.getElementById("codigo").addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            verificar();
        }

    }
);

const linkMapa = document.getElementById("linkMapa");

if (linkMapa) {
    linkMapa.addEventListener("click", function() {
        document.getElementById("mensagemFinal").style.display = "block";
    });
}
