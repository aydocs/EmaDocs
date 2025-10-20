# Trend Component

## Description
The Trend component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display trend content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<trend class="ema-trend ema-trend--minimal">
    Content here
</trend>
```

### CSS
```css
.ema-trend {
    /* Base styles */
}

.ema-trend--minimal {
    /* Minimal variant */
}

.ema-trend--neo {
    /* Neo variant */
}

.ema-trend--soft {
    /* Soft variant */
}

.ema-trend--glass {
    /* Glass variant */
}

.ema-trend--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-trend');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Trend clicked');
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
