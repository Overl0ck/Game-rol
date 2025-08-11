// --- ATRIBUTOS DEL JUGADOR Y ENEMIGO ---
const player = {
    name: "Héroe",
    health: 100,
    mana: 50,
    gold: 0,
    level: 1,
    inventory: [],
    companion: null,
    enfermo: false
};

const tiendaOpciones = [
    { nombre: "Poción de curación", precio: 200, descripcion: "Recupera 30 de salud.", icono: "🧉" },
    { nombre: "Antídoto", precio: 300, descripcion: "Cura la enfermedad zombie.", icono: "🧴" },
    { nombre: "Colgante del Tiempo", precio: 500, descripcion: "Detiene el efecto de la carta El Tiempo si la posees.", icono: "🟢🔗", tipo: "objeto", usable: true },
    { nombre: "Espada Larga", precio: 800, descripcion: "Una espada larga de acero afilado.", icono: "🗡️", carta: "Espada Larga" }
];

let enemy = { name: "", health: 0, maxHealth: 0, attack: 0 };
let companion = { active: false, name: "Caballero", bonus: 20 };

// --- FUNCIONES DE INTERFAZ ---
function updatePlayerStats() {
    document.getElementById('playerName').querySelector('span').textContent = player.name;
    const healthElem = document.getElementById('playerHealth');
    let healthText = player.health;
    if (player.enfermo) {
        healthElem.classList.add('enfermo');
        healthElem.title = '¡Estás enfermo por mordedura zombie!';
        aplicarEfectoEnfermo && aplicarEfectoEnfermo();
        healthText += ' 🤢';
    } else {
        healthElem.classList.remove('enfermo');
        healthElem.title = '';
        removerEfectoEnfermo && removerEfectoEnfermo();
    }
    healthElem.querySelector('span').textContent = healthText;
    document.getElementById('playerMana').querySelector('span').textContent = player.mana;
    document.getElementById('playerGold').querySelector('span').textContent = player.gold;
    document.getElementById('playerLevel').querySelector('span').textContent = player.level;
}

function updatePlayerInventory() {
    const inv = document.getElementById('playerInventory');
    inv.innerHTML = '';
    player.inventory.forEach((item, idx) => {
        const li = document.createElement('li');
        if (item.image) {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.nombre;
            img.style.width = "28px";
            img.style.verticalAlign = "middle";
            img.style.marginRight = "6px";
            li.appendChild(img);
        }
        li.appendChild(document.createTextNode(item.nombre));
        if (item.usable) {
            const btn = document.createElement('button');
            btn.textContent = "Usar";
            btn.className = "fantasy-btn";
            btn.style.marginLeft = "8px";
            btn.onclick = () => usarObjetoInventario(idx);
            li.appendChild(btn);
        }
        inv.appendChild(li);
    });
}

function updateCompanionBox() {
    const box = document.getElementById('companionBox');
    if (player.companion === "caballero") {
        box.innerHTML = `
            <div class="companion-card">
                <span class="companion-icon">🛡️</span>
                <span class="companion-text">El Caballero te acompaña</span>
            </div>
        `;
    } else {
        box.innerHTML = '';
    }
}

// --- EFECTOS DE CARTAS ---
function handleCardEffect(card) {
    switch (card.name) {
        case "La Tienda":
            logEvent("Te encuentras en un mercado .");
            break;
        case "El Vacío":
            if (player.level > 6) {
                player.level -= 1;
                logEvent("¡Has perdido 1 nivel!");
            } else {
                logEvent("¡Consigues escapar del vacío!");
            }
            break;
        case "El Sabio":
            player.level += 1;
            logEvent("¡Has subido 1 nivel!");
            break;
        case "El Cráneo":
            iniciarCombate("Esqueleto Guerrero", 40, 15);
            resolverCombate({ nombre: "Esqueleto", fuerza: 20 });
            return;
        case "El Troll":
            if (player.level >= 3) {
                iniciarCombate("Troll Gigante", 60, 25);
                resolverCombate({ nombre: "Troll", fuerza: 30 });
            } else {
                logEvent("¡El Troll se oculta en las sombras! Necesitas ser nivel 3 para enfrentarlo.");
            }
            return;
        case "La Dama Oscura":
            if (player.level >= 4) {
                iniciarCombate("Dama Oscura", 80, 30);
                resolverCombate({ nombre: "Dama Oscura", fuerza: 40 });
            } else {
                logEvent("¡La Dama Oscura se retira! Necesitas ser nivel 4 para enfrentarte a ella.");
            }
            return;
        case "La Taberna":
            const danioEmborracharse = Math.floor(Math.random() * 20) + 1;
            player.health -= danioEmborracharse;
            logEvent(`¡Te emborrachas en la taberna y pierdes ${danioEmborracharse} de salud!`);
            if (player.health <= 0) {
                player.health = 0;
                logEvent("¡Game Over! Tu salud ha llegado a 0.");
                mostrarPantallaGameOver();
                return;
            }
            break;
        case "La Vampira":
            const danioVampira = Math.floor(Math.random() * 21) + 10;
            player.health = Math.max(0, player.health - danioVampira);
            logEvent(`¡La Vampira te ataca y te causa ${danioVampira} puntos de daño!`);
            updatePlayerStats();
            break;
        case "El Banquete":
            if (player.health < 100) {
                const saludRecuperada = Math.floor(Math.random() * 20) + 1;
                player.health = Math.min(100, player.health + saludRecuperada);
                logEvent("¡Disfrutas de un banquete y recuperas salud!");
            }
            mostrarCartaBanquete();
            logEvent(`¡Has comido mucho y te sienta mal la comida! Por tus malos modales la dama se marcha`);
            break;
        case "El Caballero":
            player.companion = "caballero";
            companion.active = true;
            logEvent("¡El Caballero te acompaña y luchará a tu lado!");
            updateCompanionBox();
            break;
        case "La espada":
            if (!player.inventory.some(item => item.nombre === "Espada")) {
                player.inventory.push({
                    nombre: "Espada",
                    img: "img/cartas/espada.png",
                    usable: false
                });
                logEvent("¡Has obtenido una espada! Se ha añadido a tu inventario.");
            }
            break;
        case "El Tiempo":
            if (player.inventory.some(item => item.nombre === "Colgante del Tiempo")) {
                logEvent("¡El Colgante del Tiempo brilla y detiene el paso del tiempo! El efecto de la carta se anula.");
                updateMessage("⏳ El Colgante del Tiempo te protege. El tiempo no avanza.");
                break;
            }
            let segundosRestantes = 100;
            updateMessage(`⏳ El Tiempo: El destino se acerca... Quedan ${segundosRestantes} segundos.`);
            logEvent("¡El Tiempo ha comenzado! Cuando la cuenta atrás termine, el juego acabará.");
            if (window.tiempoCuentaAtras) clearInterval(window.tiempoCuentaAtras);
            const cardDisplay = document.getElementById('cardDisplay');
          /*   cardDisplay.innerHTML = `
                <div class="card tiempo-efecto" id="cartaElTiempo">
                    <div class="tiempo-reloj">
                        <svg viewBox="0 0 60 90" width="60" height="90">
                            <g>
                                <rect x="18" y="10" width="24" height="8" rx="4" fill="#ffe066" stroke="#bfa76a" stroke-width="2"/>
                                <rect x="18" y="72" width="24" height="8" rx="4" fill="#ffe066" stroke="#bfa76a" stroke-width="2"/>
                                <path d="M20,18 Q30,45 20,72" stroke="#bfa76a" stroke-width="4" fill="none"/>
                                <path d="M40,18 Q30,45 40,72" stroke="#bfa76a" stroke-width="4" fill="none"/>
                                <polygon id="arenaSuperior" points="24,22 36,22 30,40" fill="#ffe066" opacity="0.8"/>
                                <polygon id="arenaInferior" points="24,78 36,78 30,60" fill="#ffe066" opacity="0.2"/>
                                <rect id="arenaCaida" x="28" y="40" width="4" height="20" rx="2" fill="#ffe066" opacity="0.7"/>
                            </g>
                        </svg>
                        <div id="tiempo-restante" style="text-align:center;font-size:1.2em;color:#bfa76a;margin-top:4px;">
                            ${segundosRestantes}s
                        </div>
                    </div>
                    <h3>El Tiempo</h3>
                    <p>El destino se acerca...</p>
                </div>
            `; */
            window.tiempoCuentaAtras = setInterval(() => {
                segundosRestantes--;
                updateMessage(`⏳ El Tiempo: El destino se acerca... Quedan ${segundosRestantes} segundos.`);
                const tiempoRestanteElem = document.getElementById('tiempo-restante');
                if (tiempoRestanteElem) tiempoRestanteElem.textContent = `${segundosRestantes}s`;
                const arenaSuperior = document.getElementById('arenaSuperior');
                const arenaInferior = document.getElementById('arenaInferior');
                if (arenaSuperior && arenaInferior) {
                    const opSup = Math.max(0.1, 0.8 * (segundosRestantes / 100));
                    const opInf = Math.min(0.8, 0.8 * (1 - segundosRestantes / 100));
                    arenaSuperior.setAttribute('opacity', opSup.toFixed(2));
                    arenaInferior.setAttribute('opacity', opInf.toFixed(2));
                }
                const cartaTiempo = document.getElementById('cartaElTiempo');
                if (segundosRestantes <= 3 && cartaTiempo) cartaTiempo.classList.add('tiempo-urgente');
                if (segundosRestantes > 3 && cartaTiempo) cartaTiempo.classList.remove('tiempo-urgente');
                if (segundosRestantes <= 0) {
                    clearInterval(window.tiempoCuentaAtras);
                    updateMessage("⏳ ¡El Tiempo ha terminado! El juego ha llegado a su fin.");
                    logEvent("¡El Tiempo ha terminado! Fin del juego.");
                    mostrarPantallaGameOver();
                }
            }, 1000);
            break;
        case "Los Zombies": {
            player.enfermo = true;
            const evento = Math.random();
            if (evento < 0.33) {
                const danio = Math.floor(Math.random() * 21) + 10;
                player.health = Math.max(0, player.health - danio);
                logEvent(`¡Los zombies te muerden! Recibes ${danio} de daño y caes enfermo. Solo una poción puede curarte.`);
                updatePlayerStats();
                mostrarAnimacionZombieAttack();
            } else if (evento < 0.66) {
                const danio = Math.floor(Math.random() * 11) + 1;
                player.health = Math.max(0, player.health - danio);
                const objetos = [
                    { nombre: "Poción de curación", tipo: "objeto", usable: true },
                    { nombre: "Antídoto", tipo: "objeto", usable: true },
                    { nombre: "Oro", tipo: "oro", cantidad: 200 }
                ];
                const objeto = objetos[Math.floor(Math.random() * objetos.length)];
                if (objeto.tipo === "oro") {
                    player.gold += objeto.cantidad;
                    logEvent(`¡Encuentras una bolsa con ${objeto.cantidad} de oro entre los restos de los zombies!`);
                } else {
                    player.inventory.push(objeto);
                    logEvent(`¡Encuentras un objeto entre los zombies: ${objeto.nombre}!`);
                }
                updatePlayerStats();
                updatePlayerInventory();
            } else {
                const perdida = Math.random();
                if (perdida < 0.5 && player.gold > 0) {
                    const oroPerdido = Math.min(player.gold, Math.floor(Math.random() * 101) + 50);
                    player.gold -= oroPerdido;
                    logEvent(`¡Escapas de los zombies, pero pierdes ${oroPerdido} de oro en la huida!`);
                } else if (player.health > 10) {
                    player.health -= 10;
                    logEvent("¡Escapas de los zombies, pero te arañan y pierdes 10 de salud!");
                } else {
                    logEvent("¡Logras escapar de los zombies por poco! No recibes daño.");
                }
                updatePlayerStats();
            }
            break;
        }
        default:
            manejarNuevasCartas(card);
            logEvent(`La carta "${card.name}" no tiene un efecto directo.`);
            break;
    }
    updatePlayerStats();
    updatePlayerInventory();
    checkGameOver();
}

// --- COMBATE ---
function iniciarCombate(nombre, salud, ataque) {
    enemy.name = nombre;
    enemy.health = salud;
    enemy.maxHealth = salud;
    enemy.attack = ataque;
    const battleModal = document.getElementById('battle-modal');
    const battleDescription = document.getElementById('battle-description');
    const battleEvents = document.getElementById('battle-events');
    const battleEndBtn = document.getElementById('battle-end-btn');
    battleDescription.textContent = `¡${enemy.name} aparece! Salud: ${enemy.health}`;
    const tieneEspada = player.inventory.some(item => item.nombre === "Espada" || item.nombre === "Espada Larga");
    battleEvents.innerHTML = `
        <button class="fantasy-btn" onclick="batallaAtacar()">
            Atacar ${tieneEspada ? '🗡️' : ''}
        </button>
        <button class="fantasy-btn" onclick="batallaDefender()">Defender</button>
    `;
    battleEndBtn.style.display = 'none';
    eventosBatalla = [];
    refrescarEventosBatalla();
    battleModal.style.display = 'flex';
    actualizarBarrasEnergia();
    mostrarBonusEspada();
    const enemyCardContainer = document.getElementById('enemyCardContainer');
    const cartaEnemigo = deckOfManyThings.find(c => c.name === nombre) || { image: `img/enemigos/${nombre}.jpg`, name: nombre };
    enemyCardContainer.innerHTML = `
        <div class="card enemigo-carta-mini">
            <img src="${cartaEnemigo.image}" alt="${cartaEnemigo.name}" class="card-image">
            <h3>${cartaEnemigo.name}</h3>
        </div>
    `;
}

let eventosBatalla = [];
function logBattleEvent(message, tipo = 'info') {
    eventosBatalla.push({ msg: message, tipo });
    refrescarEventosBatalla();
}
function refrescarEventosBatalla() {
    const battleEventList = document.getElementById('battle-event-list');
    if (!battleEventList) return;
    battleEventList.innerHTML = '';
    eventosBatalla.forEach((ev, idx) => {
        const li = document.createElement('li');
        li.textContent = ev.msg;
        if (ev.tipo === 'player') li.classList.add('battle-player');
        else if (ev.tipo === 'enemy') li.classList.add('battle-enemy');
        else li.classList.add('battle-info');
        if (idx === eventosBatalla.length - 1) li.classList.add('last-event');
        battleEventList.appendChild(li);
    });
    battleEventList.scrollTop = battleEventList.scrollHeight;
}

function efectoAtaqueEnemigo() {
    const healthElem = document.getElementById('playerHealth');
    if (!healthElem) return;
    healthElem.classList.add('attack-flash', 'vibrate');
    setTimeout(() => {
        healthElem.classList.remove('attack-flash', 'vibrate');
    }, 500);
}
function efectoAtaqueJugador() {
    const bar = document.getElementById('enemyEnergyBar');
    if (!bar) return;
    bar.classList.add('attack-flash', 'vibrate');
    setTimeout(() => {
        bar.classList.remove('attack-flash', 'vibrate');
    }, 500);
}

function batallaAtacar() {
    let danioJugador = 15;
    let bonusCaballero = 0;
    let penalizacionEnfermo = 0;
    if (player.inventory.some(item => item.nombre === "Espada" || item.nombre === "Espada Larga")) {
        danioJugador += 10;
        logBattleEvent("¡Usas tu espada para atacar con más fuerza! (+10)", 'player');
    }
    if (player.companion === "caballero" || companion.active) {
        bonusCaballero = companion.bonus;
        danioJugador += bonusCaballero;
        logBattleEvent("¡El Caballero lucha a tu lado y suma +" + bonusCaballero + " de daño!", 'player');
    }
    if (player.enfermo) {
        penalizacionEnfermo = 7;
        danioJugador -= penalizacionEnfermo;
        logBattleEvent("¡Estás enfermo y pierdes -" + penalizacionEnfermo + " de fuerza de ataque!", 'player');
    }
    danioJugador = Math.max(1, danioJugador);
    enemy.health -= danioJugador;
    logBattleEvent(`¡Atacas a ${enemy.name} e infliges ${danioJugador} de daño!`, 'player');
    efectoAtaqueJugador();
    actualizarBarrasEnergia();
    mostrarBonusEspada();
    if (enemy.health <= 0) {
        enemy.health = 0;
        actualizarBarrasEnergia();
        logBattleEvent(`¡Has vencido a ${enemy.name}!`, 'player');
        finalizarCombate(true);
        return;
    }
    player.health -= enemy.attack;
    logBattleEvent(`${enemy.name} te ataca y te inflige ${enemy.attack} de daño.`, 'enemy');
    efectoAtaqueEnemigo();
    updatePlayerStats();
    refrescarEventosTurno && refrescarEventosTurno();
    actualizarBarrasEnergia();
    if (player.health <= 0) {
        player.health = 0;
        logBattleEvent("¡Game Over! Tu salud ha llegado a 0.", 'enemy');
        finalizarCombate(false);
    } else {
        actualizarDescripcionCombate();
    }
}

function batallaDefender() {
    let danioReducido = Math.floor(enemy.attack / 2);
    player.health -= danioReducido;
    logBattleEvent(`¡Te defiendes! Solo recibes ${danioReducido} de daño de ${enemy.name}.`, 'player');
    efectoAtaqueEnemigo();
    updatePlayerStats();
    refrescarEventosTurno && refrescarEventosTurno();
    mostrarBonusEspada();
    actualizarBarrasEnergia();
    if (player.health <= 0) {
        player.health = 0;
        logBattleEvent("¡Game Over! Tu salud ha llegado a 0.", 'enemy');
        finalizarCombate(false);
    } else {
        actualizarDescripcionCombate();
    }
}

function actualizarDescripcionCombate() {
    const battleDescription = document.getElementById('battle-description');
    battleDescription.textContent = `¡${enemy.name} aparece! Salud: ${enemy.health}`;
}

// --- FINALIZAR COMBATE Y CARTAS DE VICTORIA/DERROTA ---
const cartaVictoria = {
    name: "Victoria",
    image: "img/victoria.jpg",
    description: "¡Has vencido en el combate! Recibes tu recompensa."
};
const cartaDerrota = {
    name: "Derrota",
    image: "img/cartas/derrota.jpg",
    description: "¡Has sido derrotado en el combate! Intenta recuperarte y sigue adelante."
};
function finalizarCombate(victoria) {
    const battleModal = document.getElementById('battle-modal');
    const battleEndBtn = document.getElementById('battle-end-btn');
    const battleEvents = document.getElementById('battle-events');
    if (victoria) {
        player.level += 1;
        logBattleEvent("¡Subes de nivel! Ahora eres nivel " + player.level);
        const recompensasBatalla = [
            { tipo: "oro", cantidad: 1000, mensaje: "¡Has encontrado 1000 piezas de oro!" },
            { tipo: "mana", cantidad: 20, mensaje: "¡Recuperas 20 puntos de maná!" },
            { tipo: "objeto", objeto: { nombre: "Poción de curación", img: "img/cartas/pocion.png" }, mensaje: "¡Obtienes una Poción de curación!" },
            { tipo: "objeto", objeto: { nombre: "Anillo mágico", img: "img/cartas/anillo.png" }, mensaje: "¡Encuentras un Anillo mágico!" }
        ];
        const recompensa = recompensasBatalla[Math.floor(Math.random() * recompensasBatalla.length)];
        switch (recompensa.tipo) {
            case "oro":
                player.gold += recompensa.cantidad;
                logBattleEvent(recompensa.mensaje);
                break;
            case "mana":
                player.mana = Math.min(100, player.mana + recompensa.cantidad);
                logBattleEvent(recompensa.mensaje);
                break;
            case "objeto":
                player.inventory.push(recompensa.objeto);
                logBattleEvent(recompensa.mensaje);
                break;
        }
        mostrarCartaVictoria();
        battleEvents.innerHTML = `<span style="color:#7c4a02;font-weight:bold;">¡Has vencido al enemigo!</span>`;
    } else {
        mostrarCartaDerrota();
        battleEvents.innerHTML = `<span style="color:#b22222;font-weight:bold;">¡Has sido derrotado!</span>`;
    }
    battleEndBtn.style.display = 'inline-block';
    battleEndBtn.onclick = () => {
        battleModal.style.display = 'none';
        updatePlayerStats();
        updatePlayerInventory();
        checkGameOver();
    };
}
function mostrarCartaVictoria() {
    const cardDisplay = document.getElementById('cardDisplay');
    cardDisplay.innerHTML = `
        <div class="card victoria-efecto">
            <img src="img/cartas/victoria.jpeg" alt="${cartaVictoria.name}" class="card-image">
            <h3>${cartaVictoria.name}</h3>
            <p>${cartaVictoria.description}</p>
        </div>
    `;
    const efecto = document.createElement('div');
    efecto.className = 'victoria-glow';
    cardDisplay.appendChild(efecto);
    setTimeout(() => {
        if (efecto.parentNode) efecto.parentNode.removeChild(efecto);
    }, 1500);
}
function mostrarCartaDerrota() {
    const cardDisplay = document.getElementById('cardDisplay');
    cardDisplay.innerHTML = `
        <div class="card derrota-efecto">
            <img src="${cartaDerrota.image}" alt="${cartaDerrota.name}" class="card-image">
            <h3>${cartaDerrota.name}</h3>
            <p>${cartaDerrota.description}</p>
        </div>
    `;
    const efecto = document.createElement('div');
    efecto.className = 'derrota-glow';
    cardDisplay.appendChild(efecto);
    setTimeout(() => {
        if (efecto.parentNode) efecto.parentNode.removeChild(efecto);
    }, 1500);
}

// --- INVENTARIO Y USO DE OBJETOS ---
function usarObjetoInventario(idx) {
    const item = player.inventory[idx];
    if (!item.usable) {
        logEvent("Este objeto no se puede usar.");
        return;
    }
    switch (item.nombre) {
        case "Antídoto":
            if (player.enfermo) {
                player.enfermo = false;
                logEvent("¡Usaste el Antídoto y te has curado de la enfermedad zombie!");
                removerEfectoEnfermo && removerEfectoEnfermo();
            } else {
                logEvent("El Antídoto no tiene efecto, no estás enfermo.");
            }
            player.inventory.splice(idx, 1);
            break;
        case "Poción de curación":
            player.health = Math.min(100, player.health + 30);
            if (player.enfermo) {
                player.enfermo = false;
                logEvent("¡La poción cura tu enfermedad zombie!");
                removerEfectoEnfermo && removerEfectoEnfermo();
            } else {
                logEvent("Usaste una Poción de curación y recuperaste 30 de salud.");
            }
            player.inventory.splice(idx, 1);
            break;
        case "Anillo mágico":
            player.mana = Math.min(100, player.mana + 20);
            logEvent("Usaste el Anillo mágico y recuperaste 20 de maná.");
            player.inventory.splice(idx, 1);
            break;
        case "Espada Larga":
            logEvent("Equipaste la Espada Larga. ¡Tu daño aumenta!");
            item.usable = false;
            break;
        default:
            logEvent("Este objeto no tiene un uso especial.");
    }
    updatePlayerStats();
    updatePlayerInventory();
}

// --- BARRAS DE ENERGÍA ---
function actualizarBarrasEnergia() {
    const barE = document.getElementById('enemyEnergyBar');
    const labelE = document.getElementById('enemyEnergyLabel');
    if (barE && labelE) {
        const porcentajeE = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));
        barE.style.width = porcentajeE + '%';
        labelE.textContent = `Enemigo: ${enemy.health} / ${enemy.maxHealth}`;
    }
    const barP = document.getElementById('playerEnergyBar');
    const labelP = document.getElementById('playerEnergyLabel');
    if (barP && labelP) {
        const porcentajeP = Math.max(0, Math.round((player.health / 100) * 100));
        barP.style.width = porcentajeP + '%';
        labelP.textContent = `Tú: ${player.health} / 100`;
    }
}
function mostrarBonusEspada() {
    const bonusDiv = document.getElementById('playerAttackBonus');
    if (!bonusDiv) return;
    if (player.inventory.some(item => item.nombre === "Espada" || item.nombre === "Espada Larga")) {
        bonusDiv.textContent = "¡Bonus de ataque por espada equipado! (+10)";
        bonusDiv.classList.add('active');
    } else {
        bonusDiv.textContent = "";
        bonusDiv.classList.remove('active');
    }
}

// --- ANIMACIONES ---
function mostrarAnimacionZombieAttack() {
    const cardDisplay = document.getElementById('cardDisplay');
    if (!cardDisplay) return;
    const zombieAnim = document.createElement('div');
    zombieAnim.className = 'zombie-attack-anim';
    zombieAnim.innerHTML = '🧟‍♂️';
    cardDisplay.appendChild(zombieAnim);
    setTimeout(() => {
        zombieAnim.classList.add('zombie-attack-anim-out');
        setTimeout(() => {
            if (zombieAnim.parentNode) zombieAnim.parentNode.removeChild(zombieAnim);
        }, 600);
    }, 900);
}

// --- TIENDA ---
function mostrarModalTienda() {
    let html = `<h2>Tienda de Objetos</h2>
    <div style="max-height: 340px; overflow-y: auto; margin-bottom: 12px;">
        <ul style="list-style:none;padding:0;">`;
    tiendaOpciones.forEach((obj, idx) => {
        html += `
            <li>
                <span class="tienda-icono">${obj.icono}</span>
                <div class="tienda-info">
                    <div class="tienda-nombre">${obj.nombre}</div>
                    <div class="tienda-descripcion">${obj.descripcion}</div>
                    <div class="tienda-precio"><b>${obj.precio}</b> <span style="color:#bfa76a;">🪙 oro</span></div>
                    <button class="fantasy-btn" onclick="comprarObjetoTienda(${idx})" ${player.gold < obj.precio ? 'disabled' : ''}>
                        Comprar
                    </button>
                </div>
            </li>
        `;
    });
    html += `</ul></div>
        <button class="fantasy-btn" onclick="cerrarModalTienda()">Cerrar</button>
    `;
    document.getElementById('modal-tienda-content').innerHTML = html;
    document.getElementById('modal-tienda').style.display = 'flex';
}
function cerrarModalTienda() {
    document.getElementById('modal-tienda').style.display = 'none';
}
function comprarObjetoTienda(idx) {
    const obj = tiendaOpciones[idx];
    if (player.gold >= obj.precio) {
        player.gold -= obj.precio;
        if (obj.carta) {
            const cartaArma = armasTienda && armasTienda.find(a => a.name === obj.carta);
            if (cartaArma) {
                player.inventory.push({
                    nombre: cartaArma.name,
                    image: cartaArma.image,
                    tipo: "arma",
                    usable: true
                });
            } else {
                player.inventory.push({ nombre: obj.nombre, tipo: "objeto", usable: true });
            }
        } else {
            player.inventory.push({ nombre: obj.nombre, tipo: "objeto", usable: true });
        }
        logEvent(`Has comprado ${obj.nombre} por ${obj.precio} oro.`);
        updatePlayerStats();
        updatePlayerInventory();
        mostrarModalTienda();
    } else {
        logEvent("No tienes suficiente oro para comprar este objeto.");
        mostrarModalTienda();
    }
}

// --- SISTEMA DE MENSAJES ---
function updateMessage(text, duracion = 5000) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = text;
    messageBox.classList.add('show');
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, duracion);
}

// --- GAME OVER ---
function checkGameOver() {
    if (player.health <= 0) {
        player.health = 0;
        updatePlayerStats();
        logEvent("¡Game Over!");
        mostrarPantallaGameOver();
    }
}
function mostrarPantallaGameOver() {
    document.getElementById('drawCardBtn').disabled = true;
    document.getElementById('resetDeckBtn').disabled = true;
    document.getElementById('restartGameBtn').disabled = true;
    document.getElementById('gameover-modal').style.display = 'flex';
}
document.getElementById('restartGameBtnModal').addEventListener('click', () => {
    location.reload();
});

// --- SITUACIONES Y CARTAS NUEVAS ---
const situaciones = [
    {
        descripcion: "Te encuentras en una encrucijada. ¿Qué camino eliges?",
        opciones: [
            { texto: "Camino del bosque 🌲", id: "bosque" },
            { texto: "Ir al pueblo 🏘️", id: "pueblo" }
        ]
    },
    {
        descripcion: "Un mercader ambulante te ofrece un trato.",
        opciones: [
            { texto: "Comprar una poción (pierdes 200 oro, ganas una poción)", id: "pocion" },
            { texto: "Rechazar la oferta", id: "rechazar" }
        ]
    }
];
function mostrarSituacionAleatoria() {
    const situacion = situaciones[Math.floor(Math.random() * situaciones.length)];
    const situationModal = document.getElementById('situation-modal');
    const situationDescription = document.getElementById('situation-description');
    const situationOptions = document.getElementById('situation-options');
    situationDescription.textContent = situacion.descripcion;
    situationOptions.innerHTML = situacion.opciones.map(op =>
        `<button class="fantasy-btn" onclick="elegirOpcionSituacion('${op.id}')">${op.texto}</button>`
    ).join('');
    situationModal.style.display = 'flex';
}
function elegirOpcionSituacion(opcion) {
    const situationModal = document.getElementById('situation-modal');
    situationModal.style.display = 'none';
    switch (opcion) {
        case 'bosque':
            logEvent("Has elegido adentrarte en el bosque. Puede que encuentres peligros... o tesoros.");
            player.health = Math.max(1, player.health - 10);
            player.gold += 500;
            logEvent("Pierdes 10 puntos de salud pero encuentras 500 piezas de oro entre los árboles.");
            break;
        case 'pueblo':
            logEvent("Decides ir al pueblo. Allí puedes descansar y reponer fuerzas.");
            player.health = Math.min(100, player.health + 20);
            logEvent("Recuperas 20 puntos de salud tras descansar en la posada.");
            break;
        case 'pocion':
            if (player.gold >= 200) {
                player.gold -= 200;
                player.inventory.push({ nombre: "Poción de curación", usable: true });
                logEvent("Compras una poción y la añades a tu inventario.");
            } else {
                logEvent("No tienes suficiente oro para comprar la poción.");
            }
            break;
        case 'rechazar':
            logEvent("Rechazas la oferta del mercader y sigues tu camino.");
            break;
    }
    updatePlayerStats();
    updatePlayerInventory();
}



// --- UTILIDADES Y EVENTOS ---
resetDeckBtn.addEventListener('click', () => {
    // ...código de cambio de turno...
    mostrarSituacionAleatoria();
});
document.getElementById('pauseGameBtn').addEventListener('click', pausarJuego);
document.getElementById('resumeGameBtn').addEventListener('click', reanudarJuego);

function pausarJuego() {
    if (window.tiempoCuentaAtras) clearInterval(window.tiempoCuentaAtras);
    logEvent("El juego ha sido pausado. Usa 'Continuar' para reanudar.");
}
function reanudarJuego() {
    logEvent("El juego ha sido reanudado.");
}
function logEvent(msg) {
    const eventLog = document.getElementById('eventLog');
    if (eventLog) {
        const li = document.createElement('li');
        li.textContent = msg;
        eventLog.appendChild(li);
        eventLog.scrollTop = eventLog.scrollHeight;
    }
}