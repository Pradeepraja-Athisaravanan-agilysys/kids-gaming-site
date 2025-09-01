document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('data/branding.json').then(res => res.json()),
        fetch('data/theme.json').then(res => res.json()),
        fetch('data/games.json').then(res => res.json())
    ]).then(([{brand}, theme, gamesData]) => {
        applyTheme(theme, brand.colors);
        populateBranding(brand);
        populateGames(gamesData.games);
        setupCountdown(gamesData.countdownTarget);
        document.title = gamesData.siteTitle;
        document.getElementById('tagline').textContent = gamesData.tagline;
    }).catch(error => console.error('Error loading data:', error));
});

function applyTheme(theme, colors) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--accent-color', colors.secondary);
    root.style.setProperty('--bg-color', theme.colors.background);
    root.style.setProperty('--text-color', theme.colors.text);
    const fontLink = document.createElement('link');
    fontLink.href = theme.font.url;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    root.style.setProperty('--font-family', theme.font.family);
}

function populateBranding(brand) {
    document.getElementById('logo').src = brand.logo.title;
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = brand.logo.favicon;
    document.head.appendChild(favicon);
    document.getElementById('tagline').textContent = brand.slogan;
    const contactDiv = document.getElementById('contact');
    contactDiv.innerHTML = `<p>Email: ${brand.email}</p><p>Phone: ${brand.mobile}</p>`;
    const socialMediaDiv = document.getElementById('social-media');
    let socialLinks = '';
    for (const [platform, url] of Object.entries(brand.socialMedia)) {
        socialLinks += `<a href="${url}" target="_blank">${platform}</a> `;
    }
    socialMediaDiv.innerHTML = socialLinks;
}

function populateGames(games) {
    const gamesList = document.getElementById('games-list');
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <h3>${game.name}</h3>
            <img src="${game.thumb}" alt="${game.name}">
            <p>${game.description}</p>
            <p>Difficulty: ${game.difficulty}</p>
            <a href="${game.url}" target="_blank">Play Now</a>
        `;
        gamesList.appendChild(card);
    });
}

function setupCountdown(targetDate) {
    const timerDiv = document.getElementById('timer');
    const countDownDate = new Date(targetDate).getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerDiv.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(interval);
            timerDiv.innerHTML = "EXPIRED";
        }
    }, 1000);
}

// TODO: student exercise - Add search/filter functionality for games
