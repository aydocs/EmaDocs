# ContextMenu Component

## Description
The ContextMenu component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display contextmenu content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<contextmenu class="ema-contextmenu ema-contextmenu--minimal">
    Content here
</contextmenu>
```

### CSS
```css
.ema-contextmenu {
    /* Base styles */
}

.ema-contextmenu--minimal {
    /* Minimal variant */
}

.ema-contextmenu--neo {
    /* Neo variant */
}

.ema-contextmenu--soft {
    /* Soft variant */
}

.ema-contextmenu--glass {
    /* Glass variant */
}

.ema-contextmenu--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-contextmenu');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('ContextMenu clicked');
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
