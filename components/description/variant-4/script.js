
// Description Component - glass Variant
document.addEventListener('DOMContentLoaded', () => {
    console.log('Description glass variant loaded');
    
    const component = document.querySelector('.ema-description');
    if (component) {
        // Add click handler
        component.addEventListener('click', (e) => {
            console.log('Description clicked:', e.target);
            addRippleEffect(e.target);
        });
        
        // Add hover effects
        component.addEventListener('mouseenter', () => {
            component.style.transform = 'translateY(-2px)';
        });
        
        component.addEventListener('mouseleave', () => {
            component.style.transform = 'translateY(0)';
        });
    }
});

// Global functions for demo
function toggleVariant() {
    const component = document.querySelector('.ema-description');
    if (component) {
        const variants = ['minimal', 'neo', 'soft', 'glass', 'premium'];
        const currentVariant = variants.find(v => component.classList.contains(`ema-description--${v}`));
        const currentIndex = variants.indexOf(currentVariant);
        const nextIndex = (currentIndex + 1) % variants.length;
        
        // Remove current variant
        component.classList.remove(`ema-description--${currentVariant}`);
        // Add next variant
        component.classList.add(`ema-description--${variants[nextIndex]}`);
        
        console.log('Switched to variant:', variants[nextIndex]);
    }
}

function resetComponent() {
    const component = document.querySelector('.ema-description');
    if (component) {
        // Reset to original variant
        component.classList.remove('ema-description--neo', 'ema-description--soft', 'ema-description--glass', 'ema-description--premium');
        component.classList.add('ema-description--glass');
        
        console.log('Reset to glass variant');
    }
}

function addRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
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