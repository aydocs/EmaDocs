# Hail Component

## Description
The Hail component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display hail content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<hail class="ema-hail ema-hail--minimal">
    Content here
</hail>
```

### CSS
```css
.ema-hail {
    /* Base styles */
}

.ema-hail--minimal {
    /* Minimal variant */
}

.ema-hail--neo {
    /* Neo variant */
}

.ema-hail--soft {
    /* Soft variant */
}

.ema-hail--glass {
    /* Glass variant */
}

.ema-hail--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-hail');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Hail clicked');
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
