window.addEventListener('load', function () {
    // Adiciona estrelas ao fundo
    const starCount = 100; // Número de estrelas
    const loadingScreen = document.getElementById('loading-screen');

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        // Posiciona as estrelas aleatoriamente
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        // Tamanho aleatório das estrelas
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        loadingScreen.appendChild(star);
    }

    // Remover a tela de carregamento após 2 segundos
    setTimeout(function () {
        loadingScreen.style.display = 'none';
        document.getElementById('game-container').classList.remove('hidden');
    }, 2000);
});
