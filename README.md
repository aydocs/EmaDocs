# emadocs Framework

**Version 1.0.0** | Modern, lightweight, production-ready front-end framework with 500+ features

emadocs is a comprehensive JavaScript framework that combines the best features of modern frameworks into a single, cohesive system. Built with pure HTML, CSS, and vanilla JavaScript, it provides powerful features without the complexity.

## Features Overview

### 500+ Total Features
- **250+ UI Components** - Comprehensive component library
- **100+ JavaScript Modules** - Powerful functionality modules
- **3D Engine** - WebGL-based 3D rendering
- **Animation System** - Hardware-accelerated animations
- **State Management** - Reactive store with persistence
- **SPA Router** - Client-side routing
- **Theme System** - Purple-themed with dark mode
- **Internationalization** - Multi-language support
- **Accessibility** - WCAG 2.1 AA compliant
- **And much more!**

## Quick Start

### Installation

Download and include the framework files:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My emadocs App</title>
  
  <!-- emadocs CSS -->
  <link rel="stylesheet" href="css/emadocs.css">
</head>
<body>
  <div id="app">
    <h1>Hello emadocs!</h1>
  </div>

  <!-- emadocs Core -->
  <script src="js/core.js"></script>
  <script src="js/router.js"></script>
  <script src="js/store.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/animations.js"></script>
  <script src="js/theme.js"></script>
  <script src="js/3d-engine.js"></script>
  <script src="js/emadocs.js"></script>
  
  <!-- Your app -->
  <script src="app.js"></script>
</body>
</html>
\`\`\`

### Basic Usage

\`\`\`javascript
// Show a toast notification
Emadocs.UI.toast('Welcome to emadocs!', { type: 'success' })

// Store data reactively
Emadocs.Store.set('user.name', 'John Doe')

// Navigate with router
Emadocs.Router.navigate('/dashboard')

// Animate elements
Emadocs.Animations.fadeIn('#my-element')

// Toggle theme
Emadocs.Theme.toggle()

// Initialize 3D scene
const scene = Ema3D.init('myCanvas')
Ema3D.createCube('myCanvas')
Ema3D.start('myCanvas')
\`\`\`

## Core Features

### 1. 250+ UI Components

emadocs includes a comprehensive library of UI components:

- **Basic Components**: Button, Card, Badge, Avatar, Chip
- **Form Components**: Input, Textarea, Select, Checkbox, Radio, Switch
- **Navigation**: Navbar, Breadcrumb, Tabs, Pagination, Stepper
- **Feedback**: Toast, Modal, Alert, Tooltip, Popover, Spinner
- **Data Display**: Table, DataTable, Timeline, Tree View, Kanban
- **Advanced**: Calendar, Date Picker, Color Picker, File Upload, Range Slider
- **And 230+ more components!**

### 2. 100+ JavaScript Modules

Powerful modules for every need:

- **Core**: Event Bus, Plugin System, Component Registry
- **UI**: Toast, Modal, Tooltip, Dropdown, Popover
- **Router**: SPA routing with animations
- **Store**: Reactive state management
- **Animations**: Hardware-accelerated animations
- **Theme**: Dark/Light mode switching
- **3D Engine**: WebGL rendering
- **i18n**: Internationalization
- **Accessibility**: ARIA support
- **And 90+ more modules!**

### 3. 3D Engine

Built-in WebGL 3D engine:

\`\`\`javascript
// Initialize 3D canvas
const scene = Ema3D.init('myCanvas')

// Create 3D objects
Ema3D.createCube('myCanvas', {
  color: [0.54, 0.36, 0.96, 1.0],
  rotationSpeed: { x: 0.01, y: 0.02, z: 0 }
})

Ema3D.createSphere('myCanvas', {
  position: { x: 2, y: 0, z: 0 }
})

Ema3D.createParticles('myCanvas', 200)

// Start rendering
Ema3D.start('myCanvas')
\`\`\`

### 4. Animation System

\`\`\`javascript
// Apply animations
await Emadocs.Animations.fadeIn('#element')
await Emadocs.Animations.slideUp('.card')
await Emadocs.Animations.bounce('#button')

// Sequence animations
await Emadocs.Animations.sequence([
  { element: '#first', animation: 'fadeIn' },
  { element: '#second', animation: 'slideUp' }
], 100)
\`\`\`

### 5. State Management

\`\`\`javascript
// Set values
Emadocs.Store.set('count', 0)
Emadocs.Store.set('user.name', 'Alice')

// Watch for changes
Emadocs.Store.watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// Bind to DOM
Emadocs.Store.bind('count', '#counter')
\`\`\`

## Purple Theme

emadocs features a beautiful purple theme inspired by modern design systems:

- Primary: `#8b5cf6` (Purple)
- Accent: `#ec4899` (Pink)
- Dark mode support
- Smooth transitions
- Customizable via CSS variables

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Performance

- **Bundle Size**: ~30KB minified + gzipped
- **Zero Dependencies**: No external libraries
- **Lazy Loading**: Components load on demand
- **Hardware Acceleration**: GPU-accelerated animations
- **WebGL**: Optimized 3D rendering

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

---

Built with ❤️ by the emadocs team
