# View Component

## Description
The View component is part of the Emadocs Framework's comprehensive UI library. It provides a flexible and customizable way to display view content with multiple design variants.

## Variants
- **Minimal**: Clean, simple design with subtle styling
- **Neo**: Modern, futuristic design with bold colors
- **Soft**: Gentle, friendly design with rounded corners
- **Glass**: Translucent design with backdrop blur effects
- **Premium**: Luxury design with gradients and premium styling

## Usage

### HTML
```html
<view class="ema-view ema-view--minimal">
    Content here
</view>
```

### CSS
```css
.ema-view {
    /* Base styles */
}

.ema-view--minimal {
    /* Minimal variant */
}

.ema-view--neo {
    /* Neo variant */
}

.ema-view--soft {
    /* Soft variant */
}

.ema-view--glass {
    /* Glass variant */
}

.ema-view--premium {
    /* Premium variant */
}
```

### JavaScript
```javascript
// Initialize component
document.addEventListener('DOMContentLoaded', () => {
    const component = document.querySelector('.ema-view');
    if (component) {
        component.addEventListener('click', (e) => {
            console.log('View clicked');
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
