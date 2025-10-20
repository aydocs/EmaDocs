# Sunrise Component

## Description
The Sunrise component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display sunrise content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<sunrise class="ema-sunrise ema-sunrise--minimal">
    Content here
</sunrise>
```

### CSS
```css
.ema-sunrise {
    /* Base styles */
}

.ema-sunrise--minimal {
    /* Minimal variant */
}

.ema-sunrise--neo {
    /* Neo variant */
}

.ema-sunrise--soft {
    /* Soft variant */
}

.ema-sunrise--glass {
    /* Glass variant */
}

.ema-sunrise--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-sunrise');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Sunrise clicked');
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
