# Temperature Component - Neo Variant

## Description
This is the **neo** variant of the Temperature component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<temperature class="ema-temperature ema-temperature--neo">
    Content here
</temperature>
```

### CSS
```css
.ema-temperature--neo {
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
    const component = document.querySelector('.ema-temperature--neo');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Temperature neo variant clicked');
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
