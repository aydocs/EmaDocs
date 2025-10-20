# Visa Component

## Description
The Visa component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display visa content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<visa class="ema-visa ema-visa--minimal">
    Content here
</visa>
```

### CSS
```css
.ema-visa {
    /* Base styles */
}

.ema-visa--minimal {
    /* Minimal variant */
}

.ema-visa--neo {
    /* Neo variant */
}

.ema-visa--soft {
    /* Soft variant */
}

.ema-visa--glass {
    /* Glass variant */
}

.ema-visa--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-visa');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Visa clicked');
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
