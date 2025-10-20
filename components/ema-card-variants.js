/**
 * Ema Framework - Card Component Variants
 * 5 different card designs with 8 color variants each
 */

class EmaCardVariants {
    constructor() {
        this.variants = {
            // Variant 1: Classic Card
            classic: {
                name: 'Classic Card',
                description: 'Traditional card with clean borders',
                styles: {
                    primary: 'background: white; border: 1px solid #6f42c1; box-shadow: 0 2px 10px rgba(111, 66, 193, 0.1);',
                    secondary: 'background: white; border: 1px solid #6c757d; box-shadow: 0 2px 10px rgba(108, 117, 125, 0.1);',
                    success: 'background: white; border: 1px solid #28a745; box-shadow: 0 2px 10px rgba(40, 167, 69, 0.1);',
                    danger: 'background: white; border: 1px solid #dc3545; box-shadow: 0 2px 10px rgba(220, 53, 69, 0.1);',
                    warning: 'background: white; border: 1px solid #ffc107; box-shadow: 0 2px 10px rgba(255, 193, 7, 0.1);',
                    info: 'background: white; border: 1px solid #17a2b8; box-shadow: 0 2px 10px rgba(23, 162, 184, 0.1);',
                    light: 'background: white; border: 1px solid #f8f9fa; box-shadow: 0 2px 10px rgba(248, 249, 250, 0.1);',
                    dark: 'background: #343a40; border: 1px solid #23272b; box-shadow: 0 2px 10px rgba(52, 58, 64, 0.1); color: white;'
                }
            },
            
            // Variant 2: Gradient Card
            gradient: {
                name: 'Gradient Card',
                description: 'Card with gradient background',
                styles: {
                    primary: 'background: linear-gradient(135deg, #6f42c1, #5a36a0); color: white; border: none; box-shadow: 0 4px 20px rgba(111, 66, 193, 0.3);',
                    secondary: 'background: linear-gradient(135deg, #6c757d, #5a6268); color: white; border: none; box-shadow: 0 4px 20px rgba(108, 117, 125, 0.3);',
                    success: 'background: linear-gradient(135deg, #28a745, #1e7e34); color: white; border: none; box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);',
                    danger: 'background: linear-gradient(135deg, #dc3545, #c82333); color: white; border: none; box-shadow: 0 4px 20px rgba(220, 53, 69, 0.3);',
                    warning: 'background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; border: none; box-shadow: 0 4px 20px rgba(255, 193, 7, 0.3);',
                    info: 'background: linear-gradient(135deg, #17a2b8, #138496); color: white; border: none; box-shadow: 0 4px 20px rgba(23, 162, 184, 0.3);',
                    light: 'background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #212529; border: none; box-shadow: 0 4px 20px rgba(248, 249, 250, 0.3);',
                    dark: 'background: linear-gradient(135deg, #343a40, #23272b); color: white; border: none; box-shadow: 0 4px 20px rgba(52, 58, 64, 0.3);'
                }
            },
            
            // Variant 3: Glass Card
            glass: {
                name: 'Glass Card',
                description: 'Card with glassmorphism effect',
                styles: {
                    primary: 'background: rgba(111, 66, 193, 0.1); border: 1px solid rgba(111, 66, 193, 0.2); backdrop-filter: blur(10px); color: #6f42c1;',
                    secondary: 'background: rgba(108, 117, 125, 0.1); border: 1px solid rgba(108, 117, 125, 0.2); backdrop-filter: blur(10px); color: #6c757d;',
                    success: 'background: rgba(40, 167, 69, 0.1); border: 1px solid rgba(40, 167, 69, 0.2); backdrop-filter: blur(10px); color: #28a745;',
                    danger: 'background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.2); backdrop-filter: blur(10px); color: #dc3545;',
                    warning: 'background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.2); backdrop-filter: blur(10px); color: #ffc107;',
                    info: 'background: rgba(23, 162, 184, 0.1); border: 1px solid rgba(23, 162, 184, 0.2); backdrop-filter: blur(10px); color: #17a2b8;',
                    light: 'background: rgba(248, 249, 250, 0.1); border: 1px solid rgba(248, 249, 250, 0.2); backdrop-filter: blur(10px); color: #f8f9fa;',
                    dark: 'background: rgba(52, 58, 64, 0.1); border: 1px solid rgba(52, 58, 64, 0.2); backdrop-filter: blur(10px); color: #343a40;'
                }
            },
            
            // Variant 4: 3D Card
            threeD: {
                name: '3D Card',
                description: 'Card with 3D shadow effects',
                styles: {
                    primary: 'background: white; border: none; box-shadow: 0 10px 30px rgba(111, 66, 193, 0.2), 0 1px 8px rgba(111, 66, 193, 0.1); transform: perspective(1000px) rotateX(5deg);',
                    secondary: 'background: white; border: none; box-shadow: 0 10px 30px rgba(108, 117, 125, 0.2), 0 1px 8px rgba(108, 117, 125, 0.1); transform: perspective(1000px) rotateX(5deg);',
                    success: 'background: white; border: none; box-shadow: 0 10px 30px rgba(40, 167, 69, 0.2), 0 1px 8px rgba(40, 167, 69, 0.1); transform: perspective(1000px) rotateX(5deg);',
                    danger: 'background: white; border: none; box-shadow: 0 10px 30px rgba(220, 53, 69, 0.2), 0 1px 8px rgba(220, 53, 69, 0.1); transform: perspective(1000px) rotateX(5deg);',
                    warning: 'background: white; border: none; box-shadow: 0 10px 30px rgba(255, 193, 7, 0.2), 0 1px 8px rgba(255, 193, 7, 0.1); transform: perspective(1000px) rotateX(5deg);',
                    info: 'background: white; border: none; box-shadow: 0 10px 30px rgba(23, 162, 184, 0.2), 0 1px 8px rgba(23, 162, 184, 0.1); transform: perspective(1000px) rotateX(5deg);',
                    light: 'background: white; border: none; box-shadow: 0 10px 30px rgba(248, 249, 250, 0.2), 0 1px 8px rgba(248, 249, 250, 0.1); transform: perspective(1000px) rotateX(5deg);',
                    dark: 'background: #343a40; border: none; box-shadow: 0 10px 30px rgba(52, 58, 64, 0.2), 0 1px 8px rgba(52, 58, 64, 0.1); transform: perspective(1000px) rotateX(5deg); color: white;'
                }
            },
            
            // Variant 5: Floating Card
            floating: {
                name: 'Floating Card',
                description: 'Card with floating animation',
                styles: {
                    primary: 'background: white; border: none; box-shadow: 0 20px 40px rgba(111, 66, 193, 0.15); animation: float 3s ease-in-out infinite;',
                    secondary: 'background: white; border: none; box-shadow: 0 20px 40px rgba(108, 117, 125, 0.15); animation: float 3s ease-in-out infinite;',
                    success: 'background: white; border: none; box-shadow: 0 20px 40px rgba(40, 167, 69, 0.15); animation: float 3s ease-in-out infinite;',
                    danger: 'background: white; border: none; box-shadow: 0 20px 40px rgba(220, 53, 69, 0.15); animation: float 3s ease-in-out infinite;',
                    warning: 'background: white; border: none; box-shadow: 0 20px 40px rgba(255, 193, 7, 0.15); animation: float 3s ease-in-out infinite;',
                    info: 'background: white; border: none; box-shadow: 0 20px 40px rgba(23, 162, 184, 0.15); animation: float 3s ease-in-out infinite;',
                    light: 'background: white; border: none; box-shadow: 0 20px 40px rgba(248, 249, 250, 0.15); animation: float 3s ease-in-out infinite;',
                    dark: 'background: #343a40; border: none; box-shadow: 0 20px 40px rgba(52, 58, 64, 0.15); animation: float 3s ease-in-out infinite; color: white;'
                }
            }
        };
    }

    createCard(variant, color, content, options = {}) {
        const variantData = this.variants[variant];
        if (!variantData) return null;

        const card = document.createElement('div');
        card.className = `ema-card ema-card-${variant} ema-card-${color}`;
        
        // Apply base styles
        card.style.cssText = `
            padding: 24px;
            border-radius: 12px;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
            position: relative;
            overflow: hidden;
            ${variantData.styles[color] || variantData.styles.primary}
        `;

        // Add content
        if (typeof content === 'string') {
            card.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            card.appendChild(content);
        } else {
            card.innerHTML = '<p>Card content</p>';
        }

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'none';
        });

        return card;
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
    module.exports = EmaCardVariants;
} else {
    window.EmaCardVariants = EmaCardVariants;
}
