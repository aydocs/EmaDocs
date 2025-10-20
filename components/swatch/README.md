# Swatch Component

## Description
The Swatch component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display swatch content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<swatch class="ema-swatch ema-swatch--minimal">
    Content here
</swatch>
```

### CSS
```css
.ema-swatch {
    /* Base styles */
}

.ema-swatch--minimal {
    /* Minimal variant */
}

.ema-swatch--neo {
    /* Neo variant */
}

.ema-swatch--soft {
    /* Soft variant */
}

.ema-swatch--glass {
    /* Glass variant */
}

.ema-swatch--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-swatch');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Swatch clicked');
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
