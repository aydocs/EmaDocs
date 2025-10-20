/**
 * Ema Framework - Button Component Variants
 * 5 different button designs with 8 color variants each
 */

class EmaButtonVariants {
    constructor() {
        this.variants = {
            // Variant 1: Classic Button
            classic: {
                name: 'Classic Button',
                description: 'Traditional button with solid background',
                styles: {
                    primary: 'background: linear-gradient(135deg, #6f42c1, #5a36a0); color: white; border: none;',
                    secondary: 'background: linear-gradient(135deg, #6c757d, #5a6268); color: white; border: none;',
                    success: 'background: linear-gradient(135deg, #28a745, #1e7e34); color: white; border: none;',
                    danger: 'background: linear-gradient(135deg, #dc3545, #c82333); color: white; border: none;',
                    warning: 'background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; border: none;',
                    info: 'background: linear-gradient(135deg, #17a2b8, #138496); color: white; border: none;',
                    light: 'background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #212529; border: 1px solid #dee2e6;',
                    dark: 'background: linear-gradient(135deg, #343a40, #23272b); color: white; border: none;'
                }
            },
            
            // Variant 2: Outline Button
            outline: {
                name: 'Outline Button',
                description: 'Button with transparent background and colored border',
                styles: {
                    primary: 'background: transparent; color: #6f42c1; border: 2px solid #6f42c1;',
                    secondary: 'background: transparent; color: #6c757d; border: 2px solid #6c757d;',
                    success: 'background: transparent; color: #28a745; border: 2px solid #28a745;',
                    danger: 'background: transparent; color: #dc3545; border: 2px solid #dc3545;',
                    warning: 'background: transparent; color: #ffc107; border: 2px solid #ffc107;',
                    info: 'background: transparent; color: #17a2b8; border: 2px solid #17a2b8;',
                    light: 'background: transparent; color: #f8f9fa; border: 2px solid #f8f9fa;',
                    dark: 'background: transparent; color: #343a40; border: 2px solid #343a40;'
                }
            },
            
            // Variant 3: Rounded Button
            rounded: {
                name: 'Rounded Button',
                description: 'Button with fully rounded corners',
                styles: {
                    primary: 'background: linear-gradient(135deg, #6f42c1, #5a36a0); color: white; border: none; border-radius: 50px;',
                    secondary: 'background: linear-gradient(135deg, #6c757d, #5a6268); color: white; border: none; border-radius: 50px;',
                    success: 'background: linear-gradient(135deg, #28a745, #1e7e34); color: white; border: none; border-radius: 50px;',
                    danger: 'background: linear-gradient(135deg, #dc3545, #c82333); color: white; border: none; border-radius: 50px;',
                    warning: 'background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; border: none; border-radius: 50px;',
                    info: 'background: linear-gradient(135deg, #17a2b8, #138496); color: white; border: none; border-radius: 50px;',
                    light: 'background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #212529; border: 1px solid #dee2e6; border-radius: 50px;',
                    dark: 'background: linear-gradient(135deg, #343a40, #23272b); color: white; border: none; border-radius: 50px;'
                }
            },
            
            // Variant 4: 3D Button
            threeD: {
                name: '3D Button',
                description: 'Button with 3D shadow effects',
                styles: {
                    primary: 'background: linear-gradient(135deg, #6f42c1, #5a36a0); color: white; border: none; box-shadow: 0 4px 15px rgba(111, 66, 193, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);',
                    secondary: 'background: linear-gradient(135deg, #6c757d, #5a6268); color: white; border: none; box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);',
                    success: 'background: linear-gradient(135deg, #28a745, #1e7e34); color: white; border: none; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);',
                    danger: 'background: linear-gradient(135deg, #dc3545, #c82333); color: white; border: none; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);',
                    warning: 'background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; border: none; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);',
                    info: 'background: linear-gradient(135deg, #17a2b8, #138496); color: white; border: none; box-shadow: 0 4px 15px rgba(23, 162, 184, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);',
                    light: 'background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #212529; border: 1px solid #dee2e6; box-shadow: 0 4px 15px rgba(248, 249, 250, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);',
                    dark: 'background: linear-gradient(135deg, #343a40, #23272b); color: white; border: none; box-shadow: 0 4px 15px rgba(52, 58, 64, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);'
                }
            },
            
            // Variant 5: Glass Button
            glass: {
                name: 'Glass Button',
                description: 'Button with glassmorphism effect',
                styles: {
                    primary: 'background: rgba(111, 66, 193, 0.2); color: #6f42c1; border: 1px solid rgba(111, 66, 193, 0.3); backdrop-filter: blur(10px);',
                    secondary: 'background: rgba(108, 117, 125, 0.2); color: #6c757d; border: 1px solid rgba(108, 117, 125, 0.3); backdrop-filter: blur(10px);',
                    success: 'background: rgba(40, 167, 69, 0.2); color: #28a745; border: 1px solid rgba(40, 167, 69, 0.3); backdrop-filter: blur(10px);',
                    danger: 'background: rgba(220, 53, 69, 0.2); color: #dc3545; border: 1px solid rgba(220, 53, 69, 0.3); backdrop-filter: blur(10px);',
                    warning: 'background: rgba(255, 193, 7, 0.2); color: #ffc107; border: 1px solid rgba(255, 193, 7, 0.3); backdrop-filter: blur(10px);',
                    info: 'background: rgba(23, 162, 184, 0.2); color: #17a2b8; border: 1px solid rgba(23, 162, 184, 0.3); backdrop-filter: blur(10px);',
                    light: 'background: rgba(248, 249, 250, 0.2); color: #f8f9fa; border: 1px solid rgba(248, 249, 250, 0.3); backdrop-filter: blur(10px);',
                    dark: 'background: rgba(52, 58, 64, 0.2); color: #343a40; border: 1px solid rgba(52, 58, 64, 0.3); backdrop-filter: blur(10px);'
                }
            }
        };
    }

    createButton(variant, color, text, options = {}) {
        const variantData = this.variants[variant];
        if (!variantData) return null;

        const button = document.createElement('button');
        button.className = `ema-btn ema-btn-${variant} ema-btn-${color}`;
        button.textContent = text;
        
        // Apply base styles
        button.style.cssText = `
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
            text-transform: none;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
            ${variantData.styles[color] || variantData.styles.primary}
        `;

        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });

        // Add ripple effect
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        return button;
    }

    getAllVariants() {
        return this.variants;
    }

    getVariant(variant) {
        return this.variants[variant];
    }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmaButtonVariants;
} else {
    window.EmaButtonVariants = EmaButtonVariants;
}
