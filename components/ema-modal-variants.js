/**
 * Ema Framework - Modal Component Variants
 * 5 different modal designs with 8 color variants each
 */

class EmaModalVariants {
    constructor() {
        this.variants = {
            // Variant 1: Classic Modal
            classic: {
                name: 'Classic Modal',
                description: 'Traditional modal with clean design',
                styles: {
                    primary: 'background: white; border: 1px solid #6f42c1; box-shadow: 0 10px 30px rgba(111, 66, 193, 0.2);',
                    secondary: 'background: white; border: 1px solid #6c757d; box-shadow: 0 10px 30px rgba(108, 117, 125, 0.2);',
                    success: 'background: white; border: 1px solid #28a745; box-shadow: 0 10px 30px rgba(40, 167, 69, 0.2);',
                    danger: 'background: white; border: 1px solid #dc3545; box-shadow: 0 10px 30px rgba(220, 53, 69, 0.2);',
                    warning: 'background: white; border: 1px solid #ffc107; box-shadow: 0 10px 30px rgba(255, 193, 7, 0.2);',
                    info: 'background: white; border: 1px solid #17a2b8; box-shadow: 0 10px 30px rgba(23, 162, 184, 0.2);',
                    light: 'background: white; border: 1px solid #f8f9fa; box-shadow: 0 10px 30px rgba(248, 249, 250, 0.2);',
                    dark: 'background: #343a40; border: 1px solid #23272b; box-shadow: 0 10px 30px rgba(52, 58, 64, 0.2); color: white;'
                }
            },
            
            // Variant 2: Glass Modal
            glass: {
                name: 'Glass Modal',
                description: 'Modal with glassmorphism effect',
                styles: {
                    primary: 'background: rgba(111, 66, 193, 0.1); border: 1px solid rgba(111, 66, 193, 0.2); backdrop-filter: blur(20px); color: #6f42c1;',
                    secondary: 'background: rgba(108, 117, 125, 0.1); border: 1px solid rgba(108, 117, 125, 0.2); backdrop-filter: blur(20px); color: #6c757d;',
                    success: 'background: rgba(40, 167, 69, 0.1); border: 1px solid rgba(40, 167, 69, 0.2); backdrop-filter: blur(20px); color: #28a745;',
                    danger: 'background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.2); backdrop-filter: blur(20px); color: #dc3545;',
                    warning: 'background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.2); backdrop-filter: blur(20px); color: #ffc107;',
                    info: 'background: rgba(23, 162, 184, 0.1); border: 1px solid rgba(23, 162, 184, 0.2); backdrop-filter: blur(20px); color: #17a2b8;',
                    light: 'background: rgba(248, 249, 250, 0.1); border: 1px solid rgba(248, 249, 250, 0.2); backdrop-filter: blur(20px); color: #f8f9fa;',
                    dark: 'background: rgba(52, 58, 64, 0.1); border: 1px solid rgba(52, 58, 64, 0.2); backdrop-filter: blur(20px); color: #343a40;'
                }
            },
            
            // Variant 3: Slide Modal
            slide: {
                name: 'Slide Modal',
                description: 'Modal that slides in from different directions',
                styles: {
                    primary: 'background: white; border: none; box-shadow: 0 0 50px rgba(111, 66, 193, 0.3); transform: translateX(100%);',
                    secondary: 'background: white; border: none; box-shadow: 0 0 50px rgba(108, 117, 125, 0.3); transform: translateX(100%);',
                    success: 'background: white; border: none; box-shadow: 0 0 50px rgba(40, 167, 69, 0.3); transform: translateX(100%);',
                    danger: 'background: white; border: none; box-shadow: 0 0 50px rgba(220, 53, 69, 0.3); transform: translateX(100%);',
                    warning: 'background: white; border: none; box-shadow: 0 0 50px rgba(255, 193, 7, 0.3); transform: translateX(100%);',
                    info: 'background: white; border: none; box-shadow: 0 0 50px rgba(23, 162, 184, 0.3); transform: translateX(100%);',
                    light: 'background: white; border: none; box-shadow: 0 0 50px rgba(248, 249, 250, 0.3); transform: translateX(100%);',
                    dark: 'background: #343a40; border: none; box-shadow: 0 0 50px rgba(52, 58, 64, 0.3); transform: translateX(100%); color: white;'
                }
            },
            
            // Variant 4: 3D Modal
            threeD: {
                name: '3D Modal',
                description: 'Modal with 3D perspective effects',
                styles: {
                    primary: 'background: white; border: none; box-shadow: 0 20px 60px rgba(111, 66, 193, 0.4); transform: perspective(1000px) rotateX(10deg);',
                    secondary: 'background: white; border: none; box-shadow: 0 20px 60px rgba(108, 117, 125, 0.4); transform: perspective(1000px) rotateX(10deg);',
                    success: 'background: white; border: none; box-shadow: 0 20px 60px rgba(40, 167, 69, 0.4); transform: perspective(1000px) rotateX(10deg);',
                    danger: 'background: white; border: none; box-shadow: 0 20px 60px rgba(220, 53, 69, 0.4); transform: perspective(1000px) rotateX(10deg);',
                    warning: 'background: white; border: none; box-shadow: 0 20px 60px rgba(255, 193, 7, 0.4); transform: perspective(1000px) rotateX(10deg);',
                    info: 'background: white; border: none; box-shadow: 0 20px 60px rgba(23, 162, 184, 0.4); transform: perspective(1000px) rotateX(10deg);',
                    light: 'background: white; border: none; box-shadow: 0 20px 60px rgba(248, 249, 250, 0.4); transform: perspective(1000px) rotateX(10deg);',
                    dark: 'background: #343a40; border: none; box-shadow: 0 20px 60px rgba(52, 58, 64, 0.4); transform: perspective(1000px) rotateX(10deg); color: white;'
                }
            },
            
            // Variant 5: Floating Modal
            floating: {
                name: 'Floating Modal',
                description: 'Modal with floating animation',
                styles: {
                    primary: 'background: white; border: none; box-shadow: 0 30px 80px rgba(111, 66, 193, 0.3); animation: float 3s ease-in-out infinite;',
                    secondary: 'background: white; border: none; box-shadow: 0 30px 80px rgba(108, 117, 125, 0.3); animation: float 3s ease-in-out infinite;',
                    success: 'background: white; border: none; box-shadow: 0 30px 80px rgba(40, 167, 69, 0.3); animation: float 3s ease-in-out infinite;',
                    danger: 'background: white; border: none; box-shadow: 0 30px 80px rgba(220, 53, 69, 0.3); animation: float 3s ease-in-out infinite;',
                    warning: 'background: white; border: none; box-shadow: 0 30px 80px rgba(255, 193, 7, 0.3); animation: float 3s ease-in-out infinite;',
                    info: 'background: white; border: none; box-shadow: 0 30px 80px rgba(23, 162, 184, 0.3); animation: float 3s ease-in-out infinite;',
                    light: 'background: white; border: none; box-shadow: 0 30px 80px rgba(248, 249, 250, 0.3); animation: float 3s ease-in-out infinite;',
                    dark: 'background: #343a40; border: none; box-shadow: 0 30px 80px rgba(52, 58, 64, 0.3); animation: float 3s ease-in-out infinite; color: white;'
                }
            }
        };
    }

    createModal(variant, color, content, options = {}) {
        const variantData = this.variants[variant];
        if (!variantData) return null;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'ema-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.className = `ema-modal ema-modal-${variant} ema-modal-${color}`;
        modal.style.cssText = `
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            font-family: 'Inter', sans-serif;
            ${variantData.styles[color] || variantData.styles.primary}
        `;

        // Add content
        if (typeof content === 'string') {
            modal.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            modal.appendChild(content);
        } else {
            modal.innerHTML = '<p>Modal content</p>';
        }

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            transition: color 0.3s ease;
        `;

        closeBtn.addEventListener('click', () => {
            this.closeModal(overlay);
        });

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#333';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = '#999';
        });

        modal.appendChild(closeBtn);
        overlay.appendChild(modal);

        // Add event listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal(overlay);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(overlay);
            }
        });

        return overlay;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        
        // Add entrance animation
        const modalContent = modal.querySelector('.ema-modal');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.8) translateY(20px)';
            setTimeout(() => {
                modalContent.style.transform = 'scale(1) translateY(0)';
            }, 10);
        }
    }

    closeModal(modal) {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        
        // Add exit animation
        const modalContent = modal.querySelector('.ema-modal');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.8) translateY(20px)';
        }
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    getAllVariants() {
        return this.variants;
    }

    getVariant(variant) {
        return this.variants[variant];
    }
}

// Add floating animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmaModalVariants;
} else {
    window.EmaModalVariants = EmaModalVariants;
}
