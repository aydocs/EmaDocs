# Routine Component - Soft Variant

## Description
This is the **soft** variant of the Routine component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<routine class="ema-routine ema-routine--soft">
    Content here
</routine>
```

### CSS
```css
.ema-routine--soft {
    /* soft variant styles */
    
        background: var(--primary-light);
        color: var(--primary-dark);
        border: 1px solid var(--primary);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-md) var(--spacing-lg);
        box-shadow: var(--shadow-sm);
        font-weight: 500;
    
}
```

### JavaScript
```javascript
// Initialize soft variant
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-routine--soft');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Routine soft variant clicked');
        });
    }
});
```

## Features
- soft design variant
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
