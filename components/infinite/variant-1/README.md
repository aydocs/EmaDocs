# Infinite Component - Minimal Variant

## Description
This is the **minimal** variant of the Infinite component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<infinite class="ema-infinite ema-infinite--minimal">
    Content here
</infinite>
```

### CSS
```css
.ema-infinite--minimal {
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
    const component = document.querySelector('.ema-infinite--minimal');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Infinite minimal variant clicked');
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
