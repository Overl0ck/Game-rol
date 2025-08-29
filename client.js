// ------------------------------
// CLIENT.JS - JUEGO CARTAS VS IA MEJORADO
// ------------------------------

// DOM
const zonaBatalla = document.querySelector('#zona-batalla .cartas');
const cartasJugador = document.getElementById('cartas-jugador');
const cartasIA = document.getElementById('cartas-ia');
const log = document.getElementById('log');

const saludJugadorSpan = document.getElementById('salud-jugador');
const inventarioJugadorSpan = document.getElementById('inventario-jugador');
const saludIASpan = document.getElementById('salud-ia');
const inventarioIASpan = document.getElementById('inventario-ia');

// Jugadores
let jugador = { nombre: 'Tú', salud: 20, energia: 5, inventario: [] };
let ia = { nombre: 'IA', salud: 20, energia: 5, inventario: [] };

const cartasDisponibles = [
  { name: "La Tienda", description: "Puedes comprar armas y pociones.", image: "cartas/tienda.jpeg", type: "accion" },
  { name: "El Sabio", description: "Obtienes experiencia suficiente para subir 1 nivel.", image: "cartas/sabio.jpeg", type: "accion" },
  { name: "El Caballero", description: "Un guerrero de alto nivel te jura lealtad.", image: "cartas/caballero.jpeg", type: "ataque" },
  { name: "Esqueleto Guerrero", description: "Un horrible lich te persigue.", image: "cartas/Esqueleto Guerrero.jpeg", type: "ataque" },
  { name: "La Visión", description: "Tienes una premonición importante.", image: "cartas/vision.jpeg", type: "accion" },
  { name: "El Troll Gigante", description: "Un Troll gigante te acecha.", image: "cartas/El Troll Gigante.jpeg", type: "ataque" },
  { name: "La Dama Oscura", description: "Una Dama Oscura te ataca.", image: "cartas/La Dama Oscura.jpeg", type: "ataque" },
  { name: "La Taberna", description: "Te emborrachas y pierdes salud.", image: "cartas/la taberna.jpeg", type: "accion" },
  { name: "El Banquete", description: "Recuperas salud con un banquete.", image: "cartas/banquete.jpeg", type: "sanacion" },
  { name: "La Loca", description: "Amenaza en el mercadillo.", image: "cartas/loca.jpeg", type: "accion" },
  { name: "La Visita", description: "La Muerte te visita.", image: "cartas/visita.jpeg", type: "accion" },
  { name: "La Vampira", description: "Pierdes salud por mordida.", image: "cartas/vampira.jpeg", type: "ataque" },
  { name: "El Duelo", description: "Un mercenario te reta a un duelo", image: "cartas/duelo.jpeg", type: "ataque" },
  { name: "El Golem", description: "Un Golem te ataca", image: "cartas/El Golem.jpeg", type: "ataque" },
  { name: "Los Brujos", description: "Eres rodeado por malvados brujos", image: "cartas/brujos.jpeg", type: "ataque" },
  { name: "El Portal", description: "Encuentras un misterioso portal.", image: "cartas/portal.jpeg", type: "accion" },
  { name: "El Tiempo", description: "Empieza a contar tu tiempo", image: "cartas/tiempo.jpeg", type: "accion" },
  { name: "Los Zombies", description: "Te encuentras con zombies...", image: "cartas/zombies.jpeg", type: "ataque" }
];

// Mazos iniciales
let mazoJugador = cartasDisponibles.slice(0,5);
let mazoIA = cartasDisponibles.slice(5,10);

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
    inventarioJugadorSpan.textContent = jugador.inventario.join(', ') || 'Vacio';
    saludIASpan.textContent = ia.salud;
    inventarioIASpan.textContent = ia.inventario.join(', ') || 'Vacio';
}

// Actualizar cartas
function actualizarCartasJugador(jugadorObj, mazo, contenedor, mostrar = true) {
    contenedor.innerHTML = '';
    if (!mostrar) return;

    mazo.forEach(carta => {
        const div = document.createElement('div');
        div.classList.add('carta', carta.type);

        const img = document.createElement('img');
        img.src = carta.image;
        img.title = carta.description;

        div.appendChild(img);

        if (jugadorObj === jugador) {
            div.addEventListener('click', () => {
                jugarCarta(carta, mazo, jugadorObj);
                setTimeout(turnoIA, 800);
            });
        }

        contenedor.appendChild(div);
    });
}

// Animación de ataque/curación
function efectoZona(texto, tipo) {
    const div = document.createElement('div');
    div.textContent = texto;
    div.classList.add('efecto', tipo);
    zonaBatalla.appendChild(div);
    setTimeout(() => div.remove(), 1000);
}

// Jugar carta
function jugarCarta(carta, mazo, jugadorObj) {
    zonaBatalla.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('carta', carta.type);
    const img = document.createElement('img');
    img.src = carta.image;
    img.title = carta.description;
    div.appendChild(img);
    zonaBatalla.appendChild(div);

    const index = mazo.findIndex(c => c.name === carta.name);
    if (index > -1) mazo.splice(index,1);

    agregarLog(`${jugadorObj.nombre} juega: ${carta.name}`);

    if (carta.type === 'ataque') {
        const objetivo = jugadorObj === jugador ? ia : jugador;
        const daño = Math.floor(Math.random()*5)+1;
        objetivo.salud -= daño;
        efectoZona(`-${daño} HP`, 'ataque');
        agregarLog(`${objetivo.nombre} recibe ${daño} de daño`);
    } else if (carta.type === 'sanacion') {
        const curacion = Math.floor(Math.random()*5)+1;
        jugadorObj.salud += curacion;
        efectoZona(`+${curacion} HP`, 'sanacion');
        agregarLog(`${jugadorObj.nombre} se cura ${curacion}`);
    } else if (carta.type === 'accion') {
        jugadorObj.inventario.push(carta.name);
        agregarLog(`${jugadorObj.nombre} obtiene: ${carta.name}`);
    }

    actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
    actualizarCartasJugador(ia, mazoIA, cartasIA, false);
    actualizarEstado();
}

// Turno IA con animación de carta
function turnoIA() {
    if (mazoIA.length === 0) {
        agregarLog('IA no tiene más cartas');
        return;
    }

    const cartaIA = mazoIA[0];
    // Mostrar temporalmente carta IA
    const div = document.createElement('div');
    div.classList.add('carta', cartaIA.type);
    const img = document.createElement('img');
    img.src = cartaIA.image;
    img.title = cartaIA.description;
    div.appendChild(img);
    zonaBatalla.innerHTML = '';
    zonaBatalla.appendChild(div);

    setTimeout(() => {
        jugarCarta(cartaIA, mazoIA, ia);
    }, 800);
}

// Inicialización
actualizarCartasJugador(jugador, mazoJugador, cartasJugador);
actualizarCartasJugador(ia, mazoIA, cartasIA, false);
actualizarEstado();
agregarLog("¡Comienza el juego!");
