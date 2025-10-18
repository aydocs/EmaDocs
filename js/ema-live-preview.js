/**
 * EMA FRAMEWORK - LIVE UI PREVIEW SYSTEM
 * Revolutionary live preview and code copying system
 */

class EmaLivePreview {
    constructor() {
        this.previewContainer = null;
        this.currentComponent = null;
        this.init();
    }

    init() {
        this.createPreviewContainer();
        this.setupEventListeners();
    }

    createPreviewContainer() {
        this.previewContainer = document.createElement('div');
        this.previewContainer.className = 'live-preview-container';
        this.previewContainer.innerHTML = `
            <div class="live-preview-header">
                <h3 class="live-preview-title">Live Component Preview</h3>
                <button class="live-preview-close">&times;</button>
            </div>
            <div class="live-preview-content" id="preview-content">
                <!-- Component preview will be inserted here -->
            </div>
            <div class="live-preview-actions">
                <button class="copy-code-btn" id="copy-code-btn">Copy Code</button>
                <button class="ema-btn ema-btn-secondary" id="close-preview-btn">Close</button>
            </div>
        `;
        document.body.appendChild(this.previewContainer);
    }

    setupEventListeners() {
        // Close button
        this.previewContainer.querySelector('.live-preview-close').addEventListener('click', () => {
            this.hidePreview();
        });

        // Close preview button
        this.previewContainer.querySelector('#close-preview-btn').addEventListener('click', () => {
            this.hidePreview();
        });

        // Copy code button
        this.previewContainer.querySelector('#copy-code-btn').addEventListener('click', () => {
            this.copyCode();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.previewContainer.classList.contains('show')) {
                this.hidePreview();
            }
        });

        // Close on backdrop click
        this.previewContainer.addEventListener('click', (e) => {
            if (e.target === this.previewContainer) {
                this.hidePreview();
            }
        });
    }

    showPreview(componentData) {
        this.currentComponent = componentData;
        this.renderPreview(componentData);
        this.previewContainer.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hidePreview() {
        this.previewContainer.classList.remove('show');
        document.body.style.overflow = '';
        this.currentComponent = null;
    }

    renderPreview(componentData) {
        const content = this.previewContainer.querySelector('#preview-content');
        const title = this.previewContainer.querySelector('.live-preview-title');
        
        title.textContent = `${componentData.name} Preview`;
        
        content.innerHTML = `
            <div class="component-demo-area">
                <div class="demo-container">
                    ${componentData.html}
                </div>
            </div>
            <div class="code-preview">
                <div class="code-header">
                    <span class="code-title">HTML Code</span>
                </div>
                <pre class="code-content"><code>${this.escapeHtml(componentData.html)}</code></pre>
            </div>
            ${componentData.css ? `
            <div class="code-preview">
                <div class="code-header">
                    <span class="code-title">CSS Code</span>
                </div>
                <pre class="code-content"><code>${this.escapeHtml(componentData.css)}</code></pre>
            </div>
            ` : ''}
            ${componentData.js ? `
            <div class="code-preview">
                <div class="code-header">
                    <span class="code-title">JavaScript Code</span>
                </div>
                <pre class="code-content"><code>${this.escapeHtml(componentData.js)}</code></pre>
            </div>
            ` : ''}
        `;

        // Apply component styles if provided
        if (componentData.css) {
            const style = document.createElement('style');
            style.textContent = componentData.css;
            content.appendChild(style);
        }

        // Execute component JavaScript if provided
        if (componentData.js) {
            try {
                eval(componentData.js);
            } catch (error) {
                console.error('Error executing component JavaScript:', error);
            }
        }
    }

    copyCode() {
        const copyBtn = this.previewContainer.querySelector('#copy-code-btn');
        const codeBlocks = this.previewContainer.querySelectorAll('.code-content code');
        
        let fullCode = '';
        
        if (this.currentComponent) {
            fullCode = `<!-- ${this.currentComponent.name} Component -->\n`;
            fullCode += this.currentComponent.html + '\n\n';
            
            if (this.currentComponent.css) {
                fullCode += `<!-- CSS -->\n<style>\n${this.currentComponent.css}\n</style>\n\n`;
            }
            
            if (this.currentComponent.js) {
                fullCode += `<!-- JavaScript -->\n<script>\n${this.currentComponent.js}\n</script>`;
            }
        }

        navigator.clipboard.writeText(fullCode).then(() => {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy code:', err);
            copyBtn.textContent = 'Copy Failed';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
            }, 2000);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Component Library
const EmaComponents = {
    // Button Components
    button: {
        name: 'Button',
        html: `
            <div class="button-showcase">
                <button class="ema-btn ema-btn-primary">Primary Button</button>
                <button class="ema-btn ema-btn-secondary">Secondary Button</button>
                <button class="ema-btn ema-btn-tertiary">Tertiary Button</button>
            </div>
        `,
        css: `
            .button-showcase {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                border: 1px solid rgba(111, 66, 193, 0.2);
            }
        `
    },

    // Card Components
    card: {
        name: 'Card',
        html: `
            <div class="card-showcase">
                <div class="ema-card">
                    <h3>Card Title</h3>
                    <p>This is a beautiful card component with hover effects and modern styling.</p>
                    <button class="ema-btn ema-btn-primary">Action</button>
                </div>
            </div>
        `,
        css: `
            .card-showcase {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                border: 1px solid rgba(111, 66, 193, 0.2);
            }
            .card-showcase .ema-card {
                max-width: 400px;
            }
        `
    },

    // Input Components
    input: {
        name: 'Input',
        html: `
            <div class="input-showcase">
                <div class="input-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter your email" class="ema-input">
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password" class="ema-input">
                </div>
                <div class="input-group">
                    <label>Message</label>
                    <textarea placeholder="Enter your message" class="ema-textarea" rows="4"></textarea>
                </div>
            </div>
        `,
        css: `
            .input-showcase {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                border: 1px solid rgba(111, 66, 193, 0.2);
                max-width: 500px;
            }
            .input-group {
                margin-bottom: 1.5rem;
            }
            .input-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #a0a0a0;
                font-weight: 500;
            }
            .ema-input, .ema-textarea {
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(111, 66, 193, 0.2);
                border-radius: 12px;
                color: #ffffff;
                font-family: inherit;
                transition: all 0.3s ease;
            }
            .ema-input:focus, .ema-textarea:focus {
                outline: none;
                border-color: #6f42c1;
                box-shadow: 0 0 0 2px rgba(111, 66, 193, 0.2);
            }
            .ema-input::placeholder, .ema-textarea::placeholder {
                color: #a0a0a0;
            }
        `
    },

    // Navigation Components
    navbar: {
        name: 'Navigation Bar',
        html: `
            <div class="navbar-showcase">
                <nav class="ema-navbar">
                    <div class="nav-brand">
                        <div class="logo-icon">E</div>
                        <span>Ema</span>
                    </div>
                    <ul class="nav-menu">
                        <li><a href="#" class="nav-link active">Home</a></li>
                        <li><a href="#" class="nav-link">Components</a></li>
                        <li><a href="#" class="nav-link">Examples</a></li>
                        <li><a href="#" class="nav-link">API</a></li>
                    </ul>
                    <button class="ema-btn ema-btn-primary">Get Started</button>
                </nav>
            </div>
        `,
        css: `
            .navbar-showcase {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                border: 1px solid rgba(111, 66, 193, 0.2);
                overflow: hidden;
            }
            .ema-navbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem 2rem;
                background: rgba(10, 10, 10, 0.95);
                backdrop-filter: blur(20px);
            }
            .nav-brand {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.5rem;
                font-weight: 900;
                color: #6f42c1;
            }
            .nav-menu {
                display: flex;
                list-style: none;
                gap: 2rem;
                align-items: center;
            }
            .nav-link {
                color: #a0a0a0;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s ease;
            }
            .nav-link:hover,
            .nav-link.active {
                color: #6f42c1;
            }
        `
    },

    // Alert Components
    alert: {
        name: 'Alert',
        html: `
            <div class="alert-showcase">
                <div class="ema-alert ema-alert-success">
                    <span class="alert-icon">✅</span>
                    <div class="alert-content">
                        <h4>Success!</h4>
                        <p>Your action was completed successfully.</p>
                    </div>
                </div>
                <div class="ema-alert ema-alert-warning">
                    <span class="alert-icon">⚠️</span>
                    <div class="alert-content">
                        <h4>Warning!</h4>
                        <p>Please check your input before proceeding.</p>
                    </div>
                </div>
                <div class="ema-alert ema-alert-error">
                    <span class="alert-icon">❌</span>
                    <div class="alert-content">
                        <h4>Error!</h4>
                        <p>Something went wrong. Please try again.</p>
                    </div>
                </div>
            </div>
        `,
        css: `
            .alert-showcase {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                border: 1px solid rgba(111, 66, 193, 0.2);
                max-width: 600px;
            }
            .ema-alert {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                margin-bottom: 1rem;
            }
            .ema-alert-success {
                background: rgba(40, 167, 69, 0.1);
                border: 1px solid rgba(40, 167, 69, 0.3);
            }
            .ema-alert-warning {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
            }
            .ema-alert-error {
                background: rgba(220, 53, 69, 0.1);
                border: 1px solid rgba(220, 53, 69, 0.3);
            }
            .alert-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }
            .alert-content h4 {
                margin: 0 0 0.25rem 0;
                font-size: 1rem;
                font-weight: 600;
            }
            .alert-content p {
                margin: 0;
                font-size: 0.875rem;
                opacity: 0.9;
            }
        `
    }
};

// Initialize Live Preview system
const emaLivePreview = new EmaLivePreview();

// Function to show component preview
function showComponentPreview(componentName) {
    if (EmaComponents[componentName]) {
        emaLivePreview.showPreview(EmaComponents[componentName]);
    } else {
        console.error(`Component "${componentName}" not found`);
    }
}

// Export for global use
window.emaLivePreview = emaLivePreview;
window.showComponentPreview = showComponentPreview;
window.EmaComponents = EmaComponents;
