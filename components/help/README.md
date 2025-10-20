# Help Component

## Description
The Help component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display help content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<help class="ema-help ema-help--minimal">
    Content here
</help>
```

### CSS
```css
.ema-help {
    /* Base styles */
}

.ema-help--minimal {
    /* Minimal variant */
}

.ema-help--neo {
    /* Neo variant */
}

.ema-help--soft {
    /* Soft variant */
}

.ema-help--glass {
    /* Glass variant */
}

.ema-help--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-help');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Help clicked');
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
