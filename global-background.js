/**
 * Global Background Interaction: Genetic Data Fluid (Refined)
 * Features elastic wave physics, high visibility, and enhanced sensitivity.
 */

class GeneticParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.init();
    }

    init() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;

        // Increased size for visibility
        this.size = Math.random() * 2.5 + 1.5;

        // Default drift velocity
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;

        // Interaction velocity (the "push")
        this.ix = 0;
        this.iy = 0;

        // Friction to make them feel "fluid"
        this.friction = 0.96;

        // Increased opacity for visibility
        this.opacity = Math.random() * 0.4 + 0.3;

        // Sensing density (how much it reacts)
        this.density = (Math.random() * 20) + 10;
    }

    draw() {
        this.ctx.fillStyle = `rgba(140, 140, 140, ${this.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    update(mouse) {
        // Apply interaction velocity
        this.x += this.vx + this.ix;
        this.y += this.vy + this.iy;

        // Apply friction to interaction velocity (damping the ripple)
        this.ix *= this.friction;
        this.iy *= this.friction;

        // Wrap around edges
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;

        // Mouse repulsion (Gravity/Wave effect)
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Sensing radius increased as requested
        const maxDistance = 250;

        if (distance < maxDistance) {
            // Distance-based force (stronger when closer)
            let force = (maxDistance - distance) / maxDistance;

            // Normalize direction
            let normX = dx / distance;
            let normY = dy / distance;

            // Add to interaction velocity for a "smooth" push (wave feel)
            this.ix += normX * force * (this.density / 50);
            this.iy += normY * force * (this.density / 50);
        }
    }
}

class GeneticBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'genetic-background';
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: -9999, // Off-screen initially
            y: -9999
        };

        this.init();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.animate();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.zIndex = '9999';
        this.canvas.style.pointerEvents = 'none';

        document.body.prepend(this.canvas);
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        const numberOfParticles = (this.canvas.width * this.canvas.height) / 12000;
        const count = Math.min(numberOfParticles, 120);

        for (let i = 0; i < count; i++) {
            this.particles.push(new GeneticParticle(this.canvas));
        }
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
            this.particles[i].update(this.mouse);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GeneticBackground();
});
