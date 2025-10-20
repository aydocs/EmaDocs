# Ranking Component - Premium Variant

## Description
This is the **premium** variant of the Ranking component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<ranking class="ema-ranking ema-ranking--premium">
    Content here
</ranking>
```

### CSS
```css
.ema-ranking--premium {
    /* premium variant styles */
    
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: white;
        border: none;
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-lg) var(--spacing-xl);
        box-shadow: var(--shadow-xl);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    
}
```

### JavaScript
```javascript
// Initialize premium variant
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-ranking--premium');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Ranking premium variant clicked');
        });
    }
});
```

## Features
- premium design variant
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
