/**
 * Ema Framework - Avatar Component Variants
 * 5 different avatar designs with 8 color variants each
 */

class EmaAvatarVariants {
    constructor() {
        this.variants = {
            // Variant 1: Classic Avatar
            classic: {
                name: 'Classic Avatar',
                description: 'Traditional circular avatar',
                styles: {
                    primary: 'background: linear-gradient(135deg, #6f42c1, #5a36a0); color: white;',
                    secondary: 'background: linear-gradient(135deg, #6c757d, #5a6268); color: white;',
                    success: 'background: linear-gradient(135deg, #28a745, #1e7e34); color: white;',
                    danger: 'background: linear-gradient(135deg, #dc3545, #c82333); color: white;',
                    warning: 'background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529;',
                    info: 'background: linear-gradient(135deg, #17a2b8, #138496); color: white;',
                    light: 'background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #212529;',
                    dark: 'background: linear-gradient(135deg, #343a40, #23272b); color: white;'
                }
            },
            
            // Variant 2: Square Avatar
            square: {
                name: 'Square Avatar',
                description: 'Square avatar with rounded corners',
                styles: {
                    primary: 'background: linear-gradient(135deg, #6f42c1, #5a36a0); color: white; border-radius: 8px;',
                    secondary: 'background: linear-gradient(135deg, #6c757d, #5a6268); color: white; border-radius: 8px;',
                    success: 'background: linear-gradient(135deg, #28a745, #1e7e34); color: white; border-radius: 8px;',
                    danger: 'background: linear-gradient(135deg, #dc3545, #c82333); color: white; border-radius: 8px;',
                    warning: 'background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; border-radius: 8px;',
                    info: 'background: linear-gradient(135deg, #17a2b8, #138496); color: white; border-radius: 8px;',
                    light: 'background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #212529; border-radius: 8px;',
                    dark: 'background: linear-gradient(135deg, #343a40, #23272b); color: white; border-radius: 8px;'
                }
            },
            
            // Variant 3: Ring Avatar
            ring: {
                name: 'Ring Avatar',
                description: 'Avatar with colored ring border',
                styles: {
                    primary: 'background: white; color: #6f42c1; border: 3px solid #6f42c1;',
                    secondary: 'background: white; color: #6c757d; border: 3px solid #6c757d;',
                    success: 'background: white; color: #28a745; border: 3px solid #28a745;',
                    danger: 'background: white; color: #dc3545; border: 3px solid #dc3545;',
                    warning: 'background: white; color: #ffc107; border: 3px solid #ffc107;',
                    info: 'background: white; color: #17a2b8; border: 3px solid #17a2b8;',
                    light: 'background: white; color: #f8f9fa; border: 3px solid #f8f9fa;',
                    dark: 'background: white; color: #343a40; border: 3px solid #343a40;'
                }
            },
            
            // Variant 4: Glow Avatar
            glow: {
                name: 'Glow Avatar',
                description: 'Avatar with glowing effect',
                styles: {
                    primary: 'background: linear-gradient(135deg, #6f42c1, #5a36a0); color: white; box-shadow: 0 0 20px rgba(111, 66, 193, 0.6);',
                    secondary: 'background: linear-gradient(135deg, #6c757d, #5a6268); color: white; box-shadow: 0 0 20px rgba(108, 117, 125, 0.6);',
                    success: 'background: linear-gradient(135deg, #28a745, #1e7e34); color: white; box-shadow: 0 0 20px rgba(40, 167, 69, 0.6);',
                    danger: 'background: linear-gradient(135deg, #dc3545, #c82333); color: white; box-shadow: 0 0 20px rgba(220, 53, 69, 0.6);',
                    warning: 'background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; box-shadow: 0 0 20px rgba(255, 193, 7, 0.6);',
                    info: 'background: linear-gradient(135deg, #17a2b8, #138496); color: white; box-shadow: 0 0 20px rgba(23, 162, 184, 0.6);',
                    light: 'background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #212529; box-shadow: 0 0 20px rgba(248, 249, 250, 0.6);',
                    dark: 'background: linear-gradient(135deg, #343a40, #23272b); color: white; box-shadow: 0 0 20px rgba(52, 58, 64, 0.6);'
                }
            },
            
            // Variant 5: Floating Avatar
            floating: {
                name: 'Floating Avatar',
                description: 'Avatar with floating animation',
                styles: {
                    primary: 'background: linear-gradient(135deg, #6f42c1, #5a36a0); color: white; animation: avatar-float 3s ease-in-out infinite;',
                    secondary: 'background: linear-gradient(135deg, #6c757d, #5a6268); color: white; animation: avatar-float 3s ease-in-out infinite;',
                    success: 'background: linear-gradient(135deg, #28a745, #1e7e34); color: white; animation: avatar-float 3s ease-in-out infinite;',
                    danger: 'background: linear-gradient(135deg, #dc3545, #c82333); color: white; animation: avatar-float 3s ease-in-out infinite;',
                    warning: 'background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; animation: avatar-float 3s ease-in-out infinite;',
                    info: 'background: linear-gradient(135deg, #17a2b8, #138496); color: white; animation: avatar-float 3s ease-in-out infinite;',
                    light: 'background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #212529; animation: avatar-float 3s ease-in-out infinite;',
                    dark: 'background: linear-gradient(135deg, #343a40, #23272b); color: white; animation: avatar-float 3s ease-in-out infinite;'
                }
            }
        };
    }

    createAvatar(variant, color, text, options = {}) {
        const variantData = this.variants[variant];
        if (!variantData) return null;

        const avatar = document.createElement('div');
        avatar.className = `ema-avatar ema-avatar-${variant} ema-avatar-${color}`;
        
        const size = options.size || '40px';
        const fontSize = options.fontSize || '16px';
        
        avatar.style.cssText = `
            width: ${size};
            height: ${size};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${fontSize};
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            text-transform: uppercase;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            ${variantData.styles[color] || variantData.styles.primary}
        `;

        // Add text or image
        if (options.image) {
            const img = document.createElement('img');
            img.src = options.image;
            img.alt = text || 'Avatar';
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: inherit;
            `;
            avatar.appendChild(img);
        } else {
            avatar.textContent = text ? text.charAt(0) : '?';
        }

        // Add hover effects
        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.1)';
        });

        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = 'scale(1)';
        });

        return avatar;
    }

    createAvatarGroup(avatars, options = {}) {
        const group = document.createElement('div');
        group.className = 'ema-avatar-group';
        group.style.cssText = `
            display: flex;
            align-items: center;
            gap: ${options.gap || '-10px'};
        `;

        avatars.forEach((avatar, index) => {
            if (avatar instanceof HTMLElement) {
                avatar.style.zIndex = avatars.length - index;
                group.appendChild(avatar);
            }
        });

        return group;
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
    @keyframes avatar-float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmaAvatarVariants;
} else {
    window.EmaAvatarVariants = EmaAvatarVariants;
}
