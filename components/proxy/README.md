# Proxy Component

## Description
The Proxy component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display proxy content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<proxy class="ema-proxy ema-proxy--minimal">
    Content here
</proxy>
```

### CSS
```css
.ema-proxy {
    /* Base styles */
}

.ema-proxy--minimal {
    /* Minimal variant */
}

.ema-proxy--neo {
    /* Neo variant */
}

.ema-proxy--soft {
    /* Soft variant */
}

.ema-proxy--glass {
    /* Glass variant */
}

.ema-proxy--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-proxy');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Proxy clicked');
        });
    }
});
```

## Props
- `variant`: Component variant (minimal, neo, soft, glass, premium)
- `disabled`: Disable the component
- `loading`: Show loading state

## Events
- `click`: Fired when component is clicked
- `hover`: Fired when component is hovered
- `focus`: Fired when component receives focus

## Accessibility
- Keyboard navigation support
- Screen reader compatible
- ARIA attributes included
- Focus management

## Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License
MIT License - Part of Emadocs Framework
