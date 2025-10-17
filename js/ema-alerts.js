/**
 * Ema Framework - Advanced Alert System
 * Sweet Alert benzeri ama daha gelişmiş bildirim sistemi
 */

class EmaAlerts {
    constructor() {
        this.container = null;
        this.alerts = new Map();
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'ema-alerts-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    setupStyles() {
        if (document.getElementById('ema-alerts-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'ema-alerts-styles';
        styles.textContent = `
            .ema-alert {
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                border: 1px solid rgba(111, 66, 193, 0.1);
                padding: 20px;
                display: flex;
                align-items: flex-start;
                gap: 16px;
                min-width: 320px;
                max-width: 400px;
                pointer-events: auto;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                position: relative;
                overflow: hidden;
            }

            .ema-alert.show {
                transform: translateX(0);
                opacity: 1;
            }

            .ema-alert::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: var(--alert-color, #6f42c1);
            }

            .ema-alert-icon {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
                background: var(--alert-color, #6f42c1);
                flex-shrink: 0;
                animation: ema-alert-pulse 2s infinite;
            }

            .ema-alert-content {
                flex: 1;
                min-width: 0;
            }

            .ema-alert-title {
                font-size: 16px;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 4px;
                line-height: 1.2;
            }

            .ema-alert-message {
                font-size: 14px;
                color: #64748b;
                line-height: 1.4;
                margin-bottom: 12px;
            }

            .ema-alert-actions {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }

            .ema-alert-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 80px;
            }

            .ema-alert-btn-primary {
                background: var(--alert-color, #6f42c1);
                color: white;
            }

            .ema-alert-btn-primary:hover {
                background: var(--alert-color-dark, #5a359a);
                transform: translateY(-1px);
            }

            .ema-alert-btn-secondary {
                background: #f1f5f9;
                color: #64748b;
                border: 1px solid #e2e8f0;
            }

            .ema-alert-btn-secondary:hover {
                background: #e2e8f0;
            }

            .ema-alert-close {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 24px;
                height: 24px;
                border: none;
                background: none;
                cursor: pointer;
                color: #94a3b8;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .ema-alert-close:hover {
                background: #f1f5f9;
                color: #64748b;
            }

            .ema-alert-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: var(--alert-color, #6f42c1);
                transition: width linear;
            }

            @keyframes ema-alert-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .ema-alert-success { --alert-color: #28a745; --alert-color-dark: #1e7e34; }
            .ema-alert-error { --alert-color: #dc3545; --alert-color-dark: #c82333; }
            .ema-alert-warning { --alert-color: #ffc107; --alert-color-dark: #e0a800; }
            .ema-alert-info { --alert-color: #007bff; --alert-color-dark: #0056b3; }
            .ema-alert-purple { --alert-color: #6f42c1; --alert-color-dark: #5a359a; }
            .ema-alert-orange { --alert-color: #fd7e14; --alert-color-dark: #e55a00; }
            .ema-alert-gray { --alert-color: #6c757d; --alert-color-dark: #495057; }

            .ema-alert-loading .ema-alert-icon {
                animation: ema-alert-spin 1s linear infinite;
            }

            @keyframes ema-alert-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .ema-alert {
                    background: #1e293b;
                    border-color: rgba(111, 66, 193, 0.2);
                }
                
                .ema-alert-title {
                    color: #f1f5f9;
                }
                
                .ema-alert-message {
                    color: #94a3b8;
                }
                
                .ema-alert-btn-secondary {
                    background: #334155;
                    color: #94a3b8;
                    border-color: #475569;
                }
                
                .ema-alert-btn-secondary:hover {
                    background: #475569;
                }
                
                .ema-alert-close {
                    color: #64748b;
                }
                
                .ema-alert-close:hover {
                    background: #334155;
                    color: #94a3b8;
                }
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .ema-alerts-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .ema-alert {
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    show(options = {}) {
        const id = this.generateId();
        const alert = this.createAlert(id, options);
        
        this.container.appendChild(alert);
        this.alerts.set(id, alert);

        // Trigger animation
        requestAnimationFrame(() => {
            alert.classList.add('show');
        });

        // Auto close if timer is set
        if (options.timer) {
            this.setupTimer(id, options.timer);
        }

        return id;
    }

    createAlert(id, options) {
        const alert = document.createElement('div');
        alert.className = `ema-alert ema-alert-${options.type || 'info'}`;
        alert.dataset.id = id;

        const icon = this.getIcon(options.type, options.icon);
        const title = options.title || this.getDefaultTitle(options.type);
        const message = options.message || '';
        const buttons = this.createButtons(options);

        alert.innerHTML = `
            <div class="ema-alert-icon">${icon}</div>
            <div class="ema-alert-content">
                <div class="ema-alert-title">${title}</div>
                <div class="ema-alert-message">${message}</div>
                ${buttons}
            </div>
            <button class="ema-alert-close" onclick="emaAlerts.close('${id}')">×</button>
            ${options.timer ? '<div class="ema-alert-progress"></div>' : ''}
        `;

        // Setup button events
        this.setupButtonEvents(alert, options);

        return alert;
    }

    getIcon(type, customIcon) {
        if (customIcon) return customIcon;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
            purple: '★',
            orange: '●',
            gray: '○'
        };
        
        return icons[type] || icons.info;
    }

    getDefaultTitle(type) {
        const titles = {
            success: 'Success!',
            error: 'Error!',
            warning: 'Warning!',
            info: 'Information',
            purple: 'Notice',
            orange: 'Alert',
            gray: 'Message'
        };
        
        return titles[type] || titles.info;
    }

    createButtons(options) {
        if (!options.showConfirmButton && !options.showCancelButton) {
            return '';
        }

        const buttons = [];
        
        if (options.showCancelButton) {
            buttons.push(`
                <button class="ema-alert-btn ema-alert-btn-secondary" data-action="cancel">
                    ${options.cancelButtonText || 'Cancel'}
                </button>
            `);
        }
        
        if (options.showConfirmButton) {
            buttons.push(`
                <button class="ema-alert-btn ema-alert-btn-primary" data-action="confirm">
                    ${options.confirmButtonText || 'OK'}
                </button>
            `);
        }

        return `<div class="ema-alert-actions">${buttons.join('')}</div>`;
    }

    setupButtonEvents(alert, options) {
        const buttons = alert.querySelectorAll('[data-action]');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                
                if (action === 'confirm' && options.confirmCallback) {
                    options.confirmCallback();
                } else if (action === 'cancel' && options.cancelCallback) {
                    options.cancelCallback();
                }
                
                this.close(alert.dataset.id);
            });
        });
    }

    setupTimer(id, timer) {
        const alert = this.alerts.get(id);
        if (!alert) return;

        const progressBar = alert.querySelector('.ema-alert-progress');
        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.style.transition = `width ${timer}ms linear`;
            
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 50);
        }

        setTimeout(() => {
            this.close(id);
        }, timer);
    }

    close(id) {
        const alert = this.alerts.get(id);
        if (!alert) return;

        alert.classList.remove('show');
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
            this.alerts.delete(id);
        }, 400);
    }

    closeAll() {
        this.alerts.forEach((alert, id) => {
            this.close(id);
        });
    }

    generateId() {
        return 'ema-alert-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Convenience methods
    success(message, options = {}) {
        return this.show({
            type: 'success',
            message,
            timer: options.timer || 3000,
            ...options
        });
    }

    error(message, options = {}) {
        return this.show({
            type: 'error',
            message,
            timer: options.timer || 5000,
            ...options
        });
    }

    warning(message, options = {}) {
        return this.show({
            type: 'warning',
            message,
            timer: options.timer || 4000,
            ...options
        });
    }

    info(message, options = {}) {
        return this.show({
            type: 'info',
            message,
            timer: options.timer || 3000,
            ...options
        });
    }

    confirm(message, options = {}) {
        return new Promise((resolve) => {
            this.show({
                type: 'warning',
                message,
                title: options.title || 'Confirm Action',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: options.confirmButtonText || 'Yes',
                cancelButtonText: options.cancelButtonText || 'No',
                confirmCallback: () => resolve(true),
                cancelCallback: () => resolve(false)
            });
        });
    }

    prompt(message, options = {}) {
        return new Promise((resolve) => {
            const alertId = this.show({
                type: 'info',
                message: message + '<br><br><input type="text" id="ema-prompt-input" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; margin-top: 8px;" placeholder="' + (options.placeholder || 'Enter value') + '">',
                title: options.title || 'Enter Value',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: options.confirmButtonText || 'OK',
                cancelButtonText: options.cancelButtonText || 'Cancel',
                confirmCallback: () => {
                    const input = document.getElementById('ema-prompt-input');
                    resolve(input ? input.value : null);
                },
                cancelCallback: () => resolve(null)
            });

            // Focus input after animation
            setTimeout(() => {
                const input = document.getElementById('ema-prompt-input');
                if (input) {
                    input.focus();
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            const confirmBtn = document.querySelector(`[data-id="${alertId}"] .ema-alert-btn-primary`);
                            if (confirmBtn) confirmBtn.click();
                        }
                    });
                }
            }, 500);
        });
    }

    loading(message = 'Loading...', options = {}) {
        return this.show({
            type: 'info',
            message,
            title: options.title || 'Please Wait',
            icon: '⟳',
            timer: null, // No auto close
            showConfirmButton: false,
            showCancelButton: false,
            ...options
        });
    }
}

// Initialize global instance
window.emaAlerts = new EmaAlerts();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmaAlerts;
}

