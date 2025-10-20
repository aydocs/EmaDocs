/**
 * Ema Framework - Input Component Variants
 * 5 different input designs with 8 color variants each
 */

class EmaInputVariants {
    constructor() {
        this.variants = {
            // Variant 1: Classic Input
            classic: {
                name: 'Classic Input',
                description: 'Traditional input with clean borders',
                styles: {
                    primary: 'border: 2px solid #6f42c1; background: white; color: #333;',
                    secondary: 'border: 2px solid #6c757d; background: white; color: #333;',
                    success: 'border: 2px solid #28a745; background: white; color: #333;',
                    danger: 'border: 2px solid #dc3545; background: white; color: #333;',
                    warning: 'border: 2px solid #ffc107; background: white; color: #333;',
                    info: 'border: 2px solid #17a2b8; background: white; color: #333;',
                    light: 'border: 2px solid #f8f9fa; background: white; color: #333;',
                    dark: 'border: 2px solid #343a40; background: #343a40; color: white;'
                }
            },
            
            // Variant 2: Floating Input
            floating: {
                name: 'Floating Input',
                description: 'Input with floating label animation',
                styles: {
                    primary: 'border: none; border-bottom: 2px solid #6f42c1; background: transparent; color: #333;',
                    secondary: 'border: none; border-bottom: 2px solid #6c757d; background: transparent; color: #333;',
                    success: 'border: none; border-bottom: 2px solid #28a745; background: transparent; color: #333;',
                    danger: 'border: none; border-bottom: 2px solid #dc3545; background: transparent; color: #333;',
                    warning: 'border: none; border-bottom: 2px solid #ffc107; background: transparent; color: #333;',
                    info: 'border: none; border-bottom: 2px solid #17a2b8; background: transparent; color: #333;',
                    light: 'border: none; border-bottom: 2px solid #f8f9fa; background: transparent; color: #333;',
                    dark: 'border: none; border-bottom: 2px solid #343a40; background: transparent; color: white;'
                }
            },
            
            // Variant 3: Rounded Input
            rounded: {
                name: 'Rounded Input',
                description: 'Input with fully rounded corners',
                styles: {
                    primary: 'border: 2px solid #6f42c1; background: white; color: #333; border-radius: 25px;',
                    secondary: 'border: 2px solid #6c757d; background: white; color: #333; border-radius: 25px;',
                    success: 'border: 2px solid #28a745; background: white; color: #333; border-radius: 25px;',
                    danger: 'border: 2px solid #dc3545; background: white; color: #333; border-radius: 25px;',
                    warning: 'border: 2px solid #ffc107; background: white; color: #333; border-radius: 25px;',
                    info: 'border: 2px solid #17a2b8; background: white; color: #333; border-radius: 25px;',
                    light: 'border: 2px solid #f8f9fa; background: white; color: #333; border-radius: 25px;',
                    dark: 'border: 2px solid #343a40; background: #343a40; color: white; border-radius: 25px;'
                }
            },
            
            // Variant 4: Glass Input
            glass: {
                name: 'Glass Input',
                description: 'Input with glassmorphism effect',
                styles: {
                    primary: 'border: 1px solid rgba(111, 66, 193, 0.3); background: rgba(111, 66, 193, 0.1); color: #6f42c1; backdrop-filter: blur(10px);',
                    secondary: 'border: 1px solid rgba(108, 117, 125, 0.3); background: rgba(108, 117, 125, 0.1); color: #6c757d; backdrop-filter: blur(10px);',
                    success: 'border: 1px solid rgba(40, 167, 69, 0.3); background: rgba(40, 167, 69, 0.1); color: #28a745; backdrop-filter: blur(10px);',
                    danger: 'border: 1px solid rgba(220, 53, 69, 0.3); background: rgba(220, 53, 69, 0.1); color: #dc3545; backdrop-filter: blur(10px);',
                    warning: 'border: 1px solid rgba(255, 193, 7, 0.3); background: rgba(255, 193, 7, 0.1); color: #ffc107; backdrop-filter: blur(10px);',
                    info: 'border: 1px solid rgba(23, 162, 184, 0.3); background: rgba(23, 162, 184, 0.1); color: #17a2b8; backdrop-filter: blur(10px);',
                    light: 'border: 1px solid rgba(248, 249, 250, 0.3); background: rgba(248, 249, 250, 0.1); color: #f8f9fa; backdrop-filter: blur(10px);',
                    dark: 'border: 1px solid rgba(52, 58, 64, 0.3); background: rgba(52, 58, 64, 0.1); color: #343a40; backdrop-filter: blur(10px);'
                }
            },
            
            // Variant 5: Neon Input
            neon: {
                name: 'Neon Input',
                description: 'Input with neon glow effect',
                styles: {
                    primary: 'border: 2px solid #6f42c1; background: rgba(111, 66, 193, 0.1); color: #6f42c1; box-shadow: 0 0 10px rgba(111, 66, 193, 0.5);',
                    secondary: 'border: 2px solid #6c757d; background: rgba(108, 117, 125, 0.1); color: #6c757d; box-shadow: 0 0 10px rgba(108, 117, 125, 0.5);',
                    success: 'border: 2px solid #28a745; background: rgba(40, 167, 69, 0.1); color: #28a745; box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);',
                    danger: 'border: 2px solid #dc3545; background: rgba(220, 53, 69, 0.1); color: #dc3545; box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);',
                    warning: 'border: 2px solid #ffc107; background: rgba(255, 193, 7, 0.1); color: #ffc107; box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);',
                    info: 'border: 2px solid #17a2b8; background: rgba(23, 162, 184, 0.1); color: #17a2b8; box-shadow: 0 0 10px rgba(23, 162, 184, 0.5);',
                    light: 'border: 2px solid #f8f9fa; background: rgba(248, 249, 250, 0.1); color: #f8f9fa; box-shadow: 0 0 10px rgba(248, 249, 250, 0.5);',
                    dark: 'border: 2px solid #343a40; background: rgba(52, 58, 64, 0.1); color: #343a40; box-shadow: 0 0 10px rgba(52, 58, 64, 0.5);'
                }
            }
        };
    }

    createInput(variant, color, options = {}) {
        const variantData = this.variants[variant];
        if (!variantData) return null;

        const input = document.createElement('input');
        input.className = `ema-input ema-input-${variant} ema-input-${color}`;
        input.type = options.type || 'text';
        input.placeholder = options.placeholder || 'Enter text...';
        
        // Apply base styles
        input.style.cssText = `
            padding: 12px 16px;
            font-size: 14px;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
            outline: none;
            width: 100%;
            box-sizing: border-box;
            ${variantData.styles[color] || variantData.styles.primary}
        `;

        // Add focus effects
        input.addEventListener('focus', () => {
            input.style.transform = 'scale(1.02)';
            input.style.boxShadow = '0 0 0 3px rgba(111, 66, 193, 0.1)';
        });

        input.addEventListener('blur', () => {
            input.style.transform = 'scale(1)';
            input.style.boxShadow = 'none';
        });

        return input;
    }

    createFloatingInput(variant, color, label, options = {}) {
        const container = document.createElement('div');
        container.className = 'floating-input-container';
        container.style.cssText = `
            position: relative;
            margin: 20px 0;
        `;

        const input = this.createInput(variant, color, options);
        input.style.cssText += `
            padding-top: 20px;
            padding-bottom: 8px;
        `;

        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.style.cssText = `
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            transition: all 0.3s ease;
            pointer-events: none;
            background: white;
            padding: 0 4px;
        `;

        input.addEventListener('focus', () => {
            labelElement.style.top = '0';
            labelElement.style.fontSize = '12px';
            labelElement.style.color = '#6f42c1';
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                labelElement.style.top = '50%';
                labelElement.style.fontSize = '14px';
                labelElement.style.color = '#999';
            }
        });

        container.appendChild(input);
        container.appendChild(labelElement);

        return container;
    }

    getAllVariants() {
        return this.variants;
    }

    getVariant(variant) {
        return this.variants[variant];
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmaInputVariants;
} else {
    window.EmaInputVariants = EmaInputVariants;
}
