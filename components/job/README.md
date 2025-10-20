# Job Component

## Description
The Job component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display job content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<job class="ema-job ema-job--minimal">
    Content here
</job>
```

### CSS
```css
.ema-job {
    /* Base styles */
}

.ema-job--minimal {
    /* Minimal variant */
}

.ema-job--neo {
    /* Neo variant */
}

.ema-job--soft {
    /* Soft variant */
}

.ema-job--glass {
    /* Glass variant */
}

.ema-job--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-job');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Job clicked');
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
