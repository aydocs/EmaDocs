# Server Component

## Description
The Server component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display server content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<server class="ema-server ema-server--minimal">
    Content here
</server>
```

### CSS
```css
.ema-server {
    /* Base styles */
}

.ema-server--minimal {
    /* Minimal variant */
}

.ema-server--neo {
    /* Neo variant */
}

.ema-server--soft {
    /* Soft variant */
}

.ema-server--glass {
    /* Glass variant */
}

.ema-server--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-server');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Server clicked');
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
