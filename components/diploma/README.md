# Diploma Component

## Description
The Diploma component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display diploma content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<diploma class="ema-diploma ema-diploma--minimal">
    Content here
</diploma>
```

### CSS
```css
.ema-diploma {
    /* Base styles */
}

.ema-diploma--minimal {
    /* Minimal variant */
}

.ema-diploma--neo {
    /* Neo variant */
}

.ema-diploma--soft {
    /* Soft variant */
}

.ema-diploma--glass {
    /* Glass variant */
}

.ema-diploma--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-diploma');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Diploma clicked');
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
