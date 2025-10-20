# Fund Component

## Description
The Fund component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display fund content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<fund class="ema-fund ema-fund--minimal">
    Content here
</fund>
```

### CSS
```css
.ema-fund {
    /* Base styles */
}

.ema-fund--minimal {
    /* Minimal variant */
}

.ema-fund--neo {
    /* Neo variant */
}

.ema-fund--soft {
    /* Soft variant */
}

.ema-fund--glass {
    /* Glass variant */
}

.ema-fund--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-fund');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Fund clicked');
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
