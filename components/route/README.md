# Route Component

## Description
The Route component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display route content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<route class="ema-route ema-route--minimal">
    Content here
</route>
```

### CSS
```css
.ema-route {
    /* Base styles */
}

.ema-route--minimal {
    /* Minimal variant */
}

.ema-route--neo {
    /* Neo variant */
}

.ema-route--soft {
    /* Soft variant */
}

.ema-route--glass {
    /* Glass variant */
}

.ema-route--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-route');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Route clicked');
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
