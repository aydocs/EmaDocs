# Object Component

## Description
The Object component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display object content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<object class="ema-object ema-object--minimal">
    Content here
</object>
```

### CSS
```css
.ema-object {
    /* Base styles */
}

.ema-object--minimal {
    /* Minimal variant */
}

.ema-object--neo {
    /* Neo variant */
}

.ema-object--soft {
    /* Soft variant */
}

.ema-object--glass {
    /* Glass variant */
}

.ema-object--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-object');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Object clicked');
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
