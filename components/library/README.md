# Library Component

## Description
The Library component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display library content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<library class="ema-library ema-library--minimal">
    Content here
</library>
```

### CSS
```css
.ema-library {
    /* Base styles */
}

.ema-library--minimal {
    /* Minimal variant */
}

.ema-library--neo {
    /* Neo variant */
}

.ema-library--soft {
    /* Soft variant */
}

.ema-library--glass {
    /* Glass variant */
}

.ema-library--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-library');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Library clicked');
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
