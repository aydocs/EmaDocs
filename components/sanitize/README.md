# Sanitize Component

## Description
The Sanitize component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display sanitize content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<sanitize class="ema-sanitize ema-sanitize--minimal">
    Content here
</sanitize>
```

### CSS
```css
.ema-sanitize {
    /* Base styles */
}

.ema-sanitize--minimal {
    /* Minimal variant */
}

.ema-sanitize--neo {
    /* Neo variant */
}

.ema-sanitize--soft {
    /* Soft variant */
}

.ema-sanitize--glass {
    /* Glass variant */
}

.ema-sanitize--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-sanitize');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Sanitize clicked');
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
