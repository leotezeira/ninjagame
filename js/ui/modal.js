/* Modal system for custom alerts and confirms */

export function showModal(message, options = {}) {
    let modal = document.getElementById('custom-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-message"></div>
                <button class="modal-ok">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.querySelector('.modal-message').innerHTML = message;
    modal.style.display = 'flex';
    const okBtn = modal.querySelector('.modal-ok');
    okBtn.onclick = () => {
        modal.style.display = 'none';
        if (options.onClose) options.onClose();
    };
}

export function showConfirm(message, onConfirm, onCancel) {
    let modal = document.getElementById('custom-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-message"></div>
                <div class="modal-buttons">
                    <button class="modal-ok">OK</button>
                    <button class="modal-cancel">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // Si ya existe, asegúrate de que los botones estén presentes
        if (!modal.querySelector('.modal-cancel')) {
            const btns = modal.querySelector('.modal-buttons');
            if (btns) {
                btns.innerHTML = '<button class="modal-ok">OK</button><button class="modal-cancel">Cancelar</button>';
            }
        }
    }
    modal.querySelector('.modal-message').innerHTML = message;
    modal.style.display = 'flex';
    const okBtn = modal.querySelector('.modal-ok');
    const cancelBtn = modal.querySelector('.modal-cancel');
    okBtn.onclick = () => {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    };
    cancelBtn.onclick = () => {
        modal.style.display = 'none';
        if (onCancel) onCancel();
    };
}
