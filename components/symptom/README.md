# Symptom Component

## Description
The Symptom component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display symptom content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<symptom class="ema-symptom ema-symptom--minimal">
    Content here
</symptom>
```

### CSS
```css
.ema-symptom {
    /* Base styles */
}

.ema-symptom--minimal {
    /* Minimal variant */
}

.ema-symptom--neo {
    /* Neo variant */
}

.ema-symptom--soft {
    /* Soft variant */
}

.ema-symptom--glass {
    /* Glass variant */
}

.ema-symptom--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-symptom');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Symptom clicked');
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
