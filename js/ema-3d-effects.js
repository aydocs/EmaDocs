/**
 * Ema Framework - Advanced 3D Effects Engine
 * Gelişmiş 3D efektler, parçacık sistemleri ve görsel efektler
 */

class Ema3DEffects {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.programs = new Map();
        this.buffers = new Map();
        this.textures = new Map();
        this.particles = [];
        this.animationId = null;
        this.isInitialized = false;
    }

    init(container = document.body) {
        this.createCanvas(container);
        this.setupWebGL();
        this.createShaders();
        this.setupBuffers();
        this.setupTextures();
        this.createParticleSystem();
        this.startAnimation();
        this.isInitialized = true;
    }

    createCanvas(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
        `;
        
        this.resizeCanvas();
        container.appendChild(this.canvas);
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    setupWebGL() {
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.05, 0.05, 0.1, 0.0);
    }

    createShaders() {
        // Particle shader
        const particleVertexShader = `
            attribute vec2 a_position;
            attribute vec2 a_velocity;
            attribute float a_life;
            attribute float a_size;
            attribute vec3 a_color;
            
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform mat3 u_transform;
            
            varying float v_life;
            varying float v_size;
            varying vec3 v_color;
            
            void main() {
                vec2 position = a_position + a_velocity * u_time;
                
                // Gravity effect
                position.y -= 0.5 * u_time * u_time;
                
                // Apply transform
                vec3 transformed = u_transform * vec3(position, 1.0);
                
                // Convert to clip space
                vec2 clipSpace = ((transformed.xy / u_resolution) * 2.0) - 1.0;
                clipSpace.y *= -1.0;
                
                gl_Position = vec4(clipSpace, 0.0, 1.0);
                gl_PointSize = a_size * (1.0 - u_time / a_life);
                
                v_life = a_life;
                v_size = a_size;
                v_color = a_color;
            }
        `;

        const particleFragmentShader = `
            precision mediump float;
            
            varying float v_life;
            varying float v_size;
            varying vec3 v_color;
            
            void main() {
                vec2 center = gl_PointCoord - 0.5;
                float dist = length(center);
                
                if (dist > 0.5) discard;
                
                float alpha = (1.0 - dist * 2.0) * (1.0 - v_life * 0.1);
                gl_FragColor = vec4(v_color, alpha);
            }
        `;

        this.createProgram('particle', particleVertexShader, particleFragmentShader);

        // Background shader
        const backgroundVertexShader = `
            attribute vec2 a_position;
            varying vec2 v_uv;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_uv = (a_position + 1.0) * 0.5;
            }
        `;

        const backgroundFragmentShader = `
            precision mediump float;
            
            varying vec2 v_uv;
            uniform float u_time;
            uniform vec2 u_resolution;
            
            void main() {
                vec2 uv = v_uv;
                
                // Animated gradient
                vec3 color1 = vec3(0.1, 0.05, 0.2);
                vec3 color2 = vec3(0.2, 0.1, 0.3);
                vec3 color3 = vec3(0.1, 0.1, 0.4);
                
                float t = sin(u_time * 0.5) * 0.5 + 0.5;
                vec3 color = mix(mix(color1, color2, uv.x), color3, uv.y);
                
                // Add some noise
                float noise = sin(uv.x * 20.0 + u_time) * sin(uv.y * 15.0 + u_time * 0.7) * 0.02;
                color += noise;
                
                gl_FragColor = vec4(color, 0.3);
            }
        `;

        this.createProgram('background', backgroundVertexShader, backgroundFragmentShader);
    }

    createProgram(name, vertexSource, fragmentSource) {
        const program = this.gl.createProgram();
        
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program linking error:', this.gl.getProgramInfoLog(program));
            return null;
        }
        
        this.programs.set(name, program);
        return program;
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

    setupBuffers() {
        // Particle buffer
        const particlePositions = [];
        const particleVelocities = [];
        const particleLives = [];
        const particleSizes = [];
        const particleColors = [];

        for (let i = 0; i < 1000; i++) {
            particlePositions.push(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );
            
            particleVelocities.push(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            
            particleLives.push(Math.random() * 5 + 1);
            particleSizes.push(Math.random() * 4 + 1);
            
            // Purple color variations
            const colorVariation = Math.random();
            particleColors.push(
                0.4 + colorVariation * 0.4, // R
                0.2 + colorVariation * 0.3, // G
                0.7 + colorVariation * 0.3  // B
            );
        }

        this.createBuffer('particlePositions', new Float32Array(particlePositions), 2);
        this.createBuffer('particleVelocities', new Float32Array(particleVelocities), 2);
        this.createBuffer('particleLives', new Float32Array(particleLives), 1);
        this.createBuffer('particleSizes', new Float32Array(particleSizes), 1);
        this.createBuffer('particleColors', new Float32Array(particleColors), 3);

        // Background quad
        const backgroundPositions = [
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ];
        this.createBuffer('background', new Float32Array(backgroundPositions), 2);
    }

    createBuffer(name, data, size) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        
        this.buffers.set(name, { buffer, size, data });
    }

    setupTextures() {
        // Create noise texture
        const noiseSize = 64;
        const noiseData = new Uint8Array(noiseSize * noiseSize * 4);
        
        for (let i = 0; i < noiseSize * noiseSize; i++) {
            const value = Math.random() * 255;
            noiseData[i * 4] = value;     // R
            noiseData[i * 4 + 1] = value; // G
            noiseData[i * 4 + 2] = value; // B
            noiseData[i * 4 + 3] = 255;   // A
        }
        
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, noiseSize, noiseSize, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, noiseData);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        
        this.textures.set('noise', texture);
    }

    createParticleSystem() {
        this.particles = [];
        
        // Create floating particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                life: Math.random() * 10 + 5,
                maxLife: Math.random() * 10 + 5,
                color: [
                    0.4 + Math.random() * 0.4,
                    0.2 + Math.random() * 0.3,
                    0.7 + Math.random() * 0.3
                ]
            });
        }
    }

    startAnimation() {
        let lastTime = 0;
        
        const animate = (currentTime) => {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            this.update(deltaTime);
            this.render();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    update(deltaTime) {
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Reset if dead
            if (particle.life <= 0) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.life = particle.maxLife;
            }
        });
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Render background
        this.renderBackground();
        
        // Render particles
        this.renderParticles();
    }

    renderBackground() {
        const program = this.programs.get('background');
        this.gl.useProgram(program);
        
        const buffer = this.buffers.get('background');
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
        
        const positionLocation = this.gl.getAttribLocation(program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, buffer.size, this.gl.FLOAT, false, 0, 0);
        
        const timeLocation = this.gl.getUniformLocation(program, 'u_time');
        const resolutionLocation = this.gl.getUniformLocation(program, 'u_resolution');
        
        this.gl.uniform1f(timeLocation, Date.now() * 0.001);
        this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
        
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    renderParticles() {
        const program = this.programs.get('particle');
        this.gl.useProgram(program);
        
        // Update particle data
        const positions = [];
        const velocities = [];
        const lives = [];
        const sizes = [];
        const colors = [];
        
        this.particles.forEach(particle => {
            positions.push(particle.x, particle.y);
            velocities.push(particle.vx, particle.vy);
            lives.push(particle.life);
            sizes.push(particle.size);
            colors.push(particle.color[0], particle.color[1], particle.color[2]);
        });
        
        // Update buffers
        this.updateBuffer('particlePositions', new Float32Array(positions));
        this.updateBuffer('particleVelocities', new Float32Array(velocities));
        this.updateBuffer('particleLives', new Float32Array(lives));
        this.updateBuffer('particleSizes', new Float32Array(sizes));
        this.updateBuffer('particleColors', new Float32Array(colors));
        
        // Set attributes
        this.setAttribute(program, 'a_position', 'particlePositions');
        this.setAttribute(program, 'a_velocity', 'particleVelocities');
        this.setAttribute(program, 'a_life', 'particleLives');
        this.setAttribute(program, 'a_size', 'particleSizes');
        this.setAttribute(program, 'a_color', 'particleColors');
        
        // Set uniforms
        const timeLocation = this.gl.getUniformLocation(program, 'u_time');
        const resolutionLocation = this.gl.getUniformLocation(program, 'u_resolution');
        const transformLocation = this.gl.getUniformLocation(program, 'u_transform');
        
        this.gl.uniform1f(timeLocation, Date.now() * 0.001);
        this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
        
        // Identity matrix
        this.gl.uniformMatrix3fv(transformLocation, false, [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
        
        this.gl.drawArrays(this.gl.POINTS, 0, this.particles.length);
    }

    updateBuffer(name, data) {
        const buffer = this.buffers.get(name);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        buffer.data = data;
    }

    setAttribute(program, name, bufferName) {
        const location = this.gl.getAttribLocation(program, name);
        const buffer = this.buffers.get(bufferName);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, buffer.size, this.gl.FLOAT, false, 0, 0);
    }

    // Public methods
    createExplosion(x, y, color = [0.4, 0.2, 0.7], count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 3 + 1;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                life: Math.random() * 2 + 1,
                maxLife: Math.random() * 2 + 1,
                color: color
            });
        }
    }

    createTrail(x, y, color = [0.4, 0.2, 0.7], count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2,
                size: Math.random() * 2 + 0.5,
                life: Math.random() * 1 + 0.5,
                maxLife: Math.random() * 1 + 0.5,
                color: color
            });
        }
    }

    setIntensity(intensity) {
        this.canvas.style.opacity = intensity;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.programs.clear();
        this.buffers.clear();
        this.textures.clear();
        this.particles = [];
        this.isInitialized = false;
    }
}

// Initialize global instance
window.ema3DEffects = new Ema3DEffects();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Ema3DEffects;
}

