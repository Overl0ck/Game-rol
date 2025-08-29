let manoJugador = [];
let manoIA = [];
let cartaCampoJugador = null;
let cartaCampoIA = null;
let marcador = {jugador:0, ia:0, empates:0};

const manoJugadorDiv = document.getElementById("manoJugador");
const manoIADiv = document.getElementById("manoIA");
const campoJugadorDiv = document.getElementById("campoJugador");
const campoIADiv = document.getElementById("campoIA");
const descarteDiv = document.getElementById("descarte");

function robarCarta() {
    if (mazoJugador.length > 0) {
        const carta = mazoJugador.shift();
        manoJugador.push(carta);
        actualizarMano();
    }
    if (mazoIA.length > 0) {
        const carta = mazoIA.shift();
        manoIA.push(carta);
    }
}

function actualizarMano() {
    manoJugadorDiv.innerHTML = "";
    manoJugador.forEach((carta, idx) => {
        const cartaDiv = crearCartaVisual(carta);
        cartaDiv.addEventListener("click", () => jugarCarta(idx));
        manoJugadorDiv.appendChild(cartaDiv);
    });
}

function jugarCarta(idx) {
    if (cartaCampoJugador) return; // Esperando turno IA
    cartaCampoJugador = manoJugador.splice(idx,1)[0];
    cartaCampoIA = manoIA.shift(); // IA juega automáticamente
    resolverTurno();
}
