# Vital Component

## Description
The Vital component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display vital content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<vital class="ema-vital ema-vital--minimal">
    Content here
</vital>
```

### CSS
```css
.ema-vital {
    /* Base styles */
}

.ema-vital--minimal {
    /* Minimal variant */
}

.ema-vital--neo {
    /* Neo variant */
}

.ema-vital--soft {
    /* Soft variant */
}

.ema-vital--glass {
    /* Glass variant */
}

.ema-vital--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-vital');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Vital clicked');
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
