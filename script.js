document.addEventListener('DOMContentLoaded', () => {
    // Welcome message animation
    const welcomeMessages = [
        { text: "Welcome", flag: "🇺🇸" },
        { text: "Bienvenido", flag: "🇪🇸" },
        { text: "欢迎", flag: "🇨🇳" },
        { text: "नमस्ते", flag: "🇮🇳" },
        { text: "مرحباً", flag: "🇸🇦" },
        { text: "Bienvenue", flag: "🇫🇷" },
        { text: "환영합니다", flag: "🇰🇷" }
    ];

    const welcomeElement = document.querySelector('.welcome-message');
    let currentIndex = 0;

    function typeWriter(text, flag, callback) {
        let i = 0;
        welcomeElement.textContent = '';
        
        function type() {
            if (i < text.length) {
                welcomeElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            } else {
                welcomeElement.textContent += ' ' + flag;
                if (callback) setTimeout(callback, 1500);
            }
        }
        
        type();
    }

    function updateWelcomeMessage() {
        const currentMessage = welcomeMessages[currentIndex];
        typeWriter(currentMessage.text, currentMessage.flag, () => {
            currentIndex = (currentIndex + 1) % welcomeMessages.length;
            setTimeout(updateWelcomeMessage, 500);
        });
    }

    // Loader animation
    const loader = document.querySelector('.loader');
    const loaderPercentage = document.querySelector('.loader-percentage');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        loaderPercentage.textContent = `${Math.floor(progress)}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                // Iniciar la animación del mensaje después del loader
                setTimeout(updateWelcomeMessage, 500);
            }, 500);
        }
    }, 100);

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Manejo de autenticación
    const authModal = document.getElementById('authModal');
    const authForm = document.getElementById('authForm');
    const errorMessage = document.getElementById('errorMessage');
    const closeModal = document.querySelector('.close-modal');
    
    // Código de acceso (puedes cambiarlo por el que prefieras)
    const ACCESS_CODE = '123456';
    
    // Tiempo de expiración del token (en minutos)
    const TOKEN_EXPIRY = 60; // 1 hora

    let selectedProject = ''; // Variable para almacenar la URL del proyecto seleccionado

    // Abrir modal al hacer click en card bloqueada
    document.querySelectorAll('.case-card.locked').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            selectedProject = card.dataset.project; // Guardar la URL del proyecto
            authModal.style.display = 'flex';
        });
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        authModal.style.display = 'none';
        errorMessage.style.display = 'none';
        authForm.reset();
    });

    // Click fuera del modal para cerrar
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            errorMessage.style.display = 'none';
            authForm.reset();
        }
    });

    // Manejar envío del formulario
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const accessCode = document.getElementById('accessCode').value;

        if (accessCode === ACCESS_CODE) {
            const token = {
                timestamp: new Date().getTime(),
                expiry: TOKEN_EXPIRY
            };
            localStorage.setItem('portfolioAccessToken', JSON.stringify(token));
            window.location.href = selectedProject || 'payment-gateway.html';
        } else {
            errorMessage.textContent = 'Incorrect access code';
            errorMessage.style.display = 'block';
        }
    });

    const copyEmailBtn = document.getElementById('copyEmail');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = 'francisco.carcamo.rios@gmail.com'; // Cambia por tu correo real si es necesario
            navigator.clipboard.writeText(email).then(function() {
                const toast = document.getElementById('toast');
                if (toast) {
                    toast.style.display = 'block';
                    setTimeout(() => {
                        toast.style.display = 'none';
                    }, 2000);
                }
            });
        });
    }
});
