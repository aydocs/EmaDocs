# Homework Component

## Description
The Homework component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display homework content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<homework class="ema-homework ema-homework--minimal">
    Content here
</homework>
```

### CSS
```css
.ema-homework {
    /* Base styles */
}

.ema-homework--minimal {
    /* Minimal variant */
}

.ema-homework--neo {
    /* Neo variant */
}

.ema-homework--soft {
    /* Soft variant */
}

.ema-homework--glass {
    /* Glass variant */
}

.ema-homework--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-homework');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Homework clicked');
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
