# Auth Component

## Description
The Auth component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display auth content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<auth class="ema-auth ema-auth--minimal">
    Content here
</auth>
```

### CSS
```css
.ema-auth {
    /* Base styles */
}

.ema-auth--minimal {
    /* Minimal variant */
}

.ema-auth--neo {
    /* Neo variant */
}

.ema-auth--soft {
    /* Soft variant */
}

.ema-auth--glass {
    /* Glass variant */
}

.ema-auth--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-auth');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Auth clicked');
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
