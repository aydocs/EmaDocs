# Gateway Component

## Description
The Gateway component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display gateway content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<gateway class="ema-gateway ema-gateway--minimal">
    Content here
</gateway>
```

### CSS
```css
.ema-gateway {
    /* Base styles */
}

.ema-gateway--minimal {
    /* Minimal variant */
}

.ema-gateway--neo {
    /* Neo variant */
}

.ema-gateway--soft {
    /* Soft variant */
}

.ema-gateway--glass {
    /* Glass variant */
}

.ema-gateway--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-gateway');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Gateway clicked');
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
