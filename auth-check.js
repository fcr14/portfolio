document.addEventListener('DOMContentLoaded', () => {
    function checkAccess() {
        const token = localStorage.getItem('portfolioAccessToken');
        
        if (!token) {
            // No hay token, redirigir al inicio
            redirectToHome();
            return;
        }

        try {
            const tokenData = JSON.parse(token);
            const now = new Date().getTime();
            const tokenAge = (now - tokenData.timestamp) / 1000 / 60; // en minutos

            if (tokenAge > tokenData.expiry) {
                // Token expirado
                localStorage.removeItem('portfolioAccessToken');
                redirectToHome();
            } else {
                // Token válido, ocultar overlay
                hideLoadingOverlay();
            }
        } catch (e) {
            // Token inválido
            localStorage.removeItem('portfolioAccessToken');
            redirectToHome();
        }
    }

    function redirectToHome() {
        window.location.href = 'index.html#cases';
    }

    function hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    // Verificar acceso inmediatamente
    checkAccess();
}); 