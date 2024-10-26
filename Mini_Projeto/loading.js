// Function to create a starry background for the loading screen
window.addEventListener('load', function () {
    const starCount = 100;
    const loadingScreen = document.getElementById('loading-screen');

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        loadingScreen.appendChild(star);
    }

    setTimeout(function () {
        loadingScreen.style.display = 'none';
        document.getElementById('game-container').classList.remove('hidden');
    }, 2000);
});
