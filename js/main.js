import { createGame } from './systems/game.js';

const game = createGame();
window.game = game;

window.addEventListener('load', () => {
    try {
        const hasSave = localStorage.getItem('ninjaRPGSave');
        const loadBtn = document.getElementById('load-btn');
        if (!hasSave && loadBtn) loadBtn.style.display = 'none';
    } catch (e) {
        // ignore
    }
});
