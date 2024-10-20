// URLs da API
const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const SPRITE_URL_FRONT = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/';
const PLAYER_POKEMON_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/';
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

function createPlayerPokemon() {
    playerPokemon = {
        name: selectedPokemon.name.toUpperCase(),
        moves: selectedMoves.map(move => move.move.name.toUpperCase()),
        hp: selectedPokemon.stats.find(stat => stat.stat.name === 'hp').base_stat * 4,
        image: `${PLAYER_POKEMON_SPRITE_URL}${selectedPokemon.id}.gif`
    };

    console.log("Player Pokemon: ", playerPokemon);
}

let enemyMaxHp = 0;
async function createEnemyPokemon() {
    const randomEnemyId = Math.floor(Math.random() * 493) + 1;
    const enemyData = await fetch(`${POKEMON_API_URL}${randomEnemyId}`).then(res => res.json());

    const hpStat = enemyData.stats.find(stat => stat.stat.name === 'hp').base_stat;
    enemyMaxHp = hpStat * 4; // Armazena o HP máximo do inimigo

    enemyPokemon = {
        name: enemyData.name.toUpperCase(),
        hp: enemyData.stats.find(stat => stat.stat.name === 'hp').base_stat * 4,
        moves: enemyData.moves.sort(() => 0.5 - Math.random()).slice(0, 4).map(move => move.move.name.toUpperCase()),
        image: `${ENEMY_POKEMON_SPRITE_URL}${randomEnemyId}.gif`
    };

    console.log("Enemy Data: ", enemyData);
    console.log("Enemy Pokemon: ", enemyPokemon);
}

// Iniciar a batalha
startBattleBtn.addEventListener("click", startBattle);
async function startBattle() {
    createPlayerPokemon();
    await createEnemyPokemon();

    // Inserir os nomes do jogador e do Pokémon inimigo no HTML
    document.querySelector(".player-name").textContent = playerName;
    document.querySelector(".enemy-name").textContent = enemyPokemon.name;

    chooseMovesScreen.classList.add("hidden");
    battleScreen.classList.remove("hidden");

    setTimeout(() => {
        battle.classList.remove("hidden");
    }, 2000);

    battleFunction();
}

async function restartBattle() {

    createPlayerPokemon();
    await createEnemyPokemon();

    // Inserir os nomes do jogador e do Pokémon inimigo no HTML
    document.querySelector(".enemy-name").textContent = enemyPokemon.name;

    const continueBtn = document.getElementById("continue-btn");

    continueBtn.classList.add("hidden");
    battleScreen.classList.remove("hidden");

    setTimeout(() => {
        battle.classList.remove("hidden");
    }, 2000);

    battleFunction();
}

let currentTurn = "player"; // Começamos com o turno do jogador

// Função para iniciar a batalha
function battleFunction() {
    console.log("A batalha começou!");
    updateBattleScreen();
    startTurn();
}

function updateBattleScreen() {
    document.querySelector(".player-pokemon-name").textContent = playerPokemon.name;
    document.querySelector(".enemy-pokemon-name").textContent = enemyPokemon.name;
    document.querySelector(".player-pokemon-hp-text").textContent = `HP: ${playerPokemon.hp}`;
    document.querySelector(".enemy-pokemon-hp-text").textContent = `HP: ${enemyPokemon.hp}`;
    document.querySelector(".player-pokemon-image").src = playerPokemon.image;
    document.querySelector(".enemy-pokemon-image").src = enemyPokemon.image;

    const playerHpPercentage = (playerPokemon.hp / (selectedPokemon.stats.find(stat => stat.stat.name === 'hp').base_stat * 4)) * 100;
    const enemyHpPercentage = (enemyPokemon.hp / enemyMaxHp) * 100; // Corrigido

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

const fightBtn = document.getElementById("fight-btn");
fightBtn.addEventListener("click", () => {
    // Mostrar os movimentos
    document.getElementById("choose-moves").classList.remove("hidden");
    // Esconder o botão "Fight"
    fightBtn.classList.add("hidden");
});

const chooseMovesContainer = document.getElementById("choose-moves");

/// Turno do jogador
function playerTurn() {
    console.log("É o turno do jogador!");

    // Inicialmente, esconder os botões de movimentos e mostrar o botão "Fight"
    const moveButtons = document.getElementById("choose-moves");
    moveButtons.classList.add("hidden");
    fightBtn.classList.remove("hidden");

    // Quando o botão "Fight" for clicado
    fightBtn.addEventListener("click", () => {
        // Mostrar os botões de movimentos
        fightBtn.classList.add("hidden");
        moveButtons.classList.remove("hidden");
    });

    // Configuração dos botões de movimento
    moveButtons.innerHTML = "";
    playerPokemon.moves.forEach((moveName, index) => {
        const moveButton = document.createElement("button");
        moveButton.textContent = moveName;
        moveButton.classList.add("move-btn");

        // Adicionando evento para usar o movimento
        moveButton.addEventListener("click", () => {
            useMove("player", index);
            // Ocultar os botões de movimentos por 3 segundos após a seleção
            moveButtons.classList.add("hidden");
        });

        // Adicionando o botão ao contêiner
        moveButtons.appendChild(moveButton);
    });

    // Organizar os botões em duas colunas (2 por linha)
    moveButtons.style.display = "grid";
    moveButtons.style.gridTemplateColumns = "1fr 1fr";
    moveButtons.style.gap = "10px";
    moveButtons.style.marginTop = "0px";

    // Garantir que todos os botões tenham o mesmo tamanho
    const moveBtns = document.querySelectorAll('.move-btn');
    moveBtns.forEach(btn => {
        btn.style.width = '100%';
        btn.style.height = '50% - 10px';
    });
}

// Função para usar um movimento
function useMove(user, moveIndex) {
    const attacker = user === "player" ? playerPokemon : enemyPokemon;
    const defender = user === "player" ? enemyPokemon : playerPokemon;
    const moveName = attacker.moves[moveIndex];
    const movePower = 40; // Para simplificar, vamos considerar todos os movimentos com 40 de poder

    console.log(`${attacker.name} usou ${moveName}!`);
    addBattleLog(`${attacker.name} used ${moveName}!`);

    // Calcular o dano (simplesmente baseado no poder do movimento para esta implementação)
    const damage = Math.floor(Math.random() * (movePower / 2) + movePower / 2);
    defender.hp -= damage;

    console.log(`${defender.name} sofreu ${damage} de dano!`);
    addBattleLog(`${defender.name} suffered ${damage} damage!`);

    // Adicionar efeito de dano
    const defenderImage = user === "player" ? document.querySelector(".enemy-pokemon-image") : document.querySelector(".player-pokemon-image");
    defenderImage.classList.add("flash-damage");

    // Remover o efeito de dano após 300 milissegundos
    setTimeout(() => {
        defenderImage.classList.remove("flash-damage");
    }, 200);

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

function addBattleLog(message) {
    const logList = document.getElementById('log-list');
    const battleLogContainer = document.querySelector('.battle-log'); // Seleciona o contêiner pai que tem overflow-y

    const logItem = document.createElement('li');
    logItem.textContent = message;
    logList.appendChild(logItem);

    // Rolar para o final do contêiner pai, não apenas a lista
    battleLogContainer.scrollTop = battleLogContainer.scrollHeight;
}
// Turno do inimigo
function enemyTurn() {
    console.log("É o turno do inimigo!");

    // Escolher um movimento aleatório para o inimigo
    const randomMoveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
    useMove("enemy", randomMoveIndex);
}

let victories = 0; // Variável para contar o número de vitórias

function endBattle(winner) {
    console.log("A batalha acabou!");

    const moveButtons = document.getElementById("choose-moves");
    const fightBtn = document.getElementById("fight-btn");
    const continueBtn = document.getElementById("continue-btn");
    moveButtons.classList.add("hidden");
    fightBtn.classList.add("hidden");

    //limpar lista de logs
    document.getElementById('log-list').innerHTML = "";

    // Adiciona a mensagem de vitória ao log
    addBattleLog(`${playerName} WON THE BATTLE!`);
    addBattleLog(`${enemyPokemon.name} has fainted!`);


    // Define o nome do vencedor para exibir a mensagem correta
    const winnerName = winner === "player" ? playerName : enemyPokemon.name;
    const battleMessage = winner === "player" ? `${winnerName} WON!` : `${winnerName} WON!`;

    // Atualiza a vida do inimigo para 0 visualmente se o jogador vencer
    if (winner === "player") {
        enemyPokemon.hp = 0;
        updateBattleScreen(); // Atualiza a barra de HP

        // meter a imagem do inimigo como transparente
        document.querySelector(".enemy-pokemon-image").src = "./images/transparent.png";
    }

    // Exibe a mensagem de vitória no título da batalha
    document.querySelector(".player-name").textContent = battleMessage;

    // Esconde o nome do Pokémon inimigo e o título
    document.querySelector(".battle-tittle").textContent = "";
    document.querySelector(".enemy-name").textContent = "";

    // Mudar o botão "Fight" para "Continue"    
    continueBtn.classList.remove("hidden");

    // Configurar a ação ao clicar no botão "Continue"
    continueBtn.addEventListener("click", async () => {
        // Esconder o botão "Continue"
        continueBtn.classList.add("hidden");

        // Aumentar o número de vitórias se o jogador vencer
        if (winner === "player") {
            victories += 1;
            document.querySelector(".player-name").textContent = `${playerName} - ${victories} Victor${victories > 1 ? 'ies' : 'y'}`;
        }

        document.getElementById('log-list').innerHTML = "";

        // Chama a função para reiniciar a batalha após o clique
        restartBattle();
    });
}
