# Assignment Component

## Description
The Assignment component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display assignment content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<assignment class="ema-assignment ema-assignment--minimal">
    Content here
</assignment>
```

### CSS
```css
.ema-assignment {
    /* Base styles */
}

.ema-assignment--minimal {
    /* Minimal variant */
}

.ema-assignment--neo {
    /* Neo variant */
}

.ema-assignment--soft {
    /* Soft variant */
}

.ema-assignment--glass {
    /* Glass variant */
}

.ema-assignment--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-assignment');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Assignment clicked');
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
