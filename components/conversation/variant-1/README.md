# Conversation Component - Minimal Variant

## Description
This is the **minimal** variant of the Conversation component, designed to integrate seamlessly with the Emadocs Framework's design system.

## Usage

### HTML
```html
<conversation class="ema-conversation ema-conversation--minimal">
    Content here
</conversation>
```

### CSS
```css
.ema-conversation--minimal {
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
    const component = document.querySelector('.ema-conversation--minimal');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Conversation minimal variant clicked');
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
