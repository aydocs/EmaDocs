# Pattern Component

## Description
The Pattern component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display pattern content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<pattern class="ema-pattern ema-pattern--minimal">
    Content here
</pattern>
```

### CSS
```css
.ema-pattern {
    /* Base styles */
}

.ema-pattern--minimal {
    /* Minimal variant */
}

.ema-pattern--neo {
    /* Neo variant */
}

.ema-pattern--soft {
    /* Soft variant */
}

.ema-pattern--glass {
    /* Glass variant */
}

.ema-pattern--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-pattern');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Pattern clicked');
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
