export class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.resizeForHighDPI();
        
        // Zelda palette colors
        this.config = {
            particleColor: 'rgba(116, 122, 71, 0.5)',   // #747A47 sage green
            lineColor: 'rgba(116, 122, 71, 0.08)',
            particleAmount: 60,
            defaultSpeed: 0.4,
            variantSpeed: 0.8,
            defaultRadius: 1.5,
            variantRadius: 2,
            linkRadius: 150
        };

        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeForHighDPI());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseleave', () => this.handleMouseLeave());
    }

    resizeForHighDPI() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.scale(dpr, dpr);
        if (this.particles.length > 0) this.init();
    }

    init() {
        this.particles = [];
        const density = Math.floor(window.innerWidth * window.innerHeight / 18000);
        const count = Math.min(density, 80);

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speedX: (Math.random() - 0.5) * this.config.variantSpeed,
                speedY: (Math.random() - 0.5) * this.config.variantSpeed,
                radius: Math.random() * this.config.variantRadius + this.config.defaultRadius,
                // Randomly assign sage or amber
                isAmber: Math.random() < 0.25
            });
        }
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    handleMouseLeave() {
        this.mouse.x = null;
        this.mouse.y = null;
    }

    animate() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
            if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.isAmber
                ? 'rgba(163, 106, 0, 0.55)'   // #A36A00 amber
                : 'rgba(116, 122, 71, 0.55)';  // #747A47 sage
            this.ctx.fill();

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const distance = Math.hypot(p.x - p2.x, p.y - p2.y);

                if (distance < this.config.linkRadius) {
                    const opacity = (1 - distance / this.config.linkRadius) * 0.12;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(116, 122, 71, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
            
            if (this.mouse.x != null) {
                const distMouse = Math.hypot(p.x - this.mouse.x, p.y - this.mouse.y);
                const mouseRadius = this.config.linkRadius + 60;
                
                if (distMouse < mouseRadius) {
                    const opacity = (1 - distMouse / mouseRadius) * 0.45;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(163, 106, 0, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                    
                    if (distMouse > 10) {
                        p.x += (this.mouse.x - p.x) * 0.004;
                        p.y += (this.mouse.y - p.y) * 0.004;
                    }
                }
            }
        }

        requestAnimationFrame(this.animate.bind(this));
    }
}
