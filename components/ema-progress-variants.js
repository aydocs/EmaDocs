/**
 * Ema Framework - Progress Bar Component Variants
 * 5 different progress bar designs with 8 color variants each
 */

class EmaProgressVariants {
    constructor() {
        this.variants = {
            // Variant 1: Classic Progress
            classic: {
                name: 'Classic Progress',
                description: 'Traditional progress bar with solid fill',
                styles: {
                    primary: 'background: linear-gradient(90deg, #6f42c1, #5a36a0);',
                    secondary: 'background: linear-gradient(90deg, #6c757d, #5a6268);',
                    success: 'background: linear-gradient(90deg, #28a745, #1e7e34);',
                    danger: 'background: linear-gradient(90deg, #dc3545, #c82333);',
                    warning: 'background: linear-gradient(90deg, #ffc107, #e0a800);',
                    info: 'background: linear-gradient(90deg, #17a2b8, #138496);',
                    light: 'background: linear-gradient(90deg, #f8f9fa, #e9ecef);',
                    dark: 'background: linear-gradient(90deg, #343a40, #23272b);'
                }
            },
            
            // Variant 2: Animated Progress
            animated: {
                name: 'Animated Progress',
                description: 'Progress bar with animated fill effect',
                styles: {
                    primary: 'background: linear-gradient(90deg, #6f42c1, #5a36a0, #6f42c1); background-size: 200% 100%; animation: progress-animate 2s linear infinite;',
                    secondary: 'background: linear-gradient(90deg, #6c757d, #5a6268, #6c757d); background-size: 200% 100%; animation: progress-animate 2s linear infinite;',
                    success: 'background: linear-gradient(90deg, #28a745, #1e7e34, #28a745); background-size: 200% 100%; animation: progress-animate 2s linear infinite;',
                    danger: 'background: linear-gradient(90deg, #dc3545, #c82333, #dc3545); background-size: 200% 100%; animation: progress-animate 2s linear infinite;',
                    warning: 'background: linear-gradient(90deg, #ffc107, #e0a800, #ffc107); background-size: 200% 100%; animation: progress-animate 2s linear infinite;',
                    info: 'background: linear-gradient(90deg, #17a2b8, #138496, #17a2b8); background-size: 200% 100%; animation: progress-animate 2s linear infinite;',
                    light: 'background: linear-gradient(90deg, #f8f9fa, #e9ecef, #f8f9fa); background-size: 200% 100%; animation: progress-animate 2s linear infinite;',
                    dark: 'background: linear-gradient(90deg, #343a40, #23272b, #343a40); background-size: 200% 100%; animation: progress-animate 2s linear infinite;'
                }
            },
            
            // Variant 3: Striped Progress
            striped: {
                name: 'Striped Progress',
                description: 'Progress bar with striped pattern',
                styles: {
                    primary: 'background: linear-gradient(45deg, #6f42c1 25%, transparent 25%, transparent 50%, #6f42c1 50%, #6f42c1 75%, transparent 75%, transparent); background-size: 20px 20px; animation: progress-stripes 1s linear infinite;',
                    secondary: 'background: linear-gradient(45deg, #6c757d 25%, transparent 25%, transparent 50%, #6c757d 50%, #6c757d 75%, transparent 75%, transparent); background-size: 20px 20px; animation: progress-stripes 1s linear infinite;',
                    success: 'background: linear-gradient(45deg, #28a745 25%, transparent 25%, transparent 50%, #28a745 50%, #28a745 75%, transparent 75%, transparent); background-size: 20px 20px; animation: progress-stripes 1s linear infinite;',
                    danger: 'background: linear-gradient(45deg, #dc3545 25%, transparent 25%, transparent 50%, #dc3545 50%, #dc3545 75%, transparent 75%, transparent); background-size: 20px 20px; animation: progress-stripes 1s linear infinite;',
                    warning: 'background: linear-gradient(45deg, #ffc107 25%, transparent 25%, transparent 50%, #ffc107 50%, #ffc107 75%, transparent 75%, transparent); background-size: 20px 20px; animation: progress-stripes 1s linear infinite;',
                    info: 'background: linear-gradient(45deg, #17a2b8 25%, transparent 25%, transparent 50%, #17a2b8 50%, #17a2b8 75%, transparent 75%, transparent); background-size: 20px 20px; animation: progress-stripes 1s linear infinite;',
                    light: 'background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%, transparent 50%, #f8f9fa 50%, #f8f9fa 75%, transparent 75%, transparent); background-size: 20px 20px; animation: progress-stripes 1s linear infinite;',
                    dark: 'background: linear-gradient(45deg, #343a40 25%, transparent 25%, transparent 50%, #343a40 50%, #343a40 75%, transparent 75%, transparent); background-size: 20px 20px; animation: progress-stripes 1s linear infinite;'
                }
            },
            
            // Variant 4: Glow Progress
            glow: {
                name: 'Glow Progress',
                description: 'Progress bar with glowing effect',
                styles: {
                    primary: 'background: linear-gradient(90deg, #6f42c1, #5a36a0); box-shadow: 0 0 20px rgba(111, 66, 193, 0.6);',
                    secondary: 'background: linear-gradient(90deg, #6c757d, #5a6268); box-shadow: 0 0 20px rgba(108, 117, 125, 0.6);',
                    success: 'background: linear-gradient(90deg, #28a745, #1e7e34); box-shadow: 0 0 20px rgba(40, 167, 69, 0.6);',
                    danger: 'background: linear-gradient(90deg, #dc3545, #c82333); box-shadow: 0 0 20px rgba(220, 53, 69, 0.6);',
                    warning: 'background: linear-gradient(90deg, #ffc107, #e0a800); box-shadow: 0 0 20px rgba(255, 193, 7, 0.6);',
                    info: 'background: linear-gradient(90deg, #17a2b8, #138496); box-shadow: 0 0 20px rgba(23, 162, 184, 0.6);',
                    light: 'background: linear-gradient(90deg, #f8f9fa, #e9ecef); box-shadow: 0 0 20px rgba(248, 249, 250, 0.6);',
                    dark: 'background: linear-gradient(90deg, #343a40, #23272b); box-shadow: 0 0 20px rgba(52, 58, 64, 0.6);'
                }
            },
            
            // Variant 5: Circular Progress
            circular: {
                name: 'Circular Progress',
                description: 'Circular progress indicator',
                styles: {
                    primary: 'background: conic-gradient(#6f42c1 0deg, #6f42c1 var(--progress-angle, 0deg), #e9ecef var(--progress-angle, 0deg));',
                    secondary: 'background: conic-gradient(#6c757d 0deg, #6c757d var(--progress-angle, 0deg), #e9ecef var(--progress-angle, 0deg));',
                    success: 'background: conic-gradient(#28a745 0deg, #28a745 var(--progress-angle, 0deg), #e9ecef var(--progress-angle, 0deg));',
                    danger: 'background: conic-gradient(#dc3545 0deg, #dc3545 var(--progress-angle, 0deg), #e9ecef var(--progress-angle, 0deg));',
                    warning: 'background: conic-gradient(#ffc107 0deg, #ffc107 var(--progress-angle, 0deg), #e9ecef var(--progress-angle, 0deg));',
                    info: 'background: conic-gradient(#17a2b8 0deg, #17a2b8 var(--progress-angle, 0deg), #e9ecef var(--progress-angle, 0deg));',
                    light: 'background: conic-gradient(#f8f9fa 0deg, #f8f9fa var(--progress-angle, 0deg), #e9ecef var(--progress-angle, 0deg));',
                    dark: 'background: conic-gradient(#343a40 0deg, #343a40 var(--progress-angle, 0deg), #e9ecef var(--progress-angle, 0deg));'
                }
            }
        };
    }

    createProgress(variant, color, value = 0, options = {}) {
        const variantData = this.variants[variant];
        if (!variantData) return null;

        const container = document.createElement('div');
        container.className = `ema-progress ema-progress-${variant} ema-progress-${color}`;
        container.style.cssText = `
            width: 100%;
            height: ${options.height || '8px'};
            background: #e9ecef;
            border-radius: ${options.height ? parseInt(options.height) / 2 + 'px' : '4px'};
            overflow: hidden;
            position: relative;
            margin: 10px 0;
        `;

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            height: 100%;
            width: ${value}%;
            transition: width 0.6s ease;
            border-radius: inherit;
            position: relative;
            ${variantData.styles[color] || variantData.styles.primary}
        `;

        // Add percentage text if requested
        if (options.showPercentage) {
            const percentageText = document.createElement('span');
            percentageText.className = 'progress-percentage';
            percentageText.textContent = `${value}%`;
            percentageText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 12px;
                font-weight: 600;
                color: white;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                z-index: 1;
            `;
            progressBar.appendChild(percentageText);
        }

        container.appendChild(progressBar);

        // Add method to update progress
        container.updateProgress = (newValue) => {
            progressBar.style.width = `${newValue}%`;
            if (options.showPercentage) {
                const percentageText = progressBar.querySelector('.progress-percentage');
                if (percentageText) {
                    percentageText.textContent = `${newValue}%`;
                }
            }
        };

        return container;
    }

    createCircularProgress(variant, color, value = 0, options = {}) {
        const size = options.size || 120;
        const strokeWidth = options.strokeWidth || 8;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const progress = value / 100;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (progress * circumference);

        const container = document.createElement('div');
        container.className = `ema-circular-progress ema-progress-${variant} ema-progress-${color}`;
        container.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            position: relative;
            margin: 20px auto;
        `;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.style.cssText = 'transform: rotate(-90deg);';

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', size / 2);
        circle.setAttribute('cy', size / 2);
        circle.setAttribute('r', radius);
        circle.setAttribute('stroke', '#e9ecef');
        circle.setAttribute('stroke-width', strokeWidth);
        circle.setAttribute('fill', 'none');

        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', size / 2);
        progressCircle.setAttribute('cy', size / 2);
        progressCircle.setAttribute('r', radius);
        progressCircle.setAttribute('stroke', this.getColorValue(color));
        progressCircle.setAttribute('stroke-width', strokeWidth);
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke-linecap', 'round');
        progressCircle.setAttribute('stroke-dasharray', strokeDasharray);
        progressCircle.setAttribute('stroke-dashoffset', strokeDashoffset);
        progressCircle.style.cssText = 'transition: stroke-dashoffset 0.6s ease;';

        svg.appendChild(circle);
        svg.appendChild(progressCircle);
        container.appendChild(svg);

        // Add percentage text
        const percentageText = document.createElement('div');
        percentageText.className = 'circular-progress-text';
        percentageText.textContent = `${value}%`;
        percentageText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            font-weight: 600;
            color: #333;
            font-family: 'Inter', sans-serif;
        `;
        container.appendChild(percentageText);

        // Add method to update progress
        container.updateProgress = (newValue) => {
            const newProgress = newValue / 100;
            const newStrokeDashoffset = circumference - (newProgress * circumference);
            progressCircle.setAttribute('stroke-dashoffset', newStrokeDashoffset);
            percentageText.textContent = `${newValue}%`;
        };

        return container;
    }

    getColorValue(color) {
        const colors = {
            primary: '#6f42c1',
            secondary: '#6c757d',
            success: '#28a745',
            danger: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8',
            light: '#f8f9fa',
            dark: '#343a40'
        };
        return colors[color] || colors.primary;
    }

    getAllVariants() {
        return this.variants;
    }

    getVariant(variant) {
        return this.variants[variant];
    }
}

// Add progress animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes progress-animate {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
    
    @keyframes progress-stripes {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 20px 0;
        }
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmaProgressVariants;
} else {
    window.EmaProgressVariants = EmaProgressVariants;
}
