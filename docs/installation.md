# Installation Guide

## Quick Start

### CDN Installation

The fastest way to get started with emadocs:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My emadocs App</title>
  
  <!-- emadocs CSS -->
  <link rel="stylesheet" href="https://cdn.emadocs.dev/css/emadocs.min.css">
</head>
<body>
  <div id="app"></div>

  <!-- emadocs JS -->
  <script src="https://cdn.emadocs.dev/js/emadocs.min.js"></script>
  
  <script>
    // Your app code
    Emadocs.init();
  </script>
</body>
</html>
\`\`\`

### NPM Installation

\`\`\`bash
npm install emadocs
\`\`\`

\`\`\`javascript
import Emadocs from 'emadocs';
import 'emadocs/css/emadocs.css';

Emadocs.init();
\`\`\`

### Download

Download the latest release from [GitHub](https://github.com/emadocs/emadocs/releases).

## File Structure

\`\`\`
emadocs/
├── css/
│   └── emadocs.css
├── js/
│   ├── core.js
│   ├── router.js
│   ├── store.js
│   ├── ui.js
│   ├── animations.js
│   ├── theme.js
│   ├── 3d-engine.js
│   └── emadocs.js
├── components/
│   ├── ema-button.js
│   ├── ema-card.js
│   └── ... (260+ components)
└── modules/
    └── ... (110+ modules)
\`\`\`

## Configuration

### Basic Configuration

\`\`\`javascript
Emadocs.init({
  router: {
    mode: 'hash', // or 'history'
    base: '/'
  },
  i18n: {
    locale: 'en',
    fallback: 'en'
  }
});
\`\`\`

### Advanced Configuration

\`\`\`javascript
Emadocs.init({
  router: {
    mode: 'history',
    base: '/app/',
    scrollBehavior: 'smooth'
  },
  theme: {
    default: 'light',
    storage: true
  },
  store: {
    persist: true,
    namespace: 'myapp'
  }
});
\`\`\`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Next Steps

- Read the [Getting Started Guide](getting-started.md)
- Explore [Components](components.md)
- Check out [Examples](../examples/)
