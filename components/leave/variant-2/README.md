# Leave Component - Neo Variant

## Description
This is the **neo** variant of the Leave component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<leave class="ema-leave ema-leave--neo">
    Content here
</leave>
```

### CSS
```css
.ema-leave--neo {
    /* neo variant styles */
    
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        border: none;
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-md) var(--spacing-lg);
        box-shadow: var(--shadow-md);
        font-weight: 600;
    
}
```

### JavaScript
```javascript
// Initialize neo variant
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-leave--neo');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Leave neo variant clicked');
        });
    }
});
```

## Features
- neo design variant
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
