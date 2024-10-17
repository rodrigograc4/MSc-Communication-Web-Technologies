// URLs da API
const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const SPRITE_URL_FRONT = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/';
const SPRITE_URL_BACK = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/';

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
const battleLog = document.getElementById("battle-log");
const restartBtn = document.getElementById("restart-btn");

let selectedPokemon = null;
let selectedMoves = [];
let playerPokemon = {};
let enemyPokemon = {};

function capitalize(word) {
    word = word.toLowerCase();
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalized;
}

startBtn.addEventListener("click", startGame);

function startGame() {
    const playerName = playerNameInput.value;
    if (playerName === "") {
        alert("Please enter your Name!");
        return;
    }
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
    console.log("Pokemon Name: ", capitalize(pokemonData.name));
    console.log("Pokemon Id: ", pokemonData.id);
    choosePokemonScreen.classList.add("hidden");
    chooseMovesScreen.classList.remove("hidden");

    loadMoveOptions(pokemonData.moves);
}

async function loadMoveOptions(moves) {
    const randomMoves = moves.sort(() => 0.5 - Math.random()).slice(0, 8);

    for (const move of randomMoves) {
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
    chooseMovesScreen.classList.add("hidden");
    battleScreen.classList.remove("hidden");

    playerPokemon = {
        name: selectedPokemon.name,
        moves: selectedMoves,
        hp: selectedPokemon.stats.find(stat => stat.stat.name === 'hp').base_stat
    };

    const randomEnemyId = Math.floor(Math.random() * 493) + 1;
    const enemyData = await fetch(`${POKEMON_API_URL}${randomEnemyId}`).then(res => res.json());

    enemyPokemon = {
        name: enemyData.name,
        hp: enemyData.stats.find(stat => stat.stat.name === 'hp').base_stat,
        moves: enemyData.moves.sort(() => 0.5 - Math.random()).slice(0, 4)
    };

    battleLog.innerHTML = `Você está batalhando contra ${enemyPokemon.name}!`;

    // Aqui deve estar a lógica da batalha por turnos, baseada no HP e nos movimentos
}

// Reiniciar o jogo
restartBtn.addEventListener("click", () => {
    location.reload();
});
