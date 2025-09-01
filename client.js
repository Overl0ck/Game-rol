// client.js - CÓDIGO CORREGIDO

// Variables del DOM
const zonaBatalla = document.getElementById('battlefield');
const cartasJugador = document.getElementById('cards-jugador');
const cartasIA = document.getElementById('cards-ia');
const log = document.getElementById('log');
const turnIndicator = document.getElementById('turnIndicator');
const rondaSpan = document.getElementById('ronda');
const inventarioJugadorSpan = document.getElementById('inventario-jugador');
const inventarioIASpan = document.getElementById('inventario-ia');
const jugadorCardsUsedContainer = document.getElementById('jugadorCardsUsed');
const iaCardsUsedContainer = document.getElementById('iaCardsUsed');
const oroJugadorText = document.getElementById('oro-jugador-text');
const oroIAText = document.getElementById('oro-ia-text');

// Variables para barras de salud y energía
const saludJugadorBar = document.getElementById('salud-jugador-bar');
const saludIABar = document.getElementById('salud-ia-bar');
const saludJugadorText = document.getElementById('salud-jugador-text');
const saludIAText = document.getElementById('salud-ia-text');
const energiaJugadorBar = document.getElementById('energia-jugador-bar');
const energiaIABar = document.getElementById('energia-ia-bar');
const energiaJugadorText = document.getElementById('energia-jugador-text');
const energiaIAText = document.getElementById('energia-ia-text');
const tiendaPanel = document.getElementById('tiendaPanel');
const tiendaItemsContainer = document.getElementById('tiendaItems');
const cerrarTiendaBtn = document.getElementById('cerrarTiendaBtn');

const objetosTienda = [
    { nombre: "Espada Larga", costo: 5, tipo: "arma", descripcion: "Añade 2 de daño a tus ataques." },
    { nombre: "Poción Curación", costo: 3, tipo: "pocion", descripcion: "Restaura 5 de salud." },
    { nombre: "Anillo de Energía", costo: 8, tipo: "artefacto", descripcion: "Aumenta tu energía máxima en 1." },
];

// Variables para Game Over
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartButton = document.getElementById('restartButton');

// Jugadores y sus atributos
let jugador = { nombre: 'Tú', salud: 20, energia: 25, energiaMaxima: 45, oro: 10, inventario: [] };
let ia = { nombre: 'IA', salud: 20, energia: 25, energiaMaxima: 45, oro: 10, inventario: [] };

// Variables del juego
let numeroRonda = 1;
let cartasJugadasJugador = [];
let cartasJugadasIA = [];
let mazoJugador = [];
let mazoIA = [];

// Variables para el sistema de turnos
let esTurnoJugador = true;
const MAX_ACCIONES_POR_RONDA = 5;
let accionesJugador = MAX_ACCIONES_POR_RONDA;
let accionesIA = MAX_ACCIONES_POR_RONDA;

// Cartas disponibles
const cartasDisponibles = [
    { name: "La Tienda", description: "Puedes comprar armas y pociones.", image: "cartas/tienda.jpeg", type: "tienda", cost: 0 },
    { name: "El Sabio", description: "Obtienes experiencia suficiente para subir 1 nivel.", image: "cartas/sabio.jpeg", type: "accion", cost: 0 },
    { name: "La Visión", description: "Tienes una premonición sobre un evento importante.", image: "cartas/vision.jpeg", type: "accion", cost: 0 },
    { name: "El Troll Gigante", description: "Un Troll gigante te acecha.", image: "cartas/El Troll Gigante.jpeg", type: "ataque", cost: 3, damage: 5 },
    { name: "La Dama Oscura", description: "Una Dama Oscura te ataca.", image: "cartas/La Dama Oscura.jpeg", type: "ataque", cost: 2, damage: 4 },
    { name: "La Taberna", description: "Te emborrachas en una Taberna y pierdes salud.", image: "cartas/la taberna.jpeg", type: "accion", cost: 1 },
    { name: "La Loca", description: "Una mujer loca hace amenazas en un mercadillo.", image: "cartas/loca.jpeg", type: "accion", cost: 0 },
    { name: "La Visita", description: "La Muerte te visita.", image: "cartas/visita.jpeg", type: "accion", cost: 1 },
    { name: "El Duelo", description: "Un mercenario te reta a un Duelo", image: "cartas/duelo.jpeg", type: "ataque", cost: 1, damage: 3 },
    { name: "El Golem", description: "Un Golem te ataca", image: "cartas/El Golem.jpeg", type: "ataque", cost: 3, damage: 5 },
    { name: "Los Brujos", description: "Eres rodeado por un grupo de malvados Brujos", image: "cartas/brujos.jpeg", type: "ataque", cost: 2, damage: 4 },
    { name: "El Portal", description: "Te encuentras con un misterioso Portal ¿te atreves a entrar?", image: "cartas/portal.jpeg", type: "accion", cost: 1 },
    { name: "El Tiempo", description: "A partir de ahora, empieza a contar tu tiempo", image: "cartas/tiempo.jpeg", type: "accion", cost: 0 },
    { name: "Los Zombies", description: "Te encuentras con unos zombies...", image: "cartas/zombies.jpeg", type: "ataque", cost: 2, damage: 4 },
    { name: "El Caballero", description: "Un guerrero de alto nivel te jura lealtad.", image: "cartas/caballero.jpeg", type: "ataque", cost: 2, damage: 4 },
    { name: "Esqueleto Guerrero", description: "Un horrible lich se convierte en tu enemigo personal y te persigue.", image: "cartas/Esqueleto Guerrero.jpeg", type: "ataque", cost: 1, damage: 3 },
    { name: "El Banquete", description: "Disfrutas de un Banquete y recuperas salud.", image: "cartas/banquete.jpeg", type: "sanacion", cost: 2, heal: 5 },
    { name: "La Vampira", description: "Una Vampira te seduce y te muerde en el cuello. Pierdes salud", image: "cartas/vampira.jpeg", type: "ataque", cost: 2, damage: 3 },
];

// --- Funciones del juego ---

function barajarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function agregarLog(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}

function actualizarBarrasSalud() {
    const porcentajeJugador = Math.max(0, (jugador.salud / 20) * 100);
    const porcentajeIA = Math.max(0, (ia.salud / 20) * 100);
    
    if (saludJugadorBar) saludJugadorBar.style.width = porcentajeJugador + "%";
    if (saludIABar) saludIABar.style.width = porcentajeIA + "%";

    if (saludJugadorBar) saludJugadorBar.style.background = porcentajeJugador > 60 ? "linear-gradient(90deg, #4caf50, #2e7d32)" :
                                                   porcentajeJugador > 30 ? "linear-gradient(90deg, #FFC107, #FFA000)" :
                                                   "linear-gradient(90deg, #F44336, #D32F2F)";

    if (saludIABar) saludIABar.style.background = porcentajeIA > 60 ? "linear-gradient(90deg, #4caf50, #2e7d32)" :
                                                   porcentajeIA > 30 ? "linear-gradient(90deg, #FFC107, #FFA000)" :
                                                   "linear-gradient(90deg, #F44336, #D32F2F)";

    if (saludJugadorText) saludJugadorText.textContent = Math.max(0, jugador.salud);
    if (saludIAText) saludIAText.textContent = Math.max(0, ia.salud);
}

function actualizarBarrasEnergia() {
    const porcentajeJugador = Math.max(0, (jugador.energia / jugador.energiaMaxima) * 100);
    const porcentajeIA = Math.max(0, (ia.energia / ia.energiaMaxima) * 100);
    
    if (energiaJugadorBar) energiaJugadorBar.style.width = porcentajeJugador + "%";
    if (energiaIABar) energiaIABar.style.width = porcentajeIA + "%";
    
    if (energiaJugadorText) energiaJugadorText.textContent = Math.max(0, jugador.energia);
    if (energiaIAText) energiaIAText.textContent = Math.max(0, ia.energia);
}

function actualizarEstado() {
    inventarioJugadorSpan.textContent = jugador.inventario.join(', ') || 'Vacío';
    inventarioIASpan.textContent = ia.inventario.join(', ') || 'Vacío';
    oroJugadorText.textContent = jugador.oro;
    oroIAText.textContent = ia.oro;
    rondaSpan.textContent = numeroRonda;
    actualizarBarrasSalud();
    actualizarBarrasEnergia();
}

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

    const cardAttributes = document.createElement('div');
    cardAttributes.classList.add('card-attributes');

    if (carta.cost !== undefined) {
        const costElement = document.createElement('div');
        costElement.classList.add('card-cost');
        costElement.textContent = carta.cost;
        cardAttributes.appendChild(costElement);
    }

    if (carta.type === 'ataque' && carta.damage !== undefined) {
        const damageElement = document.createElement('div');
        damageElement.classList.add('card-damage');
        damageElement.textContent = carta.damage;
        cardAttributes.appendChild(damageElement);
    } else if (carta.type === 'sanacion' && carta.heal !== undefined) {
        const healElement = document.createElement('div');
        healElement.classList.add('card-heal');
        healElement.textContent = `+${carta.heal}`;
        cardAttributes.appendChild(healElement);
    }

    cardFront.appendChild(cardAttributes);
    
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

function actualizarCartasJugador(jugadorObj, mazo, contenedor, mostrar = true) {
    contenedor.innerHTML = '';
    if (!mostrar) return;

    mazo.forEach(carta => {
        const cartaHTML = crearCarta(carta);

        if (jugadorObj === jugador) {
            cartaHTML.addEventListener('click', () => {
                jugarCarta(carta, mazo, jugadorObj);
            });
        }
        contenedor.appendChild(cartaHTML);
    });
}

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

function jugarCarta(carta, mazo, jugadorObj) {
    if (jugadorObj === jugador && !esTurnoJugador) {
        agregarLog("No es tu turno. Por favor, espera.");
        return;
    }
    if (jugadorObj === ia && esTurnoJugador) {
        return;
    }

    const costo = carta.cost || 0;
    if (jugadorObj.energia < costo) {
        agregarLog(`${jugadorObj.nombre} no tiene suficiente energía para jugar ${carta.name}.`);
        if (jugadorObj === jugador) {
            cambiarTurno();
        }
        return;
    }

    // Resta la energía y actualiza las barras
    jugadorObj.energia -= costo;
    actualizarBarrasEnergia();

    // Muestra la carta en el campo de batalla
    zonaBatalla.innerHTML = '';
    const cartaHTML = crearCarta(carta);
    cartaHTML.querySelector('.card-inner').classList.add('flip');
    zonaBatalla.appendChild(cartaHTML);

    // Quita la carta del mazo del jugador
    const index = mazo.findIndex(c => c.name === carta.name);
    if (index > -1) mazo.splice(index, 1);

    agregarLog(`${jugadorObj.nombre} juega: ${carta.name}`);

    // Añade la carta a las cartas usadas
    if (jugadorObj === jugador) {
        cartasJugadasJugador.push(carta);
        actualizarCartasUsadas(cartasJugadasJugador, 'jugadorCardsUsed');
        accionesJugador--;
    } else {
        cartasJugadasIA.push(carta);
        actualizarCartasUsadas(cartasJugadasIA, 'iaCardsUsed');
        accionesIA--;
    }

    // Lógica de la carta según su tipo
    if (carta.type === 'ataque') {
        const objetivo = jugadorObj === jugador ? ia : jugador;
        const daño = carta.damage;
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
        const curacion = carta.heal;
        jugadorObj.salud = Math.min(20, jugadorObj.salud + curacion);
        zonaBatalla.classList.add('heal');
        setTimeout(() => zonaBatalla.classList.remove('heal'), 500);
        agregarLog(`${jugadorObj.nombre} se cura ${curacion} (Salud: ${jugadorObj.salud})`);
    } else if (carta.type === 'accion') {
        jugadorObj.inventario.push(carta.name);
        agregarLog(`${jugadorObj.nombre} obtiene: ${carta.name} (Inventario: ${jugadorObj.inventario.join(', ')})`);
    } else if (carta.type === 'tienda'){
        // Si el jugador humano usa la tienda
        if (jugadorObj === jugador) {
            agregarLog(`${jugadorObj.nombre} visita La Tienda.`);
            mostrarTienda(jugadorObj);
        } else {
            // La IA descarta la carta de la tienda, por ahora no la usa
            agregarLog(`${jugadorObj.nombre} descarta la carta de La Tienda.`);
        }
    }

    // Actualiza el estado y cambia el turno
    actualizarBarrasSalud();
    actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
    actualizarCartasJugador(ia, mazoIA, cartasIA, false);
    
    comprobarFinDeJuego();
    // Si el juego no ha terminado, pasa el turno
    if(jugador.salud > 0 && ia.salud > 0) {
        cambiarTurno();
    }
}


function mostrarTienda(jugadorActual) {
    tiendaItemsContainer.innerHTML = '';
    objetosTienda.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('tienda-item');
        itemDiv.innerHTML = `
            <h4>${item.nombre}</h4>
            <p>Costo: ${item.cost} Oro</p>
            <p>${item.descripcion}</p>
        `;
        itemDiv.addEventListener('click', () => {
            comprarObjeto(item, jugadorActual);
        });
        tiendaItemsContainer.appendChild(itemDiv);
    });
    tiendaPanel.classList.remove('hidden');
}

function comprarObjeto(item, jugadorActual) {
    if (jugadorActual.oro >= item.cost) {
        jugadorActual.oro -= item.cost;
        jugadorActual.inventario.push(item.nombre);
        agregarLog(`${jugadorActual.nombre} ha comprado ${item.nombre} por ${item.cost} de oro.`);
        tiendaPanel.classList.add('hidden');
        actualizarEstado();
    } else {
        agregarLog(`¡${jugadorActual.nombre} no tiene suficiente oro para comprar ${item.nombre} !`);
    }
}

cerrarTiendaBtn.addEventListener('click', () => {
    tiendaPanel.classList.add('hidden');
    // Vuelve a pasar el turno cuando la tienda se cierra
    cambiarTurno();
});

function cambiarTurno() {
    esTurnoJugador = !esTurnoJugador;
    
    if (esTurnoJugador) {
        turnIndicator.textContent = 'Tu turno';
        // Comprobar si la ronda ha terminado
        comprobarFinRonda();
    } else {
        turnIndicator.textContent = 'Turno IA';
        setTimeout(turnoIA, 800);
    }
}

// Nueva función auxiliar para que la IA elija una carta de ataque
function elegirCartaAtaqueIA() {
    // Encuentra todas las cartas de ataque en el mazo de la IA
    const cartasAtaque = mazoIA.filter(c => c.type === 'ataque');
    // Si hay cartas de ataque, elige una al azar de entre ellas
    if (cartasAtaque.length > 0) {
        return cartasAtaque[Math.floor(Math.random() * cartasAtaque.length)];
    }
    return null; // Si no hay cartas de ataque, devuelve null
}

// Nueva función auxiliar para que la IA elija una carta de sanación
function elegirCartaSanacionIA() {
    // Encuentra todas las cartas de sanación en el mazo de la IA
    const cartasSanacion = mazoIA.filter(c => c.type === 'sanacion');
    if (cartasSanacion.length > 0) {
        return cartasSanacion[Math.floor(Math.random() * cartasSanacion.length)];
    }
    return null;
}

// Turno IA
function turnoIA() {
    if (accionesIA <= 0) {
        esTurnoJugador = true;
        turnIndicator.textContent = 'Tu turno';
        comprobarFinRonda();
        return;
    }
    
    if (mazoIA.length === 0) {
        agregarLog('IA no tiene más cartas');
        accionesIA = 0;
        comprobarFinRonda();
        return;
    }

    let cartaIA = null;

    // Lógica de estrategia
    // 1. Si la IA tiene salud baja ( <= 5) y una carta de sanación
    const cartaSanacion = elegirCartaSanacionIA();
    if (ia.salud <= 5 && cartaSanacion) {
        cartaIA = cartaSanacion;
    } 
    // 2. Si el jugador tiene salud baja (<= 5) y la IA tiene una carta de ataque
    else if (jugador.salud <= 5) {
        const cartaAtaque = elegirCartaAtaqueIA();
        if (cartaAtaque) {
            cartaIA = cartaAtaque;
        }
    }
    // 3. Si la IA tiene salud alta (> 5) y tiene una carta de ataque
    else if (ia.salud > 5) {
        const cartaAtaque = elegirCartaAtaqueIA();
        if (cartaAtaque) {
            cartaIA = cartaAtaque;
        }
    }
    
    // 4. Si la IA tiene salud alta (> 5) y no tiene carta de ataque, pero sí de sanación
    if (!cartaIA && ia.salud > 5 && cartaSanacion) {
        cartaIA = cartaSanacion;
    }

    // 5. Si no se cumplió ninguna de las condiciones anteriores, juega una carta al azar
    if (!cartaIA) {
        cartaIA = mazoIA[Math.floor(Math.random() * mazoIA.length)];
    }

    jugarCarta(cartaIA, mazoIA, ia);
}

function recargarEnergiaAlInicioRonda() {
    jugador.energia = Math.min(jugador.energiaMaxima, jugador.energia + 1);
    ia.energia = Math.min(ia.energiaMaxima, ia.energia + 1);
    actualizarBarrasEnergia();
}

function repartirCartas() {
    const cartasBarajadas = barajarArray([...cartasDisponibles]);
    mazoJugador = cartasBarajadas.slice(0, 5);
    mazoIA = cartasBarajadas.slice(5, 10);
}

function comprobarFinRonda() {
    if (accionesJugador <= 0 && accionesIA <= 0) {
        numeroRonda++;
        log.innerHTML = '';
        cartasJugadasJugador = [];
        cartasJugadasIA = [];
        actualizarCartasUsadas(cartasJugadasJugador, 'jugadorCardsUsed');
        actualizarCartasUsadas(cartasJugadasIA, 'iaCardsUsed');
        agregarLog(`--- Comienza la ronda ${numeroRonda} ---`);
        jugador.oro += 2;
        ia.oro += 2;
        repartirCartas();
        recargarEnergiaAlInicioRonda();
        actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
        actualizarCartasJugador(ia, mazoIA, cartasIA, false);
        actualizarEstado();
        
        accionesJugador = MAX_ACCIONES_POR_RONDA;
        accionesIA = MAX_ACCIONES_POR_RONDA;
        esTurnoJugador = true;
        turnIndicator.textContent = 'Tu turno';
    }
}

function comprobarFinDeJuego() {
    if (jugador.salud <= 0) {
        gameOverMessage.textContent = "¡Has perdido! La IA ha ganado.";
        gameOverScreen.classList.remove('hidden');
    } else if (ia.salud <= 0) {
        gameOverMessage.textContent = "¡Felicidades! Has ganado el juego.";
        gameOverScreen.classList.remove('hidden');
    }
}

function reiniciarJuego() {
    jugador.salud = 20;
    jugador.energia = 25;
    jugador.energiaMaxima = 45;
    jugador.oro = 10;
    jugador.inventario = [];

    ia.salud = 20;
    ia.energia = 25;
    ia.energiaMaxima = 45;
    ia.oro = 10;
    ia.inventario = [];

    numeroRonda = 1;
    cartasJugadasJugador = [];
    cartasJugadasIA = [];
    mazoJugador = [];
    mazoIA = [];
    
    esTurnoJugador = true;
    accionesJugador = MAX_ACCIONES_POR_RONDA;
    accionesIA = MAX_ACCIONES_POR_RONDA;

    gameOverScreen.classList.add('hidden');
    log.innerHTML = '';
    
    repartirCartas();
    actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
    actualizarCartasJugador(ia, mazoIA, cartasIA, false);
    actualizarEstado();
    
    agregarLog("¡Juego reiniciado! Comienza la partida.");
}

// Event Listeners
restartButton.addEventListener('click', reiniciarJuego);

// Inicialización del juego
repartirCartas();
actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
actualizarCartasJugador(ia, mazoIA, cartasIA, false);
actualizarEstado();
agregarLog("¡Comienza el juego!");
turnIndicator.textContent = 'Tu turno';