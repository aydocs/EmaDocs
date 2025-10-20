# Appointment Component

## Description
The Appointment component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display appointment content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<appointment class="ema-appointment ema-appointment--minimal">
    Content here
</appointment>
```

### CSS
```css
.ema-appointment {
    /* Base styles */
}

.ema-appointment--minimal {
    /* Minimal variant */
}

.ema-appointment--neo {
    /* Neo variant */
}

.ema-appointment--soft {
    /* Soft variant */
}

.ema-appointment--glass {
    /* Glass variant */
}

.ema-appointment--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-appointment');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Appointment clicked');
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
