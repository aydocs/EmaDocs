# Poster Component - Soft Variant

## Description
This is the **soft** variant of the Poster component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<poster class="ema-poster ema-poster--soft">
    Content here
</poster>
```

### CSS
```css
.ema-poster--soft {
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
    const component = document.querySelector('.ema-poster--soft');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Poster soft variant clicked');
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
