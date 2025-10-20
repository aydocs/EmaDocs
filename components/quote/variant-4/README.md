# Quote Component - Glass Variant

## Description
This is the **glass** variant of the Quote component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<quote class="ema-quote ema-quote--glass">
    Content here
</quote>
```

### CSS
```css
.ema-quote--glass {
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
    const component = document.querySelector('.ema-quote--glass');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Quote glass variant clicked');
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
