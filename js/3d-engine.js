/* ========================================
   EMA FRAMEWORK - 3D ENGINE
   WebGL-based 3D graphics and effects
   ======================================== */

class Ema3DEngine {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.particles = [];
        this.animationId = null;
        this.time = 0;
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.initWebGL();
        this.setupShaders();
        this.setupBuffers();
        this.createParticles();
        this.startAnimation();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        document.body.appendChild(this.canvas);
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initWebGL() {
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to 2D canvas');
            this.fallbackTo2D();
            return;
        }
        
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    
    setupShaders() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute float a_size;
            attribute vec3 a_color;
            attribute float a_alpha;
            
            uniform vec2 u_resolution;
            uniform float u_time;
            
            varying vec3 v_color;
            varying float v_alpha;
            
            void main() {
                vec2 position = a_position;
                
                // Add some floating animation
                position.y += sin(u_time * 0.001 + a_position.x * 0.01) * 10.0;
                position.x += cos(u_time * 0.0008 + a_position.y * 0.01) * 5.0;
                
                vec2 clipSpace = ((position / u_resolution) * 2.0) - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                gl_PointSize = a_size;
                
                v_color = a_color;
                v_alpha = a_alpha;
            }
        `;
        
        const fragmentShaderSource = `
            precision mediump float;
            
            varying vec3 v_color;
            varying float v_alpha;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                float alpha = (1.0 - smoothstep(0.0, 0.5, distance)) * v_alpha;
                
                gl_FragColor = vec4(v_color, alpha);
            }
        `;
        
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        this.program = this.createProgram(vertexShader, fragmentShader);
        
        this.gl.useProgram(this.program);
        
        // Get attribute and uniform locations
        this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.sizeLocation = this.gl.getAttribLocation(this.program, 'a_size');
        this.colorLocation = this.gl.getAttribLocation(this.program, 'a_color');
        this.alphaLocation = this.gl.getAttribLocation(this.program, 'a_alpha');
        
        this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program linking error:', this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        
        return program;
    }
    
    setupBuffers() {
        this.positionBuffer = this.gl.createBuffer();
        this.sizeBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.alphaBuffer = this.gl.createBuffer();
    }
    
    createParticles() {
        const particleCount = Math.min(150, Math.floor(window.innerWidth / 15));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 1,
                color: [
                    Math.random() * 0.6 + 0.4, // R
                    Math.random() * 0.4 + 0.2, // G
                    Math.random() * 0.8 + 0.2  // B
                ],
                alpha: Math.random() * 0.6 + 0.3,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                life: Math.random() * 200 + 100,
                maxLife: Math.random() * 200 + 100,
                z: Math.random() * 10 - 5
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Life-based alpha
            particle.alpha = (particle.life / particle.maxLife) * 0.8;
            
            // Add some floating motion
            particle.vx += (Math.random() - 0.5) * 0.01;
            particle.vy += (Math.random() - 0.5) * 0.01;
            
            // Limit velocity
            particle.vx = Math.max(-2, Math.min(2, particle.vx));
            particle.vy = Math.max(-2, Math.min(2, particle.vy));
            
            // Respawn if dead
            if (particle.life <= 0) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.life = particle.maxLife;
                particle.alpha = 0.8;
            }
        });
    }
    
    render() {
        if (!this.gl) return;
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // Update uniforms
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.timeLocation, this.time);
        
        // Prepare particle data
        const positions = [];
        const sizes = [];
        const colors = [];
        const alphas = [];
        
        this.particles.forEach(particle => {
            positions.push(particle.x, particle.y);
            sizes.push(particle.size);
            colors.push(...particle.color);
            alphas.push(particle.alpha);
        });
        
        // Update buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sizes), this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(this.sizeLocation);
        this.gl.vertexAttribPointer(this.sizeLocation, 1, this.gl.FLOAT, false, 0, 0);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(this.colorLocation);
        this.gl.vertexAttribPointer(this.colorLocation, 3, this.gl.FLOAT, false, 0, 0);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.alphaBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(alphas), this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(this.alphaLocation);
        this.gl.vertexAttribPointer(this.alphaLocation, 1, this.gl.FLOAT, false, 0, 0);
        
        // Draw particles
        this.gl.drawArrays(this.gl.POINTS, 0, this.particles.length);
    }
    
    startAnimation() {
        const animate = () => {
            this.time += 16;
            this.updateParticles();
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    createExplosion(x, y, color = [1, 0.4, 0.8], particleCount = 30) {
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 5 + 2;
            const life = Math.random() * 100 + 50;
            
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 6 + 3,
                color: color,
                alpha: 1.0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: life,
                maxLife: life,
                z: Math.random() * 20 - 10
            });
        }
    }
    
    createTrail(x, y, color = [0.4, 0.8, 1], particleCount = 15) {
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                size: Math.random() * 3 + 1,
                color: color,
                alpha: Math.random() * 0.6 + 0.4,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: Math.random() * 80 + 40,
                maxLife: Math.random() * 80 + 40,
                z: Math.random() * 15 - 7
            });
        }
    }
    
    createSpiral(x, y, color = [0.8, 0.4, 1], particleCount = 25) {
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const radius = Math.random() * 30 + 10;
            const speed = Math.random() * 2 + 1;
            
            this.particles.push({
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius,
                size: Math.random() * 4 + 2,
                color: color,
                alpha: Math.random() * 0.7 + 0.3,
                vx: Math.cos(angle + Math.PI/2) * speed,
                vy: Math.sin(angle + Math.PI/2) * speed,
                life: Math.random() * 120 + 60,
                maxLife: Math.random() * 120 + 60,
                z: Math.random() * 10 - 5
            });
        }
    }
    
    fallbackTo2D() {
        // Fallback to 2D canvas if WebGL is not supported
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        // Create 2D particles
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        this.start2DAnimation();
    }
    
    start2DAnimation() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(111, 66, 193, ${particle.opacity})`;
                this.ctx.fill();
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize 3D Engine
window.ema3DEngine = new Ema3DEngine();