// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC03BiPatj7xR9CLKAu0V68WpuWZvXX46w",
    authDomain: "pokeapollo-tdw.firebaseapp.com",
    projectId: "pokeapollo-tdw",
    storageBucket: "pokeapollo-tdw.appspot.com",
    messagingSenderId: "9147719603",
    appId: "1:9147719603:web:8647d663b3cdf00b4d75c6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get all highscores from higher to lower
async function getHighscores() {
    try {
        const highscores = await db.collection('highscores').orderBy('highscore', 'desc').get();
        return highscores.docs.map(doc => ({
            username: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting highscores:', error);
    }
}

// Populate the highscores table
async function populateHighscoresTable() {
    const highscores = await getHighscores();
    const tableList = document.getElementById('table-list');

    tableList.innerHTML = '';

    const headerRow = document.createElement('li');
    headerRow.className = 'table-row define';
    headerRow.innerHTML = `
        <span class="table-cell-info">Rank</span>
        <span class="table-cell-info">Username</span>
        <span class="table-cell-info">Pokemon</span>
        <span class="table-cell-info">Score</span>
    `;
    tableList.appendChild(headerRow);

    highscores.forEach((score, index) => {
        const row = document.createElement('li');
        row.className = 'table-row';
        row.innerHTML = `
            <span class="table-cell">${index + 1}</span>
            <span class="table-cell">${score.username}</span>
            <span class="table-cell">${score.pokemon || 'N/A'}</span>
            <span class="table-cell">${score.highscore}</span>
        `;
        tableList.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', populateHighscoresTable);
