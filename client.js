// ------------------------------
// CLIENT.JS - JUEGO CARTAS VS IA
// ------------------------------

// DOM
const zonaBatalla = document.getElementById('battlefield');
const cartasJugador = document.getElementById('cards-jugador');
const cartasIA = document.getElementById('cards-ia');
const log = document.getElementById('log');

const saludJugadorSpan = document.getElementById('salud-jugador');
const inventarioJugadorSpan = document.getElementById('inventario-jugador');
const saludIASpan = document.getElementById('salud-ia');
const inventarioIASpan = document.getElementById('inventario-ia');
const turnIndicator = document.getElementById('turnIndicator');
const rondaSpan = document.getElementById('ronda');

const jugadorCardsUsedContainer = document.getElementById('jugadorCardsUsed');
const iaCardsUsedContainer = document.getElementById('iaCardsUsed');

// Jugadores
let jugador = { nombre: 'Tú', salud: 20, energia: 5, inventario: [] };
let ia = { nombre: 'IA', salud: 20, energia: 5, inventario: [] };

// Número de ronda
let numeroRonda = 1;

// Cartas usadas por cada jugador
let cartasJugadasJugador = [];
let cartasJugadasIA = [];

// Cartas disponibles
const cartasDisponibles = [
  { name: "La Tienda", description: "Puedes comprar armas y pociones.", image: "cartas/tienda.jpeg", type: "accion" },
  { name: "El Sabio", description: "Obtienes experiencia suficiente para subir 1 nivel.", image: "cartas/sabio.jpeg", type: "accion" },
  { name: "El Caballero", description: "Un guerrero de alto nivel te jura lealtad.", image: "cartas/caballero.jpeg", type: "ataque" },
  { name: "Esqueleto Guerrero", description: "Un horrible lich se convierte en tu enemigo personal y te persigue.", image: "cartas/Esqueleto Guerrero.jpeg", type: "ataque" },
  { name: "La Visión", description: "Tienes una premonición sobre un evento importante.", image: "cartas/vision.jpeg", type: "accion" },
  { name: "El Troll Gigante", description: "Un Troll gigante te acecha.", image: "cartas/El Troll Gigante.jpeg", type: "ataque" },
  { name: "La Dama Oscura", description: "Una Dama Oscura te ataca.", image: "cartas/La Dama Oscura.jpeg", type: "ataque" },
  { name: "La Taberna", description: "Te emborrachas en una Taberna y pierdes salud.", image: "cartas/la taberna.jpeg", type: "accion" },
  { name: "El Banquete", description: "Disfrutas de un Banquete acompañado de una dama y recuperas salud.", image: "cartas/banquete.jpeg", type: "sanacion" },
  { name: "La Loca", description: "Una mujer loca hace amenazas en un mercadillo.", image: "cartas/loca.jpeg", type: "accion" },
  { name: "La Visita", description: "La Muerte te visita.", image: "cartas/visita.jpeg", type: "accion" },
  { name: "La Vampira", description: "Una Vampira te seduce y te muerde en el cuello. Pierdes salud", image: "cartas/vampira.jpeg", type: "ataque" },
  { name: "El Duelo", description: "Un mercenario te reta a un Duelo", image: "cartas/duelo.jpeg", type: "ataque" },
  { name: "El Golem", description: "Un Golem te ataca", image: "cartas/El Golem.jpeg", type: "ataque" },
  { name: "Los Brujos", description: "Eres rodeado por un grupo de malvados Brujos", image: "cartas/brujos.jpeg", type: "ataque" },
  { name: "El Portal", description: "Te encuentras con un misterioso Portal ¿te atreves a entrar?", image: "cartas/portal.jpeg", type: "accion" },
  { name: "El Tiempo", description: "A partir de ahora, empieza a contar tu tiempo", image: "cartas/tiempo.jpeg", type: "accion" },
  { name: "Los Zombies", description: "Te encuentras con unos zombies...", image: "cartas/zombies.jpeg", type: "ataque" }
];

// Función para barajar un array
function barajarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Función log
function agregarLog(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}

// Actualizar estado
function actualizarEstado() {
    saludJugadorSpan.textContent = jugador.salud;
    inventarioJugadorSpan.textContent = jugador.inventario.join(', ') || 'Vacío';
    saludIASpan.textContent = ia.salud;
    inventarioIASpan.textContent = ia.inventario.join(', ') || 'Vacío';
    rondaSpan.textContent = numeroRonda;
}

// Crear carta HTML
function crearCarta(carta) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    const imgFront = document.createElement('img');
    imgFront.src = carta.image;
    imgFront.title = carta.description;
    cardFront.appendChild(imgFront);

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const imgBack = document.createElement('img');
    imgBack.src = 'cartas/reverso.png';
    cardBack.appendChild(imgBack);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardContainer.appendChild(cardInner);

    return cardContainer;
}

// Actualizar cartas jugador
function actualizarCartasJugador(jugadorObj, mazo, contenedor, mostrar = true) {
    contenedor.innerHTML = '';
    if (!mostrar) return;

    mazo.forEach(carta => {
        const cartaHTML = crearCarta(carta);

        if (jugadorObj === jugador) {
            cartaHTML.addEventListener('click', () => {
                jugarCarta(carta, mazo, jugadorObj);
                setTimeout(turnoIA, 800);
            });
        }

        contenedor.appendChild(cartaHTML);
    });
}

// Función para actualizar panel de cartas usadas
function actualizarCartasUsadas(mazoUsadas, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = '';
    mazoUsadas.forEach(carta => {
        const img = document.createElement('img');
        img.src = carta.image;
        img.title = carta.name;
        contenedor.appendChild(img);
    });
}

// Jugar carta
function jugarCarta(carta, mazo, jugadorObj) {
    zonaBatalla.innerHTML = '';
    const cartaHTML = crearCarta(carta);
    cartaHTML.querySelector('.card-inner').classList.add('flip');
    zonaBatalla.appendChild(cartaHTML);

    const index = mazo.findIndex(c => c.name === carta.name);
    if (index > -1) mazo.splice(index, 1);

    agregarLog(`${jugadorObj.nombre} juega: ${carta.name}`);

    // Registrar cartas usadas
    if (jugadorObj === jugador) {
        cartasJugadasJugador.push(carta);
        actualizarCartasUsadas(cartasJugadasJugador, 'jugadorCardsUsed');
    } else {
        cartasJugadasIA.push(carta);
        actualizarCartasUsadas(cartasJugadasIA, 'iaCardsUsed');
    }

    if (carta.type === 'ataque') {
        const objetivo = jugadorObj === jugador ? ia : jugador;
        const daño = Math.floor(Math.random() * 5) + 1;
        objetivo.salud -= daño;

        if (jugadorObj === jugador) {
            zonaBatalla.classList.add('attack');
            document.getElementById('opponentZone').classList.add('damage');
            setTimeout(() => {
                zonaBatalla.classList.remove('attack');
                document.getElementById('opponentZone').classList.remove('damage');
            }, 300);
        } else {
            zonaBatalla.classList.add('attack');
            document.getElementById('playerZone').classList.add('damage');
            setTimeout(() => {
                zonaBatalla.classList.remove('attack');
                document.getElementById('playerZone').classList.remove('damage');
            }, 300);
        }

        agregarLog(`${objetivo.nombre} recibe ${daño} de daño (Salud: ${objetivo.salud})`);
    } else if (carta.type === 'sanacion') {
        const curacion = Math.floor(Math.random() * 5) + 1;
        jugadorObj.salud += curacion;
        zonaBatalla.classList.add('heal');
        setTimeout(() => zonaBatalla.classList.remove('heal'), 500);
        agregarLog(`${jugadorObj.nombre} se cura ${curacion} (Salud: ${jugadorObj.salud})`);
    } else if (carta.type === 'accion') {
        jugadorObj.inventario.push(carta.name);
        agregarLog(`${jugadorObj.nombre} obtiene: ${carta.name} (Inventario: ${jugadorObj.inventario.join(', ')})`);
    }

    actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
    actualizarCartasJugador(ia, mazoIA, cartasIA, false);
    actualizarEstado();

    comprobarFinRonda();
}

// Turno IA
function turnoIA() {
    if (mazoIA.length === 0) {
        agregarLog('IA no tiene más cartas');
        return;
    }
    turnIndicator.textContent = 'Turno IA';
    const cartaIA = mazoIA[Math.floor(Math.random() * mazoIA.length)];
    setTimeout(() => {
        jugarCarta(cartaIA, mazoIA, ia);
        turnIndicator.textContent = 'Tu turno';
    }, 600);
}

// Repartir cartas al inicio de cada ronda
let mazoJugador = [];
let mazoIA = [];

function repartirCartas() {
    const cartasBarajadas = barajarArray([...cartasDisponibles]);
    mazoJugador = cartasBarajadas.slice(0, 5);
    mazoIA = cartasBarajadas.slice(5, 10);
}

// Comprobar fin de ronda
function comprobarFinRonda() {
    if (mazoJugador.length === 0 && mazoIA.length === 0) {
        numeroRonda++;

        // Limpiar log
        log.innerHTML = '';

        // Limpiar cartas usadas
        cartasJugadasJugador = [];
        cartasJugadasIA = [];
        actualizarCartasUsadas(cartasJugadasJugador, 'jugadorCardsUsed');
        actualizarCartasUsadas(cartasJugadasIA, 'iaCardsUsed');

        agregarLog(`--- Comienza la ronda ${numeroRonda} ---`);
        repartirCartas();
        actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
        actualizarCartasJugador(ia, mazoIA, cartasIA, false);
        actualizarEstado();
    }
}

// Inicialización
repartirCartas();
actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
actualizarCartasJugador(ia, mazoIA, cartasIA, false);
actualizarEstado();
agregarLog("¡Comienza el juego!");
