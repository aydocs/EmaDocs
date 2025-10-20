# Package Component

## Description
The Package component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display package content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<package class="ema-package ema-package--minimal">
    Content here
</package>
```

### CSS
```css
.ema-package {
    /* Base styles */
}

.ema-package--minimal {
    /* Minimal variant */
}

.ema-package--neo {
    /* Neo variant */
}

.ema-package--soft {
    /* Soft variant */
}

.ema-package--glass {
    /* Glass variant */
}

.ema-package--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-package');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Package clicked');
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
