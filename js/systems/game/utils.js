// ============================================================
// core/utils.js — Utilidades puras (sin estado del juego)
// ============================================================

export const utilsMethods = {

    rollDice(sides = 20) {
        return Math.floor(Math.random() * sides) + 1;
    },

    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    },

    updateBar(elementId, current, max, label) {
        const bar = document.getElementById(elementId);
        if (!bar) return;
        const percentage = (current / max) * 100;
        bar.style.width = Math.max(0, Math.min(100, percentage)) + '%';
        if (label) {
            const textId = elementId.replace('-bar', '-text');
            const textElement = document.getElementById(textId);
            if (textElement) {
                textElement.textContent = `${label}: ${Math.max(0, Math.floor(current))}/${Math.floor(max)}`;
            }
        }
    },

    // ── Modales ──────────────────────────────────────────────

    closeAllModals() {
        ['modal-alert', 'modal-confirm', 'modal-prompt'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    },

    gameAlert(message, icon = 'ℹ️') {
        this.closeAllModals();
        return new Promise(resolve => {
            const modal = document.getElementById('modal-alert');
            const msg   = document.getElementById('modal-alert-message');
            const ico   = document.getElementById('modal-alert-icon');
            const btn   = document.getElementById('modal-alert-ok');
            if (!modal) { alert(message); resolve(); return; }
            ico.textContent = icon;
            msg.textContent = message;
            modal.style.display = 'flex';
            const close = () => {
                modal.style.display = 'none';
                btn.removeEventListener('click', close);
                resolve();
            };
            btn.addEventListener('click', close);
        });
    },

    gameConfirm(message, icon = '❓') {
        this.closeAllModals();
        return new Promise(resolve => {
            const modal = document.getElementById('modal-confirm');
            const msg   = document.getElementById('modal-confirm-message');
            const ico   = document.getElementById('modal-confirm-icon');
            const yes   = document.getElementById('modal-confirm-yes');
            const no    = document.getElementById('modal-confirm-no');
            if (!modal) { resolve(confirm(message)); return; }
            ico.textContent = icon;
            msg.textContent = message;
            modal.style.display = 'flex';
            const accept  = () => { modal.style.display = 'none'; cleanup(); resolve(true); };
            const reject  = () => { modal.style.display = 'none'; cleanup(); resolve(false); };
            const cleanup = () => {
                yes.removeEventListener('click', accept);
                no.removeEventListener('click', reject);
            };
            yes.addEventListener('click', accept);
            no.addEventListener('click', reject);
        });
    },

    gamePrompt(message, icon = '✏️') {
        this.closeAllModals();
        return new Promise(resolve => {
            const modal  = document.getElementById('modal-prompt');
            const msg    = document.getElementById('modal-prompt-message');
            const ico    = document.getElementById('modal-prompt-icon');
            const input  = document.getElementById('modal-prompt-input');
            const ok     = document.getElementById('modal-prompt-ok');
            const cancel = document.getElementById('modal-prompt-cancel');
            if (!modal) { resolve(prompt(message)); return; }
            ico.textContent = icon;
            msg.textContent = message;
            input.value = '';
            modal.style.display = 'flex';
            setTimeout(() => input.focus(), 100);
            const accept  = () => { modal.style.display = 'none'; cleanup(); resolve(input.value || null); };
            const reject  = () => { modal.style.display = 'none'; cleanup(); resolve(null); };
            const cleanup = () => {
                ok.removeEventListener('click', accept);
                cancel.removeEventListener('click', reject);
            };
            ok.addEventListener('click', accept);
            cancel.addEventListener('click', reject);
        });
    },

    getMonthName(month) {
        const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        return months[month - 1] || 'Mes';
    },

    getRankEmoji(rank) {
        const emojis = { D:'🟦', C:'🟩', B:'🟧', A:'🟥', S:'⭐', U:'💛', F:'💀' };
        return emojis[rank] || '📋';
    },

};
