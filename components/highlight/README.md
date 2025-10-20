# Highlight Component

## Description
The Highlight component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display highlight content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<highlight class="ema-highlight ema-highlight--minimal">
    Content here
</highlight>
```

### CSS
```css
.ema-highlight {
    /* Base styles */
}

.ema-highlight--minimal {
    /* Minimal variant */
}

.ema-highlight--neo {
    /* Neo variant */
}

.ema-highlight--soft {
    /* Soft variant */
}

.ema-highlight--glass {
    /* Glass variant */
}

.ema-highlight--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-highlight');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Highlight clicked');
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
