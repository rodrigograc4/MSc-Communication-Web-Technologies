// URLs for APIs
const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const SPRITE_URL_FRONT = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/';
const PLAYER_POKEMON_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/';
const ENEMY_POKEMON_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/';

// DOM Elements
const startScreen = document.getElementById("start-screen");
const choosePokemonScreen = document.getElementById("choose-pokemon-screen");
const chooseMovesScreen = document.getElementById("choose-moves-screen");
const battleScreen = document.getElementById("battle-screen");
const playerNameInput = document.getElementById("player-name");
const startBtn = document.getElementById("start-btn");
const pokemonOptions = document.getElementById("pokemon-options");
const moveOptions = document.getElementById("move-options");
const startBattleBtn = document.getElementById("start-battle-btn");
const restartBtn = document.getElementById("restart-btn");
const loadingBattle = document.getElementById("loading-battle");
const battle = document.getElementById("battle");

let selectedPokemon = null;
let selectedMoves = [];
let playerName = null;

// Capitalize a given word
function capitalize(word) {
    word = word.toLowerCase();
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalized;
}

// Start the game
startBtn.addEventListener("click", startGame);
function startGame() {
    playerName = playerNameInput.value.toUpperCase();
    if (!playerName) {
        alert("Please enter your Name!");
        return;
    }
    console.log("Player Name: ", playerName);
    startScreen.classList.add("hidden");
    choosePokemonScreen.classList.remove("hidden");
}

// Load Pokemon options to choose from
async function loadPokemonOptions() {
    const randomPokemonIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 493) + 1);

    for (let id of randomPokemonIds) {
        const pokemonData = await fetch(`${POKEMON_API_URL}${id}`).then(res => res.json());

        const card = document.createElement('div');
        card.classList.add("pokemon-card");
        card.innerHTML = `
            <div class="pokemon-card-content">
                <img src="${SPRITE_URL_FRONT}${pokemonData.id}.png" alt="${pokemonData.name}" class="pokemon-image">
                <div class="pokemon-info">
                    <p class="pokemon-name">${pokemonData.name}</p>
                    <p class="pokemon-number">#${pokemonData.id}</p>
                </div>
            </div>
        `;

        card.addEventListener("click", () => selectPokemon(pokemonData));
        pokemonOptions.appendChild(card);
    }
    pokemonOptions.classList.add('pokemon-options');
}

loadPokemonOptions();

// Select a Pokemon
function selectPokemon(pokemonData) {
    selectedPokemon = pokemonData;
    console.log("Pokemon Name: ", capitalize(selectedPokemon.name));
    console.log("Pokemon Id: ", selectedPokemon.id);
    choosePokemonScreen.classList.add("hidden");
    chooseMovesScreen.classList.remove("hidden");
    loadMoveOptions(selectedPokemon.moves);
}

// Load move options to choose from
async function loadMoveOptions(moves) {
    const randomMoves = moves.sort(() => 0.5 - Math.random()).slice(0, 8);
    moveOptions.innerHTML = '';

    for (const move of randomMoves) {
        try {
            const moveDetails = await fetch(move.move.url).then(res => res.json());
            const power = moveDetails.power || 40;
            const accuracy = moveDetails.accuracy || 100;

            const moveCard = document.createElement('div');
            moveCard.classList.add("move-card");
            moveCard.innerHTML = `
                <div class="row">
                    <div class="col-md-12">
                        <p class="move-name">${capitalize(move.move.name)}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <p class="move-power">Power: </p>
                    </div>
                    <div class="col-md-6">
                        <p class="move-power">${power}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <p class="move-power">Accuracy: </p>
                    </div>
                    <div class="col-md-6">
                        <p class="move-power">${accuracy}</p>
                    </div>
                </div>
            `;

            moveCard.addEventListener("click", () => selectMove(move, moveCard));
            moveOptions.appendChild(moveCard);
            moveOptions.classList.add('move-options');
        } catch (error) {
            console.error("Error fetching move details:", error);
        }
    }
}

// Select a move
function selectMove(move, moveCard) {
    if (selectedMoves.includes(move)) {
        moveCard.classList.remove("selected");
        selectedMoves = selectedMoves.filter(m => m !== move);
    } else {
        if (selectedMoves.length >= 4) {
            alert("You already selected 4 moves!");
            return;
        }
        selectedMoves.push(move);
        moveCard.classList.add("selected");
    }
    startBattleBtn.classList.toggle("hidden", selectedMoves.length < 1);
}

// Create player's Pokemon
function createPlayerPokemon() {
    playerBaseHp = selectedPokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
    playerMaxHp = calculateHP(playerBaseHp);

    playerPokemon = {
        name: selectedPokemon.name.toUpperCase(),
        moves: selectedMoves.map(move => move.move.name.toUpperCase()),
        hp: playerMaxHp,
        attack: selectedPokemon.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: selectedPokemon.stats.find(stat => stat.stat.name === 'defense').base_stat,
        special_attack: selectedPokemon.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
        special_defense: selectedPokemon.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
        speed: selectedPokemon.stats.find(stat => stat.stat.name === 'speed').base_stat,
        image: `${PLAYER_POKEMON_SPRITE_URL}${selectedPokemon.id}.gif`
    };
    console.log("Player Pokemon: ", playerPokemon);
}

// Create enemy Pokemon
let enemyMaxHp = 0;
async function createEnemyPokemon() {
    const randomEnemyId = Math.floor(Math.random() * 493) + 1;
    const enemyData = await fetch(`${POKEMON_API_URL}${randomEnemyId}`).then(res => res.json());

    enemyBaseHp = enemyData.stats.find(stat => stat.stat.name === 'hp').base_stat;
    enemyMaxHp = calculateHP(enemyBaseHp);

    enemyPokemon = {
        name: enemyData.name.toUpperCase(),
        hp: enemyMaxHp,
        attack: enemyData.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: enemyData.stats.find(stat => stat.stat.name === 'defense').base_stat,
        special_attack: enemyData.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
        special_defense: enemyData.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
        speed: enemyData.stats.find(stat => stat.stat.name === 'speed').base_stat,
        moves: enemyData.moves.sort(() => 0.5 - Math.random()).slice(0, 4).map(move => move.move.name.toUpperCase()),
        image: `${ENEMY_POKEMON_SPRITE_URL}${randomEnemyId}.gif`
    };

    console.log("Enemy Data: ", enemyData);
    console.log("Enemy Pokemon: ", enemyPokemon);
}

// Function to calculate HP
function calculateHP(baseHP) {
    const level = 100;
    const iv = 31;
    const ev = 252;
    const hp = Math.floor(((2 * baseHP + iv + (ev / 4)) * level) / 100) + level + 10;
    return hp;
}

// Start the battle
startBattleBtn.addEventListener("click", startBattle);
async function startBattle() {
    createPlayerPokemon();
    await createEnemyPokemon();
    document.querySelector(".player-name").textContent = playerName;
    document.querySelector(".enemy-name").textContent = enemyPokemon.name;

    chooseMovesScreen.classList.add("hidden");
    battleScreen.classList.remove("hidden");

    setTimeout(() => battle.classList.remove("hidden"), 2000);

    fasterPokemon();
    battleFunction();
}

// Continue the battle after winning
async function continueBattle() {
    createPlayerPokemon();
    await createEnemyPokemon();
    document.querySelector(".enemy-name").textContent = enemyPokemon.name;

    document.getElementById("continue-btn").classList.add("hidden");
    battleScreen.classList.remove("hidden");

    setTimeout(() => battle.classList.remove("hidden"), 2000);

    fasterPokemon();
    battleFunction();
}

// Battle logic management
function battleFunction() {
    console.log("The battle has begun!");
    updateBattleScreen();
    startTurn();
}

// Update the battle screen with current stats
function updateBattleScreen() {
    document.querySelector(".player-pokemon-name").textContent = playerPokemon.name;
    document.querySelector(".enemy-pokemon-name").textContent = enemyPokemon.name;
    document.querySelector(".player-pokemon-hp-text").textContent = `HP: ${playerPokemon.hp}`;
    document.querySelector(".enemy-pokemon-hp-text").textContent = `HP: ${enemyPokemon.hp}`;
    document.querySelector(".player-pokemon-image").src = playerPokemon.image;
    document.querySelector(".enemy-pokemon-image").src = enemyPokemon.image;

    const playerHpPercentage = (playerPokemon.hp / playerMaxHp) * 100;
    const enemyHpPercentage = (enemyPokemon.hp / enemyMaxHp) * 100;

    document.querySelector(".player-pokemon-hp-bar").style.width = `${playerHpPercentage}%`;
    document.querySelector(".enemy-pokemon-hp-bar").style.width = `${enemyHpPercentage}%`;
}

// Function to determine which Pokemon goes first
let currentTurn;
function fasterPokemon() {
    if (!playerPokemon || !enemyPokemon) {
        console.error("Player or enemy Pokemon is not defined!");
        return;
    }

    if (playerPokemon.speed > enemyPokemon.speed) {
        currentTurn = "player";
    } else if (enemyPokemon.speed > playerPokemon.speed) {
        currentTurn = "enemy";
    } else {
        currentTurn = Math.random() < 0.5 ? "player" : "enemy";
    }
    return currentTurn;
}

const fightBtn = document.getElementById("fight-btn");
fightBtn.addEventListener("click", () => {
    document.getElementById("choose-moves").classList.remove("hidden");
    fightBtn.classList.add("hidden");
});

const chooseMovesContainer = document.getElementById("choose-moves");

// Variables to store the chosen moves
let playerChosenMove = null;
let enemyChosenMove = null;

// Function to start the turn
function startTurn() {
    playerChosenMove = null;
    enemyChosenMove = null;

    playerTurn();
}

// Function to handle the player's turn
function playerTurn() {
    const moveButtons = document.getElementById("choose-moves");
    moveButtons.classList.add("hidden");
    fightBtn.classList.remove("hidden");

    fightBtn.addEventListener("click", () => {
        fightBtn.classList.add("hidden");
        moveButtons.classList.remove("hidden");
    });

    moveButtons.innerHTML = "";
    playerPokemon.moves.forEach((moveName, index) => {
        const moveButton = document.createElement("button");
        moveButton.textContent = moveName;
        moveButton.classList.add("move-btn");

        moveButton.addEventListener("click", () => {
            playerChosenMove = index;
            moveButtons.classList.add("hidden");

            if (enemyChosenMove === null) {
                enemyTurn();
            } else {
                executeMoves();
            }
        });

        moveButtons.appendChild(moveButton);
    });

    moveButtons.style.display = "grid";
    moveButtons.style.gridTemplateColumns = "1fr 1fr";
    moveButtons.style.gap = "10px";
    moveButtons.style.marginTop = "0px";

    const moveBtns = document.querySelectorAll('.move-btn');
    moveBtns.forEach(btn => {
        btn.style.width = '100%';
        btn.style.height = '50% - 10px';
    });
}

// Function to handle the enemy's turn
function enemyTurn() {
    enemyChosenMove = Math.floor(Math.random() * enemyPokemon.moves.length);

    if (playerChosenMove === null) {
        return;
    } else {
        executeMoves();
    }
}

// Function to execute the moves
async function executeMoves() {
    const playerSpeed = playerPokemon.speed;
    const enemySpeed = enemyPokemon.speed;

    const nextTurn = () => {
        if (playerPokemon.hp > 0 && enemyPokemon.hp > 0) {
            setTimeout(startTurn, 1000);
        } else {
            endBattle(playerPokemon.hp > 0 ? "player" : "enemy");
        }
    };

    const performPlayerMove = async () => {
        await useMove("player", playerChosenMove);
        if (enemyPokemon.hp > 0) {
            setTimeout(performEnemyMove, 1000);
        } else {
            endBattle("player");
        }
    };

    const performEnemyMove = async () => {
        await useMove("enemy", enemyChosenMove);
        if (playerPokemon.hp > 0) {
            setTimeout(async () => {
                await useMove("player", playerChosenMove);
                nextTurn();
            }, 1000);
        } else {
            endBattle("enemy");
        }
    };

    if (playerSpeed > enemySpeed) {
        await performPlayerMove();
    } else if (enemySpeed > playerSpeed) {
        await performEnemyMove();
    } else {
        const firstAttacker = Math.random() < 0.5 ? "player" : "enemy";
        if (firstAttacker === "player") {
            await performPlayerMove();
        } else {
            await performEnemyMove();
        }
    }
}


// Function to use the move chosed
async function useMove(user, moveIndex) {
    const attacker = user === "player" ? playerPokemon : enemyPokemon;
    const defender = user === "player" ? enemyPokemon : playerPokemon;
    const moveName = attacker.moves[moveIndex];

    let movePower = 40;
    let moveAccuracy = 100;
    try {
        let moveUrl;
        if (user === "player") {
            const playerMove = selectedMoves.find(move => move.move.name.toUpperCase() === moveName);
            moveUrl = playerMove ? playerMove.move.url : null;
        } else {
            const moveDetails = enemyPokemon.moves[moveIndex];
            moveUrl = `https://pokeapi.co/api/v2/move/${moveDetails.toLowerCase()}/`;
        }

        if (moveUrl) {
            const moveData = await fetch(moveUrl).then(res => res.json());
            movePower = moveData.power || 40;
            moveAccuracy = moveData.accuracy || 100;
        }
    } catch (error) {
        console.error("Error fetching move details from API:", error);
    }

    const hitChance = Math.random() * 100;
    if (hitChance > moveAccuracy) {
        addBattleLog(`${attacker.name} used ${moveName}, but it missed!`);
        currentTurn = currentTurn === "player" ? "enemy" : "player";
        setTimeout(startTurn, 1000);
        return;
    }


    addBattleLog(`${attacker.name} used ${moveName}!`);

    const damage = damageCalculation(attacker, defender, movePower);
    defender.hp -= damage;

    addBattleLog(`${defender.name} suffered ${damage} damage!`);

    const defenderImage = user === "player" ? document.querySelector(".enemy-pokemon-image") : document.querySelector(".player-pokemon-image");
    defenderImage.classList.add("flash-damage");

    setTimeout(() => {
        defenderImage.classList.remove("flash-damage");
    }, 200);

    updateBattleScreen();

    if (defender.hp <= 0) {
        defender.hp = 0;
        endBattle(user);
    } else {
        currentTurn = currentTurn === "player" ? "enemy" : "player";
        setTimeout(startTurn, 1000);
    }
}

// Function to calculate the damage
function damageCalculation(attacker, defender, movePower) {
    const attackerLevel = 100;
    const attackAverage = (attacker.attack + attacker.special_attack) / 2;
    const defenseAverage = (defender.defense + defender.special_defense) / 2;
    const moveDamage = Math.floor(((((2 * attackerLevel) / 5 + 2) * movePower * (attackAverage / defenseAverage)) / 50) + 2);
    return moveDamage;
}

// Function to add messages to the battle log
function addBattleLog(message) {
    const logList = document.getElementById('log-list');
    const battleLogContainer = document.querySelector('.battle-log');

    const logItem = document.createElement('li');
    logItem.textContent = message;
    logList.appendChild(logItem);

    battleLogContainer.scrollTop = battleLogContainer.scrollHeight;
}

let victories = 0; // Variable to count the number of victories

// Function to handle the end of the battle
function endBattle(winner) {
    const moveButtons = document.getElementById("choose-moves");
    const fightBtn = document.getElementById("fight-btn");
    moveButtons.classList.add("hidden");
    fightBtn.classList.add("hidden");

    document.getElementById('log-list').innerHTML = "";

    if (winner === "player") {
        continueAfterWin();
    }

    if (winner === "enemy") {
        restartAfterLose();
    }
}

// Function to continue the game after a win
function continueAfterWin() {
    const continueBtn = document.getElementById("continue-btn");

    addBattleLog(`${playerName} WON THE BATTLE!`);
    addBattleLog(`${enemyPokemon.name} has fainted!`);

    const winnerName = playerName;
    const battleMessage = `${winnerName} WON!`;

    enemyPokemon.hp = 0;
    updateBattleScreen();

    document.querySelector(".enemy-pokemon-image").src = "./images/transparent.png";
    document.querySelector(".player-name").textContent = battleMessage;
    document.querySelector(".battle-tittle").textContent = "";
    document.querySelector(".enemy-name").textContent = "";

    continueBtn.classList.remove("hidden");

    continueBtn.removeEventListener("click", handleContinueBattle);
    continueBtn.addEventListener("click", handleContinueBattle);
}

// Separate function to handle continuing the battle
function handleContinueBattle() {
    const continueBtn = document.getElementById("continue-btn");
    continueBtn.classList.add("hidden");

    victories += 1;
    console.log("Victories: ", victories);
    document.querySelector(".player-name").textContent = `${playerName} - ${victories} W`;

    continueBattle();
}

// Function to restart the game after a loss
function restartAfterLose() {
    const continueBtn = document.getElementById("continue-btn");

    addBattleLog(`${enemyPokemon.name} WON THE BATTLE!`);
    addBattleLog(`${playerName} Pokemon has fainted!`);

    const winnerName = enemyPokemon.name;
    const battleMessage = `${winnerName} WON!`;

    playerPokemon.hp = 0;
    updateBattleScreen();

    document.querySelector(".player-pokemon-image").src = "./images/transparent.png";
    document.querySelector(".enemy-name").textContent = battleMessage;
    document.querySelector(".battle-tittle").textContent = "";
    document.querySelector(".player-name").textContent = "";

    continueBtn.classList.remove("hidden");

    continueBtn.removeEventListener("click", handleRestartGame);
    continueBtn.addEventListener("click", handleRestartGame);
}

// Function to reset the game and go back to the start screen
function handleRestartGame() {
    selectedPokemon = null;
    selectedMoves = [];
    playerPokemon = null;
    enemyPokemon = null;
    playerName = null;
    victories = 0;
    currentTurn = "player";

    pokemonOptions.innerHTML = '';
    moveOptions.innerHTML = '';
    document.getElementById('log-list').innerHTML = '';

    document.querySelector(".player-pokemon-hp-bar").style.width = "100%";
    document.querySelector(".enemy-pokemon-hp-bar").style.width = "100%";
    document.querySelector(".player-pokemon-image").src = "./images/transparent.png";
    document.querySelector(".enemy-pokemon-image").src = "./images/transparent.png";

    document.querySelector(".player-name").textContent = '';
    document.querySelector(".enemy-name").textContent = '';

    battleScreen.classList.add("hidden");
    choosePokemonScreen.classList.add("hidden");
    chooseMovesScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    document.getElementById("continue-btn").classList.add("hidden");

    loadPokemonOptions();

    console.log("Game has been reset. Ready for a new battle!");
}
