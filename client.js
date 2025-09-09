<<<<<<< HEAD

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

let jugador = { nombre: 'Tú', salud: 40, energia: 25, energiaMaxima: 45, oro: 10, inventario: [] };

let ia = { nombre: 'IA', salud: 40, energia: 25, energiaMaxima: 45, oro: 10, inventario: [] };



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

    { name: "Los Zombies", description: "Te encuentras con unos zombies...", image: "cartas/zombies.jpeg", type: "ataque_zombie", cost: 2, damage: 4 },

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



    const costo = carta.cost || 0;

    if (jugadorObj.energia < costo) {

        agregarLog(`${jugadorObj.nombre} no tiene suficiente energía para jugar ${carta.name}.`);

        if (jugadorObj === jugador) {

            accionesJugador = 0; // Termina el turno si no puede jugar

            cambiarTurno();

        }

        return;

    }



    jugadorObj.energia -= costo;

    actualizarBarrasEnergia();



    zonaBatalla.innerHTML = '';

    const cartaHTML = crearCarta(carta);

    cartaHTML.querySelector('.card-inner').classList.add('flip');

    zonaBatalla.appendChild(cartaHTML);



    const index = mazo.findIndex(c => c.name === carta.name);

    if (index > -1) mazo.splice(index, 1);



    agregarLog(`${jugadorObj.nombre} juega: ${carta.name}`);



    if (jugadorObj === jugador) {

        cartasJugadasJugador.push(carta);

        accionesJugador--;

    } else {

        cartasJugadasIA.push(carta);

        accionesIA--;

    }



    actualizarCartasUsadas(cartasJugadasJugador, 'jugadorCardsUsed');

    actualizarCartasUsadas(cartasJugadasIA, 'iaCardsUsed');



    if (carta.type === 'ataque' || carta.type === 'compañero') {

        const objetivo = jugadorObj === jugador ? ia : jugador;

        const dañoBase = carta.damage;

        let dañoTotal = dañoBase;

       

        const bonoRuna = jugadorObj.runas.find(r => r.nombre === "Runa de Poder");

        if (bonoRuna) {

            dañoTotal += 1;

            agregarLog(`${jugadorObj.nombre} usa una runa para añadir 1 de daño extra.`);

        }



        if (jugadorObj.inventario.some(item => item.tipo === 'arma')) {

            dañoTotal += 2;

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

    } else if (carta.type === 'ataque_especial') {

        const objetivo = jugadorObj === jugador ? ia : jugador;

        objetivo.salud -= carta.damage;

        objetivo.estado = 'enfermo';

        agregarLog(`${objetivo.nombre} ha sido afectado por los zombies y ha perdido ${carta.damage} de salud. Ahora está enfermo.`);



        if (jugadorObj === jugador) {

            document.getElementById('opponentZone').classList.add('zombie-effect-animation');

            setTimeout(() => {

                document.getElementById('opponentZone').classList.remove('zombie-effect-animation');

            }, 2000);

        } else {

            document.getElementById('playerZone').classList.add('zombie-effect-animation');

            setTimeout(() => {

                document.getElementById('playerZone').classList.remove('zombie-effect-animation');

            }, 2000);

        }

    } else if (carta.type === 'sanacion') {

        const curacion = carta.heal;

        jugadorObj.salud = Math.min(jugadorObj.saludMaxima, jugadorObj.salud + curacion);

        zonaBatalla.classList.add('heal');

        setTimeout(() => zonaBatalla.classList.remove('heal'), 500);

        agregarLog(`${jugadorObj.nombre} se cura ${curacion} (Salud: ${jugadorObj.salud})`);

    } else if (carta.type === 'accion') {

        agregarLog(`${jugadorObj.nombre} usa la carta de ${carta.name}.`);

    } else if (carta.type === 'evento') {

        if (carta.name === 'El Sabio') {

            ganarXP(jugadorObj, 10);

        }

    } else if (carta.type === 'tienda'){

        if (jugadorObj === jugador) {

            agregarLog(`${jugadorObj.nombre} visita La Tienda.`);

            mostrarTienda(jugadorObj);

        } else {

            agregarLog(`${jugadorObj.nombre} descarta la carta de La Tienda.`);

        }

    }



    actualizarBarrasSalud();

    actualizarCartasJugador(jugador, mazoJugador, cartasJugador);

    actualizarCartasJugador(ia, mazoIA, cartasIA, false);

   

    comprobarFinDeJuego();

    if(jugador.salud > 0 && ia.salud > 0) {

        if (carta.type !== 'tienda') {

            cambiarTurno();

        }

    }

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

=======
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
>>>>>>> f91b794
}



// Event Listeners
<<<<<<< HEAD

restartButton.addEventListener('click', reiniciarJuego);



// Inicialización del juego

repartirCartas();

actualizarCartasJugador(jugador, mazoJugador, cartasJugador);

actualizarCartasJugador(ia, mazoIA, cartasIA, false);

actualizarEstado();

agregarLog("¡Comienza el juego!");

turnIndicator.textContent = 'Tu turno';
=======
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
>>>>>>> f91b794
