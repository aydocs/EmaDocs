# Figure Component

## Description
The Figure component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display figure content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<figure class="ema-figure ema-figure--minimal">
    Content here
</figure>
```

### CSS
```css
.ema-figure {
    /* Base styles */
}

.ema-figure--minimal {
    /* Minimal variant */
}

.ema-figure--neo {
    /* Neo variant */
}

.ema-figure--soft {
    /* Soft variant */
}

.ema-figure--glass {
    /* Glass variant */
}

.ema-figure--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-figure');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Figure clicked');
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
