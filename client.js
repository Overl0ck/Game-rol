// ------------------------------
// CLIENT.JS - Juego de Cartas Mejorado
// ------------------------------

// DOM
const saludJugadorEl = document.getElementById('salud-jugador');
const energiaJugadorEl = document.getElementById('energia-jugador');
const creditosJugadorEl = document.getElementById('creditos-jugador');
const datosJugadorEl = document.getElementById('datos-jugador');


// Nuevos elementos para los números
const saludJugadorNumEl = document.getElementById('salud-jugador-num');
const energiaJugadorNumEl = document.getElementById('energia-jugador-num');

const saludIaEl = document.getElementById('salud-ia');
const energiaIaEl = document.getElementById('energia-ia');
const creditosIaEl = document.getElementById('creditos-ia');
const datosIaEl = document.getElementById('datos-ia');

// Nuevos elementos para los números de la IA
const saludIaNumEl = document.getElementById('salud-ia-num');
const energiaIaNumEl = document.getElementById('energia-ia-num');


const cartasJugadorEl = document.getElementById('cards-jugador');
const cartasIaEl = document.getElementById('cards-ia');
const logEl = document.getElementById('log');
const turnIndicatorEl = document.getElementById('turnIndicator');
const pasarTurnoBtn = document.getElementById('pasarTurnoBtn');
const descartarBtn = document.getElementById('descartarBtn');

console.log("DOM cargado correctamente");

// Constantes de valores máximos
const MAX_SALUD = 10;
const MAX_ENERGIA = 10;
const MAX_RECURSOS = 10;

// Estados del juego
let jugador = {
    salud: 10,
    energia: 10,
    creditos: 0,
    datos: 0
};
let ia = {
    salud: 10,
    energia: 10,
    creditos: 0,
    datos: 0
};
let turno = 1;
let cartasSeleccionadas = [];
let turnoActual = 'jugador';

// Cartas del juego (el mazo completo)
const mazoCompleto = [
    { id: 1, name: "Mercenario", description: "Consigue créditos para tu causa.", img: "cartas/mercenario.jpg", cost: { energia: 1 }, creditos: 3 },
    { id: 2, name: "Reparacion Cibernetica", description: "Restaura tu integridad estructural.", img: "cartas/reparacion_cibernetica.jpg", cost: { creditos: 2 }, energia: 4 },
    { id: 3, name: "Explorador Rebelde", description: "Obtén información vital del enemigo.", img: "cartas/explorador_rebelde.jpeg", cost: { creditos: 2 }, datos: 3 },
    { id: 4, name: "Disparo Laser", description: "Un potente ataque energético.", img: "cartas/disparo_laser.jpg", cost: { datos: 3 }, attack: 5 },
    { id: 5, name: "Ataque de Drones", description: "Enjambre de drones para infligir daño.", img: "cartas/drones.jpg", cost: { datos: 2 }, attack: 3 },
    { id: 6, name: "Refuerzo", description: "Repara pequeñas averías.", img: "cartas/refuerzo.jpg", cost: { credito: 1 }, energia: 3 },
    { id: 7, name: "Comerciante", description: "Intercambia bienes por valiosos créditos.", img: "cartas/comerciante.jpg", cost: { energia: 2 }, creditos: 5 },
    { id: 8, name: "Analista de Datos", description: "Decodifica datos para obtener ventaja.", img: "cartas/analista_datos.jpg", cost: { creditos: 1 }, datos: 2 },
  
    // Nuevas cartas
    { id: 9, name: "Ataque Sara", description: "Un potente ataque con el hacha de Sara.", img: "cartas/ataque_Sara.jpeg", cost: { datos: 4 }, attack: 6 },
    { id: 10, name: "Ataque Moises", description: "Moises el canibal ataca de nuevo.", img: "cartas/moises.jpg", cost: { datos: 4 }, attack: 6 },
    { id: 11, name: "Maria", description: "Recuperas salud con cerveza", img: "cartas/maria.jpg", cost: { energia: 3 }, heal: 4 },
    { id: 12, name: "Fersie", description: "Recuperas salud", img: "cartas/Fersie.jpg", cost: { energia: 3 }, heal: 4 },
    { id: 13, name: "Vendedor Hardware", description: "Decodifica datos para obtener ventaja.", img: "cartas/vendedor.jpg", cost: { energia: 4 ,creditos: 1 }, datos: 7 },
  


    { id: 17, name: "Hacker Corporativo", description: "Roba 2 créditos al oponente.", img: "cartas/ataque_hacker.jpeg", cost: { energia: 3 }, robarCreditos: 2 },
    { id: 18, name: "Borg", description: "Roba 2 datos al oponente.", img: "cartas/unidad_borg.jpg", cost: { creditos: 3 }, robarDatos: 2 },
    // Duplicar cartas para tener un mazo más grande
    { id: 9, name: "Mercenario", description: "Consigue créditos para tu causa.", img: "cartas/mercenario.jpg", cost: { energia: 1 }, creditos: 3 },
    { id: 10, name: "Reparacion Cibernetica", description: "Restaura tu integridad estructural.", img: "cartas/reparacion_cibernetica.jpg", cost: { creditos: 2 }, energia: 4 },
    { id: 11, name: "Explorador Rebelde", description: "Obtén información vital del enemigo.", img: "cartas/explorador_rebelde.jpeg", cost: { creditos: 2 }, datos: 5 },
    { id: 12, name: "Asalto Terminator", description: "Un grupo de Terminators de asalto", img: "cartas/asalto_terminator.jpeg", cost: { datos: 5 }, attack: 8 },
    { id: 13, name: "Vendedor Hardware", description: "Trapicheo de datos.", img: "cartas/vendedor.jpg", cost: { energia: 4 ,creditos: 1 }, datos: 7 },
    { id: 14, name: "Refuerzo", description: "Repara pequeñas averías.", img: "cartas/refuerzo.jpg", cost: { credito: 1 }, energia: 3 },
    { id: 15, name: "Comerciante", description: "Intercambia bienes por valiosos créditos.", img: "cartas/comerciante.jpg", cost: { energia: 2 }, creditos: 5 },
    { id: 16, name: "Analista de Datos", description: "Decodifica datos para obtener ventaja.", img: "cartas/analista_datos.jpg", cost: { creditos: 1 }, datos: 2 },
];

const mazoEventos = [
    {
    id: 10,
    name: "Falla en el Sistema",
    descripcion: "Una sobretensión provoca una falla.",
    img: "cartas/alerta.jpeg",
    event: {
        title: "Falla de Energía",
        description: "Una sobretensión ha provocado un apagón. Debes decidir cómo recuperarte:",
        choices: [
            {
                text: "Reiniciar hardware (Ganas  energía)",
                consequence: { 
                    energia: Math.floor(Math.random() * 3) + 1, 
                    mensaje: "Reinicias el hardware y recuperas energía." }
            },
            {
                text: "Forzar recuperación de datos (Ganas  datos pero pierdes energia)",
                consequence: { 
                    datos:    Math.floor(Math.random() * 7) + 1, 
                    energia:  Math.floor(Math.random() * 3) - 2,
                    mensaje: "Fuerzas la recuperación, pero dañas tu sistema." }
            }
        ]
    }
},
{
    id: 11,
    name: "Caja de Datos Criptografiada",
    descripcion: "Encuentras una caja con datos. ¿La abres?",
    img: "cartas/caja.jpg",
    event: {
        title: "Datos Criptografiados",
        description: "Has encontrado una caja de datos cifrada. ¿Qué harás con ella?",
        choices: [
            {
                text: "Intentar descifrar (Ganas datos)",
                minijuego: true
            },
            {
                text: "Venderla en el mercado negro (Ganas créditos)",
                consequence: { 
                    creditos: Math.floor(Math.random() * 4) + 1,
                    mensaje: "Vendes la caja en el mercado negro." }
            }
        ]
    }
},
{
        id: 13,
        name: "Bronca en la Cantina",
        descripcion: "Una pelea en la cantina te obliga a tomar una decisión.",
        img: "cartas/cantina_pelea.jpg",
        event: {
            title: "Bronca en la Cantina",
            description: "Una pelea estalla a tu lado. ¿Te unes o te escondes?",
            choices: [
                {
                    text: "Unirte a la pelea",
                    consequence: { 
                        salud: Math.floor(Math.random() * 3) - 2, // Pierdes entre 2 y 4 de salud
                        creditos: Math.floor(Math.random() * 6) + 1, // Ganas entre 1 y 3 de créditos
                        mensaje: "Te unes a la bronca. La cosa se pone fea, pero encuentras algunas ganancias."
                    }
                },
                {
                    text: "Esconderte bajo la mesa",
                    consequence: { 
                     //   salud: Math.floor(Math.random() * 2), // Puedes perder 0 o 1 de salud
                      datos: Math.floor(Math.random() * 4) + 1, // Ganas entre 1 y 4 de datos
                        mensaje: "Te escondes y pasas desapercibido, pero encuentras  un  pendrive con datos."
                    }
                }
            ]
        }
    },

];



let mazoJugador = [...mazoCompleto].sort(() => 0.5 - Math.random());
let mazoIA = [...mazoCompleto].sort(() => 0.5 - Math.random());
let manoJugador = [];
let manoIA = [];
let descarteJugador = [];
let descarteIA = [];

console.log("Mazos creados y barajados.");

// Función para actualizar los atributos en pantalla
function actualizarAtributos() {
    saludJugadorEl.value = jugador.salud;
    saludJugadorNumEl.textContent = jugador.salud;
    energiaJugadorEl.value = jugador.energia;
    energiaJugadorNumEl.textContent = jugador.energia;
    creditosJugadorEl.textContent = jugador.creditos;
    datosJugadorEl.textContent = jugador.datos;

    saludIaEl.value = ia.salud;
    saludIaNumEl.textContent = ia.salud;
    energiaIaEl.value = ia.energia;
    energiaIaNumEl.textContent = ia.energia;
    creditosIaEl.textContent = ia.creditos;
    datosIaEl.textContent = ia.datos;
}

// Función para añadir mensajes al log
function agregarLog(mensaje) {
    logEl.innerHTML += `<div>${mensaje}</div>`;
    logEl.scrollTop = logEl.scrollHeight;
}

// Función para robar cartas hasta tener 4 en la mano
function robarCartas(mazo, mano, elementoMano, descarte) {
    const cartasNecesarias = 4 - mano.length;
    for (let i = 0; i < cartasNecesarias; i++) {
        if (mazo.length > 0) {
            mano.push(mazo.shift());
        } else if (descarte.length > 0) {
            // Reciclar el mazo
            agregarLog("¡Mazo vacío! Barajando la pila de descarte.");
            mazo.push(...descarte);
            descarte.length = 0; // Vaciar la pila de descarte
            mazo.sort(() => 0.5 - Math.random());
            mano.push(mazo.shift());
        } else {
            agregarLog("¡Ambos mazos están vacíos!");
            break;
        }
    }
    renderizarCartas(mano, elementoMano, mazo === mazoIA);
}

// Función para renderizar las cartas en pantalla
function renderizarCartas(mano, elementoMano, esIA = false) {
    elementoMano.innerHTML = '';
    mano.forEach(carta => {
        const cardContainer = crearCarta(carta, esIA);
        elementoMano.appendChild(cardContainer);
    });
}

// Función para crear una carta
function crearCarta(carta, esIA = false) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    // Si la carta es de la IA, le añadimos la clase para que se muestre con el reverso
    if (esIA) {
        cardInner.classList.add('ai-card');
    }

    const front = document.createElement('div');
    front.classList.add('card-front');
    const imgFront = document.createElement('img');
    imgFront.src = carta.img;
    front.appendChild(imgFront);

    // Título de la carta
    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = carta.name;
    front.appendChild(cardTitle);

    // Descripción de la carta
    const cardDescription = document.createElement('div');
    cardDescription.classList.add('card-description');
    cardDescription.textContent = carta.description;
    front.appendChild(cardDescription);

    // Atributos de la carta (costos y efectos)
    const attributesDiv = document.createElement('div');
    attributesDiv.classList.add('card-attributes');
    if (carta.cost.energia) attributesDiv.innerHTML += `<span class="card-cost">⚡${carta.cost.energia}</span>`;
    if (carta.cost.creditos) attributesDiv.innerHTML += `<span class="card-cost-creditos">💳${carta.cost.creditos}</span>`;
    if (carta.cost.datos) attributesDiv.innerHTML += `<span class="card-cost-datos">🖥️${carta.cost.datos}</span>`;
    if (carta.attack) attributesDiv.innerHTML += `<span class="card-damage">⚔️${carta.attack}</span>`;
    if (carta.heal) attributesDiv.innerHTML += `<span class="card-heal">❤️${carta.heal}</span>`;
    if (carta.creditos) attributesDiv.innerHTML += `<span class="card-creditos">💳${carta.creditos}</span>`;
    if (carta.datos) attributesDiv.innerHTML += `<span class="card-datos">🖥️${carta.datos}</span>`;
    // Nuevos atributos de robo
    if (carta.robarCreditos) attributesDiv.innerHTML += `<span class="card-rob-creditos">💀💳${carta.robarCreditos}</span>`;
    if (carta.robarDatos) attributesDiv.innerHTML += `<span class="card-rob-datos">💀🖥️${carta.robarDatos}</span>`;

    front.appendChild(attributesDiv);

    const back = document.createElement('div');
    back.classList.add('card-back');
    const imgBack = document.createElement('img');
    imgBack.src = 'img/dorso.png';
    back.appendChild(imgBack);

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    cardContainer.appendChild(cardInner);

    // Lógica para cartas del jugador
    if (!esIA) {
        cardInner.addEventListener('click', () => {
            if (turnoActual !== 'jugador') {
                agregarLog("No es tu turno.");
                return;
            }
            if (!manoJugador.includes(carta)) {
                agregarLog("Esta carta ya fue jugada o no está en tu mano.");
                return;
            }

            if (cardInner.classList.contains('flip')) {
                cardInner.classList.remove('flip');
                cartasSeleccionadas = cartasSeleccionadas.filter(c => c.id !== carta.id);
                agregarLog(`Has deseleccionado ${carta.name}.`);
            } else {
                if (cartasSeleccionadas.length >= 2) {
                    agregarLog("No puedes seleccionar más de 2 cartas por turno.");
                    return;
                }
                cardInner.classList.add('flip');
                cartasSeleccionadas.push(carta);
                agregarLog(`Has seleccionado ${carta.name}.`);
            }
        });
    }

    return cardContainer;
}

// Iniciar el juego
function iniciarJuego() {
    robarCartas(mazoJugador, manoJugador, cartasJugadorEl, descarteJugador);
    robarCartas(mazoIA, manoIA, cartasIaEl, descarteIA);
    actualizarAtributos();
    agregarLog("¡El juego ha comenzado! Selecciona hasta 2 cartas para el turno.");
    pasarTurnoBtn.style.display = 'block';
    descartarBtn.style.display = 'block';
}

// Event Listeners
pasarTurnoBtn.addEventListener('click', () => {
    if (turnoActual !== 'jugador') return;

    if (cartasSeleccionadas.length === 0) {
        agregarLog("No has seleccionado ninguna carta para jugar. Pasando el turno.");
        terminarTurnoJugador();
        return;
    }

      

 
    const todasSonJugables = cartasSeleccionadas.every(c => {
        const tieneEnergia = c.cost.energia ? jugador.energia >= c.cost.energia : true;
        const tieneCreditos = c.cost.creditos ? jugador.creditos >= c.cost.creditos : true;
        const tieneDatos = c.cost.datos ? jugador.datos >= c.cost.datos : true;
        return tieneEnergia && tieneCreditos && tieneDatos;
    });

    if (!todasSonJugables) {
        agregarLog("<strong>No tienes suficientes recursos para jugar las cartas seleccionadas.</strong> Debes deseleccionarlas o descartarlas.");
        return;
    }

    agregarLog("---");
    agregarLog(`<strong>Turno ${turno} - Jugador</strong>`);

    const cartasJugadasEsteTurno = [];
    cartasSeleccionadas.forEach(cartaSeleccionada => {
        const cartaOriginal = manoJugador.find(c => c.id === cartaSeleccionada.id);
        if (!cartaOriginal) return;

        descarteJugador.push(cartaOriginal);

        if (cartaOriginal.cost.energia) jugador.energia -= cartaOriginal.cost.energia;
        if (cartaOriginal.cost.creditos) jugador.creditos -= cartaOriginal.cost.creditos;
        if (cartaOriginal.cost.datos) jugador.datos -= cartaOriginal.cost.datos;

        if (cartaOriginal.creditos) {
            jugador.creditos = Math.min(jugador.creditos + cartaOriginal.creditos, MAX_RECURSOS);
            agregarLog(`Has usado ${cartaOriginal.name} y ganado 💳${cartaOriginal.creditos} créditos.`);
        }
        if (cartaOriginal.datos) {
            jugador.datos = Math.min(jugador.datos + cartaOriginal.datos, MAX_RECURSOS);
            agregarLog(`Has usado ${cartaOriginal.name} y obtenido 🖥️${cartaOriginal.datos} de datos.`);
        }
        if (cartaOriginal.attack) {
            ia.salud -= cartaOriginal.attack;
            agregarLog(`Has atacado a la IA con ${cartaOriginal.name}. Daño: ${cartaOriginal.attack}.`);
        }
        if (cartaOriginal.heal) {
            jugador.salud = Math.min(jugador.salud + cartaOriginal.heal, MAX_SALUD);
            agregarLog(`Te has curado con ${cartaOriginal.name}. Curación: ${cartaOriginal.heal}.`);
        }
        if (cartaOriginal.robarCreditos) {
            const creditosRobados = Math.min(ia.creditos, cartaOriginal.robarCreditos);
            jugador.creditos = Math.min(jugador.creditos + creditosRobados, MAX_RECURSOS);
            ia.creditos -= creditosRobados;
            agregarLog(`Has usado ${cartaOriginal.name} y robado 💳${creditosRobados} créditos a la IA.`);
        }
        if (cartaOriginal.robarDatos) {
            const datosRobados = Math.min(jugador.datos, cartaOriginal.robarDatos);
            jugador.datos = Math.min(jugador.datos + datosRobados, MAX_RECURSOS);
            ia.datos -= datosRobados;
            agregarLog(`Has usado ${cartaOriginal.name} y robado 🖥️${datosRobados} de datos a la IA.`);
        }
        cartasJugadasEsteTurno.push(cartaOriginal);
    });

    manoJugador = manoJugador.filter(carta => !cartasJugadasEsteTurno.includes(carta));

    if (ia.salud <= 0) {
        alert("¡Has ganado la partida!");
        reiniciarJuego();
        return;
    }

    terminarTurnoJugador();
});

function terminarTurnoJugador() {
    // Si el turno es un múltiplo de 5, dispara un evento aleatorio.
    if (turno % 5 === 0) {
        const eventoAleatorio = mazoEventos[Math.floor(Math.random() * mazoEventos.length)];
        agregarLog(`<strong>¡Un evento aleatorio ha ocurrido en tu turno!</strong>`);
        setTimeout(() => mostrarModalEvento(eventoAleatorio), 1000); // Muestra el modal después de un breve retraso
        return; // Detener el turno aquí, el modal lo gestionará
    }
    
    // Si no es un turno de evento, se pasa el turno a la IA
    cartasSeleccionadas = [];
    turnoActual = 'ia';
    turnIndicatorEl.textContent = `Turno: IA`;
    actualizarAtributos();
    robarCartas(mazoJugador, manoJugador, cartasJugadorEl, descarteJugador);
    pasarTurnoBtn.style.display = 'none';
    descartarBtn.style.display = 'none';
    setTimeout(turnoIA, 2000);
}


// Nuevo Event Listener para el botón de descartar
descartarBtn.addEventListener('click', () => {
    if (turnoActual !== 'jugador') {
        agregarLog("No es tu turno.");
        return;
    }
    if (cartasSeleccionadas.length === 0) {
        agregarLog("No has seleccionado ninguna carta para descartar.");
        return;
    }

    agregarLog(`<strong>Jugador descarta ${cartasSeleccionadas.length} carta(s).</strong>`);

    // Mover las cartas seleccionadas a la pila de descarte
    descarteJugador.push(...cartasSeleccionadas);

    // Actualizar la mano del jugador eliminando las cartas descartadas
    manoJugador = manoJugador.filter(carta => !cartasSeleccionadas.includes(carta));

    // Limpiar la selección visual y el array de selección
    cartasSeleccionadas = [];
    document.querySelectorAll('#cards-jugador .card-inner.flip').forEach(c => c.classList.remove('flip'));

    renderizarCartas(manoJugador, cartasJugadorEl); // Vuelve a renderizar la mano para reflejar el cambio

    agregarLog("Las cartas han sido descartadas. Finaliza el turno para robar nuevas cartas.");
});


// Función de la IA (mejorada)
function turnoIA() {
    agregarLog("---");
    agregarLog(`<strong>Turno ${turno} - IA</strong>`);

    let cartasIASeleccionadas = [];
    const cartasDisponibles = manoIA.filter(c => {
        if (c.tipo === 'evento') return false;
        const tieneEnergia = c.cost.energia ? ia.energia >= c.cost.energia : true;
        const tieneCreditos = c.cost.creditos ? ia.creditos >= c.cost.creditos : true;
        const tieneDatos = c.cost.datos ? ia.datos >= c.cost.datos : true;
        return tieneEnergia && tieneCreditos && tieneDatos;
    });

    if (cartasDisponibles.length > 0) {
        const cartasCurativas = cartasDisponibles.filter(c => c.heal > 0);
        const cartasAtacantes = cartasDisponibles.filter(c => c.attack > 0);
        const cartasRoboCreditos = cartasDisponibles.filter(c => c.robarCreditos > 0);
        const cartasRoboDatos = cartasDisponibles.filter(c => c.robarDatos > 0);
        const cartasCreditos = cartasDisponibles.filter(c => c.creditos > 0);
        const cartasDatos = cartasDisponibles.filter(c => c.datos > 0);

        for (let i = 0; i < 2; i++) {
            let cartaElegida = null;
            if (ia.salud < 10 && cartasCurativas.length > 0) {
                cartaElegida = cartasCurativas.shift();
            } else if (jugador.salud < 10 && cartasAtacantes.length > 0) {
                cartaElegida = cartasAtacantes.shift();
            } else if (jugador.creditos > 2 && cartasRoboCreditos.length > 0) {
                cartaElegida = cartasRoboCreditos.shift();
            } else if (jugador.datos > 2 && cartasRoboDatos.length > 0) {
                cartaElegida = cartasRoboDatos.shift();
            } else if (ia.creditos < 2 && cartasCreditos.length > 0) {
                cartaElegida = cartasCreditos.shift();
            } else if (ia.datos < 3 && cartasDatos.length > 0) {
                cartaElegida = cartasDatos.shift();
            } else if (cartasDisponibles.length > 0) {
                cartaElegida = cartasDisponibles[Math.floor(Math.random() * cartasDisponibles.length)];
                cartasDisponibles.splice(cartasDisponibles.indexOf(cartaElegida), 1);
            }
            if (cartaElegida && !cartasIASeleccionadas.includes(cartaElegida)) {
                cartasIASeleccionadas.push(cartaElegida);
            }
        }
    } else {
        agregarLog("La IA no tiene recursos para jugar ninguna carta. Descartando 2 cartas aleatoriamente.");
        const cartasADescartar = [];
        for(let i = 0; i < 2 && manoIA.length > 0; i++) {
            const indiceAleatorio = Math.floor(Math.random() * manoIA.length);
            cartasADescartar.push(manoIA[indiceAleatorio]);
            manoIA.splice(indiceAleatorio, 1);
        }
        descarteIA.push(...cartasADescartar);
        cartasIASeleccionadas = cartasADescartar;
    }

    cartasIASeleccionadas.forEach((carta, index) => {
        setTimeout(() => {
            const cartaVisual = Array.from(document.querySelectorAll('#cards-ia .card-container .card-inner'))
                .find(c => c.querySelector('.card-front img').src.includes(carta.img) && c.classList.contains('ai-card'));
            
            if (cartaVisual) {
                cartaVisual.classList.remove('ai-card');
                
                if (carta.cost) {
                    if (carta.cost.energia) ia.energia -= carta.cost.energia;
                    if (carta.cost.creditos) ia.creditos -= carta.cost.creditos;
                    if (carta.cost.datos) ia.datos -= carta.cost.datos;
                }
                
                if (carta.creditos) {
                    ia.creditos = Math.min(ia.creditos + carta.creditos, MAX_RECURSOS);
                    agregarLog(`La IA ha usado ${carta.name} y ganado 💳${carta.creditos} créditos.`);
                }
                if (carta.datos) {
                    ia.datos = Math.min(ia.datos + carta.datos, MAX_RECURSOS);
                    agregarLog(`La IA ha usado ${carta.name} y obtenido 🖥️${carta.datos} de datos.`);
                }
                if (carta.attack) {
                    jugador.salud -= carta.attack;
                    agregarLog(`La IA te ataca con ${carta.name}. Daño: ${carta.attack}.`);
                }
                if (carta.heal) {
                    ia.salud = Math.min(ia.salud + carta.heal, MAX_SALUD);
                    agregarLog(`La IA se cura con ${carta.name}. Curación: ${carta.heal}.`);
                }
                if (carta.robarCreditos) {
                    const creditosRobados = Math.min(jugador.creditos, carta.robarCreditos);
                    ia.creditos = Math.min(ia.creditos + creditosRobados, MAX_RECURSOS);
                    jugador.creditos -= creditosRobados;
                    agregarLog(`La IA ha usado ${carta.name} y te ha robado 💳${creditosRobados} créditos.`);
                }
                if (carta.robarDatos) {
                    const datosRobados = Math.min(jugador.datos, carta.robarDatos);
                    ia.datos = Math.min(ia.datos + datosRobados, MAX_RECURSOS);
                    jugador.datos -= datosRobados;
                    agregarLog(`La IA ha usado ${carta.name} y te ha robado 🖥️${datosRobados} de datos.`);
                }
                actualizarAtributos();

                if (jugador.salud <= 0) {
                    alert("La IA ha ganado la partida.");
                    reiniciarJuego();
                    return;
                }
            }
        }, 500 * (index + 1));
    });

    setTimeout(() => {
        turno++;
        jugador.energia = Math.min(jugador.energia + 1, MAX_ENERGIA);
        ia.energia = Math.min(ia.energia + 1, MAX_ENERGIA);
        
        turnoActual = 'jugador';
        turnIndicatorEl.textContent = `Turno: Jugador`;
        actualizarAtributos();
        robarCartas(mazoIA, manoIA, cartasIaEl, descarteIA);
        pasarTurnoBtn.style.display = 'block';
        descartarBtn.style.display = 'block';

    }, 2000 * cartasIASeleccionadas.length || 2000);
}

// ----------------------------------------------------
// Nueva función para generar el modal desde cero
// ----------------------------------------------------
function mostrarModalEvento(evento) {
    const modalEl = document.createElement('div');
    modalEl.id = 'event-modal';
    modalEl.classList.add('modal-visible');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const cardImageEl = document.createElement('img');
    cardImageEl.src = evento.img;
    cardImageEl.classList.add('modal-card-image');

    const modalTitleEl = document.createElement('h2');
    modalTitleEl.id = 'modal-title';
    modalTitleEl.textContent = evento.event.title;

    const modalDescriptionEl = document.createElement('p');
    modalDescriptionEl.id = 'modal-description';
    modalDescriptionEl.textContent = evento.event.description;

    const modalChoicesEl = document.createElement('div');
    modalChoicesEl.id = 'modal-choices';

    evento.event.choices.forEach(opcion => {
        const boton = document.createElement('button');
        boton.textContent = opcion.text;
        boton.classList.add('modal-choice-btn'); 
        
        boton.addEventListener('click', () => {
            // Aplicar la consecuencia de la elección
            if (opcion.consequence.salud) jugador.salud = Math.max(0, jugador.salud + opcion.consequence.salud);
            if (opcion.consequence.energia) jugador.energia = Math.min(MAX_ENERGIA, jugador.energia + opcion.consequence.energia);
            if (opcion.consequence.creditos) jugador.creditos = Math.min(MAX_RECURSOS, jugador.creditos + opcion.consequence.creditos);
            if (opcion.consequence.datos) jugador.datos = Math.min(MAX_RECURSOS, jugador.datos + opcion.consequence.datos);
            if (opcion.consequence.attack) {
                ia.salud -= opcion.consequence.attack;
                agregarLog(`Has usado ${opcion.consequence.mensaje}. Daño: ${opcion.consequence.attack}.`);
            }
            agregarLog(`Has elegido: ${opcion.text}.`);

            // Eliminar el modal y pasar el turno a la IA
            modalEl.remove();
            
            // Incrementar el turno y pasar a la IA
            turno++;
            turnoActual = 'ia';
            turnIndicatorEl.textContent = `Turno: IA`;
            actualizarAtributos();
            robarCartas(mazoJugador, manoJugador, cartasJugadorEl, descarteJugador);

            // Iniciar el turno de la IA
            setTimeout(turnoIA, 2000); 

            // Mostrar los botones principales
            pasarTurnoBtn.style.display = 'block';
            descartarBtn.style.display = 'block';
        });
        modalChoicesEl.appendChild(boton);
    });

    modalContent.appendChild(cardImageEl);
    modalContent.appendChild(modalTitleEl);
    modalContent.appendChild(modalDescriptionEl);
    modalContent.appendChild(modalChoicesEl);
    modalEl.appendChild(modalContent);
    document.body.appendChild(modalEl);

    // Ocultar los botones principales
    pasarTurnoBtn.style.display = 'none';
    descartarBtn.style.display = 'none';
}

// La lista de contraseñas posibles
const contrasenas = [
    "NEON_DREAM",
    "CYBER-742",
    "RED-GLITCH",
    "NEO-TOKYO",
    "GHOST-NET"
];

function iniciarMiniJuegoPuzzle() {
    // Crear el modal del minijuego
    const modalMiniJuego = document.createElement('div');
    modalMiniJuego.id = 'minijuego-modal';
    modalMiniJuego.classList.add('modal-visible');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Elegir una contraseña aleatoria de la lista
    const passwordCorrecta = contrasenas[Math.floor(Math.random() * contrasenas.length)];

    const puzleTitle = document.createElement('h2');
    puzleTitle.textContent = "¡Descifra el Código!";

    const puzleDescription = document.createElement('p');
    puzleDescription.textContent = "Has encontrado una nota cifrada junto al dispositivo: 'El código es el sueño de la ciudad de neón...'.";
    // Podrías añadir más pistas aquí para hacer la adivinanza más fácil

    const puzleInput = document.createElement('input');
    puzleInput.type = "text";
    puzleInput.placeholder = "Introduce la contraseña";

    const puzleBtn = document.createElement('button');
    puzleBtn.textContent = "Verificar";
    puzleBtn.classList.add('modal-choice-btn');

    // Lógica para verificar la respuesta del jugador
    puzleBtn.addEventListener('click', () => {
        const respuestaJugador = puzleInput.value.trim().toUpperCase(); // Limpiar y convertir a mayúsculas
        
        if (respuestaJugador === passwordCorrecta) {
            // El jugador ha ganado
            const datosGanados = Math.floor(Math.random() * 4) + 1;
            jugador.datos = Math.min(jugador.datos + datosGanados, MAX_RECURSOS);
            agregarLog(`¡Has descifrado el código! Ganas 🖥️${datosGanados} de datos.`);
        } else {
            // El jugador ha fallado
            agregarLog("Has fallado al descifrar el código. No obtienes ninguna recompensa.");
        }

        // Limpiar el minijuego y pasar el turno
        modalMiniJuego.remove();
        turno++;
        turnoActual = 'ia';
        turnIndicatorEl.textContent = `Turno: IA`;
        actualizarAtributos();
        robarCartas(mazoJugador, manoJugador, cartasJugadorEl, descarteJugador);
        setTimeout(turnoIA, 2000);
        pasarTurnoBtn.style.display = 'block';
        descartarBtn.style.display = 'block';
    });

    // Ensamblar y mostrar el minijuego
    modalContent.appendChild(puzleTitle);
    modalContent.appendChild(puzleDescription);
    modalContent.appendChild(puzleInput);
    modalContent.appendChild(puzleBtn);
    modalMiniJuego.appendChild(modalContent);
    document.body.appendChild(modalMiniJuego);
}

// Función para reiniciar el juego
function reiniciarJuego() {
    jugador = { salud: 10, energia: 10, creditos: 0, datos: 0 };
    ia = { salud: 10, energia: 10, creditos: 0, datos: 0 };
    turno = 1;
    cartasSeleccionadas = [];
    turnoActual = 'jugador';
    mazoJugador = [...mazoCompleto].sort(() => 0.5 - Math.random());
    mazoIA = [...mazoCompleto].sort(() => 0.5 - Math.random());
    manoJugador = [];
    manoIA = [];
    descarteJugador = [];
    descarteIA = [];
    logEl.innerHTML = '';
    iniciarJuego();
}

// Iniciar el juego
iniciarJuego();