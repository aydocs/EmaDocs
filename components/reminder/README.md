# Reminder Component

## Description
The Reminder component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display reminder content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<reminder class="ema-reminder ema-reminder--minimal">
    Content here
</reminder>
```

### CSS
```css
.ema-reminder {
    /* Base styles */
}

.ema-reminder--minimal {
    /* Minimal variant */
}

.ema-reminder--neo {
    /* Neo variant */
}

.ema-reminder--soft {
    /* Soft variant */
}

.ema-reminder--glass {
    /* Glass variant */
}

.ema-reminder--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-reminder');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('Reminder clicked');
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
