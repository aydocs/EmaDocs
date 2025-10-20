# Profile Component

## Description
The Profile component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display profile content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<profile class="ema-profile ema-profile--minimal">
    Content here
</profile>
```

### CSS
```css
.ema-profile {
    /* Base styles */
}

.ema-profile--minimal {
    /* Minimal variant */
}

.ema-profile--neo {
    /* Neo variant */
}

.ema-profile--soft {
    /* Soft variant */
}

.ema-profile--glass {
    /* Glass variant */
}

.ema-profile--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-profile');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Profile clicked');
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
