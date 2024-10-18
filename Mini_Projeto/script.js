// URLs da API
const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const SPRITE_URL_FRONT = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/';
const PLAYER_POKEMON_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/';
const ENEMY_POKEMON_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/';

// Elementos do DOM
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

function capitalize(word) {
    word = word.toLowerCase();
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalized;
}

startBtn.addEventListener("click", startGame);
let playerName = null;

function startGame() {
    playerName = playerNameInput.value;
    if (playerName === "") {
        alert("Please enter your Name!");
        return;
    }
    playerName = playerName.toUpperCase();
    console.log("Player Name: ", playerName);
    startScreen.classList.add("hidden");
    choosePokemonScreen.classList.remove("hidden");
}

async function loadPokemonOptions() {
    const randomPokemonIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 493) + 1);

    for (let id of randomPokemonIds) {
        const pokemonData = await fetch(`${POKEMON_API_URL}${id}`).then(res => res.json());
        const card = document.createElement('div');
        card.classList.add("pokemon-card");

        card.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${SPRITE_URL_FRONT}${pokemonData.id}.png" alt="${pokemonData.name}" class="pokemon-image">
                </div>
                <div class="col-md-8">
                    <p class="pokemon-name">${pokemonData.name}</p>
                    <p class="pokemon-number">#${pokemonData.id}</p>
                </div>
            </div>
        `;

        card.addEventListener("click", () => selectPokemon(pokemonData));
        pokemonOptions.appendChild(card);
        pokemonOptions.classList.add('pokemon-options');
    }
}
loadPokemonOptions();

function selectPokemon(pokemonData) {
    selectedPokemon = pokemonData;
    console.log("Pokemon Name: ", capitalize(selectedPokemon.name));
    console.log("Pokemon Id: ", selectedPokemon.id);
    choosePokemonScreen.classList.add("hidden");
    chooseMovesScreen.classList.remove("hidden");

    loadMoveOptions(selectedPokemon.moves);
}

async function loadMoveOptions(moves) {
    const randomMoves = moves.sort(() => 0.5 - Math.random()).slice(0, 8);

    for (const move of randomMoves) {
        // Fetch the move details from the API, if not found, skip the move
        const moveDetails = await fetch(move.move.url).then(res => res.json()).catch(err => console.log(err));

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
    }
}

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

    if (selectedMoves.length === 4) {
        startBattleBtn.classList.remove("hidden");
    } else {
        startBattleBtn.classList.add("hidden");
    }
}

// Iniciar a batalha
startBattleBtn.addEventListener("click", startBattle);

async function startBattle() {
    playerPokemon();
    await enemyPokemon();

    // Inserir os nomes do jogador e do Pokémon inimigo no HTML
    document.querySelector(".player-name").textContent = playerName;
    document.querySelector(".enemy-name").textContent = enemyPokemon.name;

    chooseMovesScreen.classList.add("hidden");
    battleScreen.classList.remove("hidden");

    setTimeout(() => {
        loadingBattle.classList.add("hidden");
        battle.classList.remove("hidden");
    }, 2000);

    battleFunction();
}

function playerPokemon() {
    playerPokemon = {
        name: selectedPokemon.name.toUpperCase(),
        moves: selectedMoves.map(move => move.move.name.toUpperCase()),
        hp: selectedPokemon.stats.find(stat => stat.stat.name === 'hp').base_stat * 4,
        image: `${PLAYER_POKEMON_SPRITE_URL}${selectedPokemon.id}.png`
    };

    console.log("Player Pokemon: ", playerPokemon);
}

async function enemyPokemon() {
    const randomEnemyId = Math.floor(Math.random() * 493) + 1;
    const enemyData = await fetch(`${POKEMON_API_URL}${randomEnemyId}`).then(res => res.json());

    enemyPokemon = {
        name: enemyData.name.toUpperCase(),
        hp: enemyData.stats.find(stat => stat.stat.name === 'hp').base_stat * 4,
        moves: enemyData.moves.sort(() => 0.5 - Math.random()).slice(0, 4).map(move => move.move.name.toUpperCase()),
        image: `${ENEMY_POKEMON_SPRITE_URL}${randomEnemyId}.gif`
    };

    console.log("Enemy Data: ", enemyData);
    console.log("Enemy Pokemon: ", enemyPokemon);
}

let currentTurn = "player"; // Começamos com o turno do jogador

// Função para iniciar a batalha
function battleFunction() {
    console.log("A batalha começou!");
    updateBattleScreen();
    startTurn();
}

// Atualiza a interface com os dados dos Pokémon
function updateBattleScreen() {
    document.querySelector(".player-pokemon-name").textContent = playerPokemon.name;
    document.querySelector(".enemy-pokemon-name").textContent = enemyPokemon.name;
    document.querySelector(".player-pokemon-hp-text").textContent = `HP: ${playerPokemon.hp}`;
    document.querySelector(".enemy-pokemon-hp-text").textContent = `HP: ${enemyPokemon.hp}`;
    document.querySelector(".player-pokemon-image").src = playerPokemon.image;
    document.querySelector(".enemy-pokemon-image").src = enemyPokemon.image;

    const playerHpPercentage = (playerPokemon.hp / (selectedPokemon.stats.find(stat => stat.stat.name === 'hp').base_stat * 4)) * 100;
    const enemyHpPercentage = (enemyPokemon.hp / (enemyPokemon.hp)) * 100;

    document.querySelector(".player-pokemon-hp-bar").style.width = `${playerHpPercentage}%`;
    document.querySelector(".enemy-pokemon-hp-bar").style.width = `${enemyHpPercentage}%`;
}

// Função para iniciar o turno
function startTurn() {
    if (currentTurn === "player") {
        playerTurn();
    } else {
        enemyTurn();
    }
}

// Turno do jogador
function playerTurn() {
    console.log("É o turno do jogador!");

    // Exibir os botões de movimentos para o jogador escolher
    const moveButtons = document.getElementById("choose-moves");
    moveButtons.innerHTML = "";

    playerPokemon.moves.forEach((moveName, index) => {
        const moveButton = document.createElement("button");
        moveButton.textContent = moveName;
        moveButton.addEventListener("click", () => useMove("player", index));
        moveButtons.appendChild(moveButton);
    });
}

// Turno do inimigo
function enemyTurn() {
    console.log("É o turno do inimigo!");

    // Escolher um movimento aleatório para o inimigo
    const randomMoveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
    useMove("enemy", randomMoveIndex);
}

// Função para usar um movimento
function useMove(user, moveIndex) {
    const attacker = user === "player" ? playerPokemon : enemyPokemon;
    const defender = user === "player" ? enemyPokemon : playerPokemon;
    const moveName = attacker.moves[moveIndex];
    const movePower = 40; // Para simplificar, vamos considerar todos os movimentos com 40 de poder

    console.log(`${attacker.name} usou ${moveName}!`);

    // Calcular o dano (simplesmente baseado no poder do movimento para esta implementação)
    const damage = Math.floor(Math.random() * (movePower / 2) + movePower / 2);
    defender.hp -= damage;

    console.log(`${defender.name} sofreu ${damage} de dano!`);

    // Atualizar a tela
    updateBattleScreen();

    // Verificar se o Pokémon defensor ainda tem HP
    if (defender.hp <= 0) {
        defender.hp = 0;
        endBattle(user);
    } else {
        // Alternar o turno
        currentTurn = currentTurn === "player" ? "enemy" : "player";
        setTimeout(startTurn, 1000); // Esperar 1 segundo antes do próximo turno
    }
}

// Função para terminar a batalha
function endBattle(winner) {
    const winnerName = winner === "player" ? playerPokemon.name : enemyPokemon.name;
    alert(`${winnerName} venceu a batalha!`);
    console.log(`${winnerName} venceu a batalha!`);
    document.getElementById("fight-button").classList.add("hidden"); // Esconder o botão "Fight" quando a batalha termina
}

// Reiniciar o jogo
restartBtn.addEventListener("click", () => {
    location.reload();
});