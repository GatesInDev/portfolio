export class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.resizeForHighDPI();
        
        // Configuration
        this.config = {
            particleColor: 'rgba(255, 255, 255, 0.3)',
            lineColor: 'rgba(255, 255, 255, 0.05)',
            particleAmount: 60, // Density
            defaultSpeed: 0.5,
            variantSpeed: 1,
            defaultRadius: 2,
            variantRadius: 2,
            linkRadius: 160 // Distance to connect
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
        
        // Re-init particles on resize to maintain density
        if (this.particles.length > 0) this.init(); 
    }

    init() {
        this.particles = [];
        // Adjust density for screen size
        const density = Math.floor(window.innerWidth * window.innerHeight / 15000); 
        const count = Math.min(density, 100); 

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speedX: (Math.random() - 0.5) * this.config.variantSpeed,
                speedY: (Math.random() - 0.5) * this.config.variantSpeed,
                radius: Math.random() * this.config.variantRadius + this.config.defaultRadius
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
            
            // Movement
            p.x += p.speedX;
            p.y += p.speedY;

            // Bounce off edges
            if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
            if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;

            // Draw Dot
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.particleColor;
            this.ctx.fill();

            // Connections
            for (let j = i; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const distance = Math.hypot(p.x - p2.x, p.y - p2.y);

                if (distance < this.config.linkRadius) {
                    const opacity = 1 - (distance / this.config.linkRadius);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`; // Very subtle lines
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
            
            // Connect to Mouse
            if (this.mouse.x != null) {
                const mouseIdx = -1; // special case
                const distMouse = Math.hypot(p.x - this.mouse.x, p.y - this.mouse.y);
                
                if (distMouse < this.config.linkRadius + 50) { // Slightly larger radius for mouse
                    const opacity = 1 - (distMouse / (this.config.linkRadius + 50));
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.4})`; // Accent color for mouse interaction
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                    
                    // Slight attraction
                    if (distMouse > 10) {
                         p.x += (this.mouse.x - p.x) * 0.005;
                         p.y += (this.mouse.y - p.y) * 0.005;
                    }
                }
            }
        }

        requestAnimationFrame(this.animate.bind(this));
    }
}
