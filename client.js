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
    { nombre: "Espada Larga", costo: 5, tipo: "arma", descripcion: "Añade 2 de daño a tus ataques.", imagen: "cartas/armas/espada.jpeg" },
    { nombre: "Poción Curación", costo: 3, tipo: "pocion", descripcion: "Restaura 5 de salud.", imagen: "cartas/armas/pocion.jpg" },
    { nombre: "Anillo de Energía", costo: 8, tipo: "artefacto", descripcion: "Aumenta tu energía máxima en 1.", imagen: "cartas/armas/anillo.jpg" },
];

// Variables para Game Over
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartButton = document.getElementById('restartButton');

// Jugadores y sus atributos
let jugador = { 
    nombre: 'Tú', 
    salud: 20, 
    saludMaxima: 20,
    energia: 25, 
    energiaMaxima: 45, 
    oro: 10, 
    inventario: [],
    xp: 0,
    nivel: 1
};

let ia = { 
    nombre: 'IA', 
    salud: 20, 
    saludMaxima: 20,
    energia: 25, 
    energiaMaxima: 45, 
    oro: 10, 
    inventario: [],
    xp: 0,
    nivel: 1
};


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
    { name: "La Taberna", description: "Te emborrachas en una Taberna y pierdes salud.", image: "cartas/la taberna.jpeg", type: "sanacion", cost: 1, heal: 3 },
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
    // Limpia el contenido del inventario del jugador
    inventarioJugadorSpan.innerHTML = ''; 
    
    // Muestra cada objeto del inventario con su imagen
    if (jugador.inventario.length > 0) {
        jugador.inventario.forEach((item, index) => {
            const itemImg = document.createElement('img');
            itemImg.src = item.imagen;
            itemImg.alt = item.nombre;
            itemImg.title = item.nombre + ': ' + item.descripcion; // Agrega un tooltip con la descripción
            itemImg.classList.add('inventario-item-mini'); // Añade una clase para el estilo
            inventarioJugadorSpan.appendChild(itemImg);

            // Si es un objeto "usables", añade el evento de clic
            if (item.tipo === 'pocion' || item.tipo === 'artefacto') {
                itemImg.addEventListener('click', () => {
                    usarObjeto(item, index, jugador);
                });
            }
        });
    } else {
        inventarioJugadorSpan.textContent = 'Vacío';
    }

    // El inventario de la IA también se actualiza para la consistencia
    inventarioIASpan.innerHTML = '';
    if (ia.inventario.length > 0) {
        ia.inventario.forEach(item => {
            const itemImg = document.createElement('img');
            itemImg.src = item.imagen;
            itemImg.alt = item.nombre;
            itemImg.title = item.nombre;
            itemImg.classList.add('inventario-item-mini');
            inventarioIASpan.appendChild(itemImg);
        });
    } else {
        inventarioIASpan.textContent = 'Vacío';
    }

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
        let dañoTotal = daño;

        // Aplica el daño extra de la espada si el jugador la tiene.
        if (jugadorObj === jugador && jugador.inventario.some(item => item.tipo === 'arma')) {
            dañoTotal += 2; // El daño extra de la Espada Larga
            agregarLog("¡Tu Espada Larga añade 2 de daño extra!");
        }

        objetivo.salud -= dañoTotal;

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
        agregarLog(`${objetivo.nombre} recibe ${dañoTotal} de daño (Salud: ${objetivo.salud})`);
    } else if (carta.type === 'sanacion') {
        const curacion = carta.heal;
        jugadorObj.salud = Math.min(20, jugadorObj.salud + curacion);
        zonaBatalla.classList.add('heal');
        setTimeout(() => zonaBatalla.classList.remove('heal'), 500);
        agregarLog(`${jugadorObj.nombre} se cura ${curacion} (Salud: ${jugadorObj.salud})`);
    } else if (carta.type === 'accion') {
        // Lógica de acción para cartas que no se añaden al inventario.
        if (carta.name === "El Sabio") {
        ganarXP(jugadorObj, 20); // suficiente para subir un nivel
    } else {
        agregarLog(`${jugadorObj.nombre} usa la carta de ${carta.name}.`);
    }
  
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

function ganarXP(jugadorObj, cantidad) {
    jugadorObj.xp += cantidad;
    agregarLog(`${jugadorObj.nombre} gana ${cantidad} XP (Total: ${jugadorObj.xp}).`);

    // Fórmula para siguiente nivel
    let xpNecesaria = jugadorObj.nivel * 20;

    while (jugadorObj.xp >= xpNecesaria) {
        jugadorObj.xp -= xpNecesaria;
        jugadorObj.nivel++;
        agregarLog(`🎉 ${jugadorObj.nombre} sube a nivel ${jugadorObj.nivel}!`);

        // Bonificaciones por nivel
        jugadorObj.saludMaxima += 2;
        jugadorObj.salud = jugadorObj.saludMaxima; // se cura al subir
        jugadorObj.energiaMaxima += 1;

        // Actualizar barras
        actualizarBarrasSalud();
        actualizarBarrasEnergia();
        actualizarNivelXP();


        xpNecesaria = jugadorObj.nivel * 20;
    }
}

function actualizarNivelXP() {
    document.getElementById("nivel-jugador").textContent = jugador.nivel;
    document.getElementById("xp-jugador").textContent = jugador.xp;

    document.getElementById("nivel-ia").textContent = ia.nivel;
    document.getElementById("xp-ia").textContent = ia.xp;
}




function mostrarTienda(jugadorActual) {
    tiendaItemsContainer.innerHTML = '';
    objetosTienda.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('tienda-item');
        itemDiv.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <p>${item.descripcion}</p>
                <p class="item-costo">Costo: ${item.costo} Oro</p>
            </div>
        `;
        itemDiv.addEventListener('click', () => {
            comprarObjeto(item, jugadorActual);
        });
        tiendaItemsContainer.appendChild(itemDiv);
    });
    tiendaPanel.classList.remove('hidden');
}

function comprarObjeto(item, jugadorActual) {
    if (jugadorActual.oro >= item.costo) {
        jugadorActual.oro -= item.costo;
        jugadorActual.inventario.push(item);
        agregarLog(`${jugadorActual.nombre} ha comprado ${item.nombre} por ${item.costo} de oro.`);
        
        // Si el jugador que compra es la IA, consume una acción
        if (jugadorActual === ia) {
            accionesIA--;
        }
        
        tiendaPanel.classList.add('hidden');
        actualizarEstado();
    } else {
        agregarLog(`¡${jugadorActual.nombre} no tiene suficiente oro para comprar ${item.nombre}!`);
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

// Nueva función para usar objetos del inventario
function usarObjeto(item, index, jugadorActual) {
    if (!esTurnoJugador) {
        agregarLog("No es tu turno para usar un objeto.");
        return;
    }
    
    // Lógica del efecto según el tipo de objeto
    if (item.tipo === 'pocion') {
        const curacion = 5;
        jugadorActual.salud = Math.min(20, jugadorActual.salud + curacion);
        agregarLog(`${jugadorActual.nombre} usa una ${item.nombre} y se cura ${curacion} de salud.`);
        // Elimina la poción del inventario
        jugadorActual.inventario.splice(index, 1);

    } else if (item.tipo === 'artefacto') {
        jugadorActual.energiaMaxima += 1;
        jugadorActual.energia = jugadorActual.energiaMaxima;
        agregarLog(`${jugadorActual.nombre} usa un ${item.nombre} y su energía máxima aumenta a ${jugadorActual.energiaMaxima}.`);
        // Elimina el anillo del inventario
        jugadorActual.inventario.splice(index, 1);
    }
    
    // Al usar un objeto, se gasta una acción.
    accionesJugador--;
    actualizarEstado();
    cambiarTurno();
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
    
    // Prioridad 1: Usar objetos del inventario si es necesario
    const pocionInventarioIA = ia.inventario.find(o => o.nombre === "Poción Curación");
    if (ia.salud <= 5 && pocionInventarioIA) {
        usarObjetoIA(pociónInventarioIA, ia);
        setTimeout(turnoIA, 800);
        return;
    }

    const anilloInventarioIA = ia.inventario.find(o => o.nombre === "Anillo de Energía");
    if (ia.salud < 10 && anilloInventarioIA) { // El anillo ahora se usa si la salud es baja, lo que es más probable.
        usarObjetoIA(anilloInventarioIA, ia);
        setTimeout(turnoIA, 800);
        return;
    }

    // Prioridad 2: Jugar cartas
    let cartaAI = null;
    const cartaSanacion = elegirCartaSanacionIA();
    const cartaAtaque = elegirCartaAtaqueIA();

    if (ia.salud <= 5 && cartaSanacion) {
        cartaAI = cartaSanacion;
    } else if (jugador.salud <= 5 && cartaAtaque) {
        cartaAI = cartaAtaque;
    } else if (ia.salud > 5 && cartaAtaque) {
        cartaAI = cartaAtaque;
    } else if (cartaSanacion) {
        cartaAI = cartaSanacion;
    } else if (mazoIA.length > 0) {
        cartaAI = mazoIA[Math.floor(Math.random() * mazoIA.length)];
    }

    if (cartaAI) {
        jugarCarta(cartaAI, mazoIA, ia);
        setTimeout(turnoIA, 800);
        return;
    }

    // Prioridad 3: Comprar objetos si no quedan acciones o si no hay cartas válidas para jugar
    // Si la IA no puede jugar cartas, intentará comprar.
    if (!cartaAI || accionesIA > 1) {
        const pocionCuracionTienda = objetosTienda.find(o => o.nombre === "Poción Curación");
        if (ia.salud <= 10 && ia.oro >= pocionCuracionTienda.costo && !ia.inventario.some(o => o.nombre === pocionCuracionTienda.nombre)) {
            comprarObjeto(pociónCuracionTienda, ia);
            setTimeout(turnoIA, 800);
            return;
        }

        const anilloEnergiaTienda = objetosTienda.find(o => o.nombre === "Anillo de Energía");
        if (ia.oro >= anilloEnergiaTienda.costo && ia.energiaMaxima <= jugador.energiaMaxima && !ia.inventario.some(o => o.nombre === anilloEnergiaTienda.nombre)) {
            comprarObjeto(anilloEnergiaTienda, ia);
            setTimeout(turnoIA, 800);
            return;
        }
    }

    // Acción de respaldo para evitar bloqueos
    agregarLog("La IA no puede realizar más acciones válidas. Termina su turno.");
    accionesIA = 0;
    esTurnoJugador = true;
    turnIndicator.textContent = 'Tu turno';
    comprobarFinRonda();
}

// Nueva función para usar objetos del inventario para la IA
function usarObjetoIA(item, jugadorActual) {
    const index = jugadorActual.inventario.findIndex(o => o.nombre === item.nombre);
    if (index === -1) return; // Objeto no encontrado.

    // Lógica del efecto
    if (item.tipo === 'pocion') {
        const curacion = 5;
        jugadorActual.salud = Math.min(20, jugadorActual.salud + curacion);
        agregarLog(`${jugadorActual.nombre} usa una ${item.nombre} de su inventario y se cura ${curacion} de salud.`);
        jugadorActual.inventario.splice(index, 1);
    } else if (item.tipo === 'artefacto') {
        jugadorActual.energiaMaxima += 1;
        jugadorActual.energia = jugadorActual.energiaMaxima;
        agregarLog(`${jugadorActual.nombre} usa un ${item.nombre} de su inventario. Su energía máxima aumenta a ${jugadorActual.energiaMaxima}.`);
        jugadorActual.inventario.splice(index, 1);
    } else if (item.tipo === 'arma') {
        // La IA ya tiene el efecto pasivo, así que no necesita "usar" la espada.
    }
    
    accionesIA--;
    actualizarEstado();
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
 if (jugador.salud <= 0 || ia.salud <= 0) {
        if (jugador.salud <= 0 && ia.salud <= 0) {
            gameOverMessage.textContent = "¡Es un empate!";
        } else if (jugador.salud <= 0) {
            gameOverMessage.textContent = "¡Has perdido contra la IA!";
            ganarXP(ia, 30);
        } else if (ia.salud <= 0) {
            gameOverMessage.textContent = "¡Has ganado contra la IA!";
            ganarXP(jugador, 30);
        }
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
    
    actualizarNivelXP();
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