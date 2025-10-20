# Gradient Component - Glass Variant

## Description
This is the **glass** variant of the Gradient component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<gradient class="ema-gradient ema-gradient--glass">
    Content here
</gradient>
```

### CSS
```css
.ema-gradient--glass {
    /* glass variant styles */
    
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color-primary);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-md) var(--spacing-lg);
        backdrop-filter: blur(10px);
        box-shadow: var(--shadow-lg);
    
}
```

### JavaScript
```javascript
// Initialize glass variant
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-gradient--glass');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Gradient glass variant clicked');
        });
    }
});
```

## Features
- glass design variant
- Responsive design
- Accessibility support
- Interactive animations
- Theme integration

## Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License
MIT License - Part of Emadocs Framework
