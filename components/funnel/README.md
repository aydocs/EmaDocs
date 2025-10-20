# Funnel Component

## Description
The Funnel component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display funnel content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<funnel class="ema-funnel ema-funnel--minimal">
    Content here
</funnel>
```

### CSS
```css
.ema-funnel {
    /* Base styles */
}

.ema-funnel--minimal {
    /* Minimal variant */
}

.ema-funnel--neo {
    /* Neo variant */
}

.ema-funnel--soft {
    /* Soft variant */
}

.ema-funnel--glass {
    /* Glass variant */
}

.ema-funnel--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-funnel');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Funnel clicked');
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
