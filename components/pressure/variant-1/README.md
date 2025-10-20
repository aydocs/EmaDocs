# Pressure Component - Minimal Variant

## Description
This is the **minimal** variant of the Pressure component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<pressure class="ema-pressure ema-pressure--minimal">
    Content here
</pressure>
```

### CSS
```css
.ema-pressure--minimal {
    /* minimal variant styles */
    
        background: var(--background-color-primary);
        color: var(--text-color-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-sm) var(--spacing-md);
        box-shadow: var(--shadow-sm);
    
}
```

### JavaScript
```javascript
// Initialize minimal variant
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-pressure--minimal');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Pressure minimal variant clicked');
        });
    }
});
```

## Features
- minimal design variant
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
