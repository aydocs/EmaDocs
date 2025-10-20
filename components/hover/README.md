# Hover Component

## Description
The Hover component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display hover content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<hover class="ema-hover ema-hover--minimal">
    Content here
</hover>
```

### CSS
```css
.ema-hover {
    /* Base styles */
}

.ema-hover--minimal {
    /* Minimal variant */
}

.ema-hover--neo {
    /* Neo variant */
}

.ema-hover--soft {
    /* Soft variant */
}

.ema-hover--glass {
    /* Glass variant */
}

.ema-hover--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-hover');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Hover clicked');
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
