# Calorie Component

## Description
The Calorie component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display calorie content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<calorie class="ema-calorie ema-calorie--minimal">
    Content here
</calorie>
```

### CSS
```css
.ema-calorie {
    /* Base styles */
}

.ema-calorie--minimal {
    /* Minimal variant */
}

.ema-calorie--neo {
    /* Neo variant */
}

.ema-calorie--soft {
    /* Soft variant */
}

.ema-calorie--glass {
    /* Glass variant */
}

.ema-calorie--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-calorie');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Calorie clicked');
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
