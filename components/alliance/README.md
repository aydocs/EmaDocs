# Alliance Component

## Description
The Alliance component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display alliance content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<alliance class="ema-alliance ema-alliance--minimal">
    Content here
</alliance>
```

### CSS
```css
.ema-alliance {
    /* Base styles */
}

.ema-alliance--minimal {
    /* Minimal variant */
}

.ema-alliance--neo {
    /* Neo variant */
}

.ema-alliance--soft {
    /* Soft variant */
}

.ema-alliance--glass {
    /* Glass variant */
}

.ema-alliance--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-alliance');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Alliance clicked');
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
