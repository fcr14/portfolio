class ParticleEffect {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.mouse = new THREE.Vector2(0, 0);
        this.mouseRadius = 150;
        this.colors = [
            new THREE.Color('#E8F3FF'), // Azul claro
            new THREE.Color('#FFE8E8'), // Rosa claro
            new THREE.Color('#E8FFE8'), // Verde claro
            new THREE.Color('#FFF3E8'), // Naranja claro
            new THREE.Color('#F3E8FF')  // Púrpura claro
        ];
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            150 / 2,
            150 / -2,
            1,
            1000
        );
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, 150);

        this.particles = [];
        this.particleCount = Math.min(window.innerWidth / 5, 200);
        this.createParticles();

        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e)); // Cambiado a document
        
        this.animate();
    }

    createParticles() {
        const geometry = new THREE.CircleGeometry(1.5, 8);

        for (let i = 0; i < this.particleCount; i++) {
            const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            const material = new THREE.MeshBasicMaterial({
                color: randomColor,
                transparent: true,
                opacity: 0.4
            });

            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.x = Math.random() * window.innerWidth - window.innerWidth / 2;
            particle.position.y = Math.random() * 150 - 75;
            
            particle.baseX = particle.position.x;
            particle.baseY = particle.position.y;
            
            particle.vx = (Math.random() - 0.5) * 0.8;
            particle.vy = (Math.random() - 0.5) * 0.8;
            
            this.particles.push(particle);
            this.scene.add(particle);
        }
    }

    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - window.innerWidth / 2;
        this.mouse.y = -(event.clientY - rect.top - 75);
    }

    onResize() {
        this.camera.left = window.innerWidth / -2;
        this.camera.right = window.innerWidth / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, 150);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.particles.forEach(particle => {
            particle.position.x += particle.vx;
            particle.position.y += particle.vy;

            const dx = this.mouse.x - particle.position.x;
            const dy = this.mouse.y - particle.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouseRadius) {
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                particle.position.x -= (dx * force * 0.15); // Fuerza ligeramente reducida
                particle.position.y -= (dy * force * 0.15);
            }

            particle.position.x += (particle.baseX - particle.position.x) * 0.01;
            particle.position.y += (particle.baseY - particle.position.y) * 0.01;

            if (particle.position.x < -window.innerWidth / 2 || particle.position.x > window.innerWidth / 2) {
                particle.vx *= -1;
            }
            if (particle.position.y < -75 || particle.position.y > 75) {
                particle.vy *= -1;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new ParticleEffect();
}); 