/* ========================================
   EMA FRAMEWORK - MEGA JAVASCRIPT FILE
   All JavaScript functionality consolidated
   ======================================== */

// ========================================
// CORE FRAMEWORK CLASS
// ========================================
class EmaFramework {
    constructor(options = {}) {
        this.version = '2.0.0';
        this.theme = options.theme || 'dark';
        this.animations = options.animations !== false;
        this.components = options.components || [];
        this.debug = options.debug || false;
        
        this.init();
    }
    
    init() {
        this.log('Ema Framework initialized');
        this.setupTheme();
        this.setupAnimations();
        this.setupComponents();
        this.setupEventListeners();
    }
    
    log(message) {
        if (this.debug) {
            console.log(`[Ema Framework] ${message}`);
        }
    }
    
    setupTheme() {
        document.body.classList.add('dark-mode-enhanced');
        this.log('Theme setup complete');
    }
    
    setupAnimations() {
        if (this.animations) {
            this.observeElements();
        }
    }
    
    setupComponents() {
        this.components.forEach(component => {
            this.loadComponent(component);
        });
    }
    
    setupEventListeners() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
        });
        
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ema-animate-fadeIn');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.ema-card, .ema-stat-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    loadComponent(componentName) {
        this.log(`Loading component: ${componentName}`);
        // Component loading logic
    }
    
    initializeComponents() {
        this.initializeAlerts();
        this.initialize3DEffects();
        this.initializeLivePreview();
        this.initializeCharts();
        this.initializeModals();
        this.initializeForms();
    }
    
    handleResize() {
        this.log('Window resized');
        // Handle responsive changes
    }
    
    handleScroll() {
        const header = document.querySelector('.ema-header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ========================================
// ALERTS SYSTEM
// ========================================
class EmaAlerts {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        this.createContainer();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'ema-alerts-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, options = {}) {
        const alert = this.createAlert(message, options);
        this.container.appendChild(alert);
        
        // Auto remove after timer
        if (options.timer) {
            setTimeout(() => {
                this.remove(alert);
            }, options.timer);
        }
        
        return alert;
    }
    
    createAlert(message, options) {
        const alert = document.createElement('div');
        alert.className = `ema-alert ema-alert-${options.type || 'info'}`;
        
        const title = options.title ? `<strong>${options.title}</strong><br>` : '';
        alert.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    ${title}${message}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: 10px;">×</button>
            </div>
        `;
        
        // Add animation
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100%)';
        setTimeout(() => {
            alert.style.transition = 'all 0.3s ease';
            alert.style.opacity = '1';
            alert.style.transform = 'translateX(0)';
        }, 10);
        
        return alert;
    }
    
    remove(alert) {
        alert.style.transition = 'all 0.3s ease';
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }
    
    success(message, options = {}) {
        return this.show(message, { ...options, type: 'success' });
    }
    
    error(message, options = {}) {
        return this.show(message, { ...options, type: 'danger' });
    }
    
    warning(message, options = {}) {
        return this.show(message, { ...options, type: 'warning' });
    }
    
    info(message, options = {}) {
        return this.show(message, { ...options, type: 'info' });
    }
}

// ========================================
// 3D EFFECTS SYSTEM
// ========================================
class Ema3DEffects {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupParticles();
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
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupParticles() {
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
    }
    
    startAnimation() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                // Update position
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
            
            // Draw connections
            this.drawConnections();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(111, 66, 193, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
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

// ========================================
// LIVE PREVIEW SYSTEM
// ========================================
class EmaLivePreview {
    constructor() {
        this.previewWindow = null;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createPreviewButton();
    }
    
    createPreviewButton() {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-eye"></i> Live Preview';
        button.className = 'ema-btn ema-btn-primary';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3);
        `;
        
        button.addEventListener('click', () => this.togglePreview());
        document.body.appendChild(button);
    }
    
    togglePreview() {
        if (this.isOpen) {
            this.closePreview();
        } else {
            this.openPreview();
        }
    }
    
    openPreview() {
        this.previewWindow = window.open('', 'ema-preview', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        if (this.previewWindow) {
            this.previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Ema Framework - Live Preview</title>
                    <link rel="stylesheet" href="css/ema-mega.css">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
                </head>
                <body class="dark-mode-enhanced">
                    <div class="ema-container" style="padding: 2rem;">
                        <h1>Live Preview</h1>
                        <p>This is a live preview of your Ema Framework application.</p>
                        <div id="preview-content"></div>
                    </div>
                </body>
                </html>
            `);
            
            this.isOpen = true;
        }
    }
    
    closePreview() {
        if (this.previewWindow) {
            this.previewWindow.close();
            this.previewWindow = null;
            this.isOpen = false;
        }
    }
    
    updatePreview(content) {
        if (this.previewWindow && this.previewWindow.document) {
            const previewContent = this.previewWindow.document.getElementById('preview-content');
            if (previewContent) {
                previewContent.innerHTML = content;
            }
        }
    }
}

// ========================================
// CHARTS SYSTEM
// ========================================
class EmaCharts {
    constructor() {
        this.charts = new Map();
    }
    
    createChart(canvasId, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        const chart = {
            canvas,
            ctx,
            data: options.data || [],
            type: options.type || 'line',
            colors: options.colors || ['#6f42c1', '#8e5fd1', '#ff6b6b', '#4ecdc4'],
            ...options
        };
        
        this.charts.set(canvasId, chart);
        this.renderChart(chart);
        
        return chart;
    }
    
    renderChart(chart) {
        const { ctx, canvas, data, type, colors } = chart;
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        switch (type) {
            case 'line':
                this.renderLineChart(chart);
                break;
            case 'bar':
                this.renderBarChart(chart);
                break;
            case 'pie':
                this.renderPieChart(chart);
                break;
            case 'doughnut':
                this.renderDoughnutChart(chart);
                break;
        }
    }
    
    renderLineChart(chart) {
        const { ctx, canvas, data, colors } = chart;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue;
        
        // Draw grid
        ctx.strokeStyle = 'rgba(111, 66, 193, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw line
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = colors[0];
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    renderBarChart(chart) {
        const { ctx, canvas, data, colors } = chart;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        const maxValue = Math.max(...data);
        const barWidth = chartWidth / data.length * 0.8;
        const barSpacing = chartWidth / data.length * 0.2;
        
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = padding + chartHeight - barHeight;
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }
    
    renderPieChart(chart) {
        const { ctx, canvas, data, colors } = chart;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        const total = data.reduce((sum, value) => sum + value, 0);
        let currentAngle = 0;
        
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
    }
    
    renderDoughnutChart(chart) {
        const { ctx, canvas, data, colors } = chart;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const outerRadius = Math.min(centerX, centerY) - 40;
        const innerRadius = outerRadius * 0.6;
        
        const total = data.reduce((sum, value) => sum + value, 0);
        let currentAngle = 0;
        
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
    }
    
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            this.renderChart(chart);
        }
    }
}

// ========================================
// MODAL SYSTEM
// ========================================
class EmaModals {
    constructor() {
        this.modals = new Map();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ema-modal-close') || 
                e.target.classList.contains('ema-modal') && e.target === e.currentTarget) {
                this.close(e.target.closest('.ema-modal'));
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    }
    
    create(options = {}) {
        const modalId = options.id || `modal-${Date.now()}`;
        const modal = document.createElement('div');
        modal.className = 'ema-modal';
        modal.id = modalId;
        
        modal.innerHTML = `
            <div class="ema-modal-content">
                <div class="ema-modal-header">
                    <h3 class="ema-modal-title">${options.title || 'Modal'}</h3>
                    <button class="ema-modal-close">&times;</button>
                </div>
                <div class="ema-modal-body">
                    ${options.content || ''}
                </div>
                ${options.footer ? `<div class="ema-modal-footer">${options.footer}</div>` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modals.set(modalId, modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        return modal;
    }
    
    show(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }
    
    close(modal) {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }
    
    closeAll() {
        this.modals.forEach(modal => {
            this.close(modal);
        });
    }
}

// ========================================
// FORM SYSTEM
// ========================================
class EmaForms {
    constructor() {
        this.forms = new Map();
        this.init();
    }
    
    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
    }
    
    setupFormValidation() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('.ema-form-input, .ema-form-select')) {
                this.validateField(e.target);
            }
        });
    }
    
    setupFormSubmission() {
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('ema-form')) {
                e.preventDefault();
                this.handleSubmit(e.target);
            }
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        let isValid = true;
        let message = '';
        
        if (required && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        } else if (type === 'url' && value && !this.isValidUrl(value)) {
            isValid = false;
            message = 'Please enter a valid URL';
        }
        
        this.showFieldValidation(field, isValid, message);
        return isValid;
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    showFieldValidation(field, isValid, message) {
        // Remove existing validation
        const existingError = field.parentNode.querySelector('.ema-field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Remove existing classes
        field.classList.remove('ema-field-valid', 'ema-field-invalid');
        
        if (message) {
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'ema-field-error';
            errorDiv.style.cssText = `
                color: #dc3545;
                font-size: 0.75rem;
                margin-top: 0.25rem;
            `;
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
            
            field.classList.add('ema-field-invalid');
        } else if (field.value.trim()) {
            field.classList.add('ema-field-valid');
        }
    }
    
    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate all fields
        const fields = form.querySelectorAll('.ema-form-input, .ema-form-select');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // Form is valid, handle submission
            this.submitForm(form, data);
        } else {
            // Show form error
            if (window.EmaAlerts) {
                window.EmaAlerts.error('Please fix the errors in the form');
            }
        }
    }
    
    submitForm(form, data) {
        // Simulate form submission
        if (window.EmaAlerts) {
            window.EmaAlerts.success('Form submitted successfully!', {
                title: 'Success',
                timer: 3000
            });
        }
        
        // Reset form
        form.reset();
        
        // Remove validation classes
        const fields = form.querySelectorAll('.ema-form-input, .ema-form-select');
        fields.forEach(field => {
            field.classList.remove('ema-field-valid', 'ema-field-invalid');
        });
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
const EmaUtils = {
    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },
    
    // Generate random ID
    generateId(prefix = 'ema') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Format date
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Get random color
    getRandomColor() {
        const colors = ['#6f42c1', '#28a745', '#dc3545', '#007bff', '#ffc107', '#fd7e14'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    // Animate number
    animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const difference = end - start;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (difference * this.easeOutQuart(progress));
            element.textContent = Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Easing function
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Ema Framework
    window.EmaApp = new EmaFramework({
        theme: 'dark',
        animations: true,
        components: ['alerts', '3d-effects', 'live-preview', 'charts', 'modals', 'forms'],
        debug: false
    });
    
    // Initialize subsystems
    window.EmaAlerts = new EmaAlerts();
    window.Ema3D = new Ema3DEffects();
    window.EmaLivePreview = new EmaLivePreview();
    window.EmaCharts = new EmaCharts();
    window.EmaModals = new EmaModals();
    window.EmaForms = new EmaForms();
    
    // Make utilities globally available
    window.EmaUtils = EmaUtils;
    
    console.log('🚀 Ema Framework v2.0.0 initialized successfully!');
});

// ========================================
// EXPORT FOR MODULE SYSTEMS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EmaFramework,
        EmaAlerts,
        Ema3DEffects,
        EmaLivePreview,
        EmaCharts,
        EmaModals,
        EmaForms,
        EmaUtils
    };
}
