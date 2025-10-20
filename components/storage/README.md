# Storage Component

## Description
The Storage component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display storage content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<storage class="ema-storage ema-storage--minimal">
    Content here
</storage>
```

### CSS
```css
.ema-storage {
    /* Base styles */
}

.ema-storage--minimal {
    /* Minimal variant */
}

.ema-storage--neo {
    /* Neo variant */
}

.ema-storage--soft {
    /* Soft variant */
}

.ema-storage--glass {
    /* Glass variant */
}

.ema-storage--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-storage');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Storage clicked');
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
