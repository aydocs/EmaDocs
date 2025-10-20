# Clan Component

## Description
The Clan component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display clan content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<clan class="ema-clan ema-clan--minimal">
    Content here
</clan>
```

### CSS
```css
.ema-clan {
    /* Base styles */
}

.ema-clan--minimal {
    /* Minimal variant */
}

.ema-clan--neo {
    /* Neo variant */
}

.ema-clan--soft {
    /* Soft variant */
}

.ema-clan--glass {
    /* Glass variant */
}

.ema-clan--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-clan');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Clan clicked');
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
