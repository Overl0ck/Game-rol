// ------------------------------
// CLIENT.JS - Juego de Cartas Mejorado
// ------------------------------

// DOM
const zonaBatalla = document.getElementById('battlefield');
const cartasJugador = document.getElementById('cards-jugador');
const cartasIA = document.getElementById('cards-ia');
const log = document.getElementById('log');

console.log("DOM cargado correctamente");

// Crear botón de pasar turno
const pasarTurnoBtn = document.createElement('button');
pasarTurnoBtn.textContent = "Pasar Turno";
pasarTurnoBtn.style.display = 'none';
pasarTurnoBtn.id = 'pasarTurnoBtn';
cartasJugador.parentElement.appendChild(pasarTurnoBtn);
console.log("Botón de pasar turno creado");

// Contador de turnos
let turno = 1;
let cartasSeleccionadas = [];

// Datos de prueba: cartas del jugador y de la IA
const cartas = [
    { id: 1, name: "Espadachín", img: "img/cartas/espadachin.jpg", cost: 1, attack: 3, heal: 0 },
    { id: 2, name: "Curandero", img: "img/cartas/curandero.jpg", cost: 2, attack: 0, heal: 4 },
    { id: 3, name: "Arquero", img: "img/cartas/arquero.jpg", cost: 1, attack: 2, heal: 0 },
    { id: 4, name: "Guerrero", img: "img/cartas/guerrero.jpg", cost: 3, attack: 4, heal: 0 }
];

console.log("Cartas cargadas:", cartas);

// Función para crear cartas en la mano
function crearCarta(carta) {
    console.log("Creando carta:", carta.name);

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');
    const imgFront = document.createElement('img');
    imgFront.src = carta.img;
    front.appendChild(imgFront);

    const back = document.createElement('div');
    back.classList.add('card-back');
    const imgBack = document.createElement('img');
    imgBack.src = 'img/reverso.png';
    back.appendChild(imgBack);

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    cardContainer.appendChild(cardInner);

    // Efecto flip al hacer click
    cardInner.addEventListener('click', () => {
        console.log(`Carta clickeada: ${carta.name}`);
        // Solo permitir 2 cartas seleccionadas
        if (!cardInner.classList.contains('flip') && cartasSeleccionadas.length >= 2) {
            console.log("No se puede seleccionar más de 2 cartas");
            return;
        }

        cardInner.classList.toggle('flip');

        if (cardInner.classList.contains('flip')) {
            cartasSeleccionadas.push(carta);
            console.log("Carta seleccionada:", carta.name);
            log.innerHTML += `Has seleccionado ${carta.name}<br>`;
        } else {
            cartasSeleccionadas = cartasSeleccionadas.filter(c => c.id !== carta.id);
            console.log("Carta deseleccionada:", carta.name);
            log.innerHTML += `Has deseleccionado ${carta.name}<br>`;
        }

        log.scrollTop = log.scrollHeight;

        // Mostrar botón solo si se han seleccionado 2 cartas
        pasarTurnoBtn.style.display = (cartasSeleccionadas.length === 2) ? 'inline-block' : 'none';
        console.log("Cartas seleccionadas actualmente:", cartasSeleccionadas.map(c => c.name));
    });

    return cardContainer;
}

// Renderizar cartas del jugador
cartas.forEach(carta => {
    cartasJugador.appendChild(crearCarta(carta));
});
console.log("Cartas del jugador renderizadas");

// Renderizar cartas de la IA (solo reverso)
cartas.forEach(carta => {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');
    const imgFront = document.createElement('img');
    imgFront.src = 'img/cartas/reverso.jpg';
    front.appendChild(imgFront);

    const back = document.createElement('div');
    back.classList.add('card-back');
    const imgBack = document.createElement('img');
    imgBack.src = 'img/cartas/reverso.jpg';
    back.appendChild(imgBack);

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    cardContainer.appendChild(cardInner);
    cartasIA.appendChild(cardContainer);
});
console.log("Cartas de la IA renderizadas");

// Contador de turnos
const turnIndicator = document.getElementById('turnIndicator');
turnIndicator.textContent = `Turno: ${turno}`;
console.log("Contador de turnos inicializado");

// Función para pasar turno
pasarTurnoBtn.addEventListener('click', () => {
    console.log("Botón 'Pasar Turno' clickeado");

    log.innerHTML += `<strong>Turno ${turno} finalizado con ${cartasSeleccionadas.map(c => c.name).join(', ')}</strong><br>`;
    log.scrollTop = log.scrollHeight;

    // Reiniciar selección
    cartasSeleccionadas = [];
    pasarTurnoBtn.style.display = 'none';
    turno++;
    console.log("Turno incrementado:", turno);

    // Actualizar contador de turnos en pantalla
    turnIndicator.textContent = `Turno: ${turno}`;

    // Voltear cartas seleccionadas al inicio del siguiente turno
    document.querySelectorAll('.card-inner.flip').forEach(c => c.classList.remove('flip'));
    console.log("Cartas volteadas para nuevo turno");

    log.innerHTML += `<em>Turno ${turno} comienza</em><br>`;
    log.scrollTop = log.scrollHeight;
});
