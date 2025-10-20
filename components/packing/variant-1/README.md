# Packing Component - Minimal Variant

## Description
This is the **minimal** variant of the Packing component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<packing class="ema-packing ema-packing--minimal">
    Content here
</packing>
```

### CSS
```css
.ema-packing--minimal {
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
    const component = document.querySelector('.ema-packing--minimal');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Packing minimal variant clicked');
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
