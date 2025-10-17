# Best Practices

## Component Usage

### DO: Use Semantic Components

\`\`\`html
<!-- Good -->
<ema-button variant="primary">Submit</ema-button>
<ema-card>
  <h3 slot="header">Title</h3>
  <p slot="body">Content</p>
</ema-card>

<!-- Avoid -->
<div class="button">Submit</div>
<div class="card">...</div>
\`\`\`

### DO: Leverage Slots

\`\`\`html
<!-- Good - Using slots -->
<ema-card>
  <h3 slot="header">Header</h3>
  <p slot="body">Body content</p>
  <div slot="footer">
    <ema-button>Action</ema-button>
  </div>
</ema-card>
\`\`\`

## State Management

### DO: Use Store for Shared State

\`\`\`javascript
// Good - Centralized state
Emadocs.Store.set('user', { name: 'John' });
Emadocs.Store.watch('user', updateUI);

// Avoid - Scattered state
let user = { name: 'John' };
\`\`\`

### DO: Persist Important Data

\`\`\`javascript
// Persist user preferences
Emadocs.Store.set('preferences', { theme: 'dark' });
Emadocs.Store.persist('preferences');
\`\`\`

## Performance

### DO: Lazy Load Components

\`\`\`javascript
// Load components on demand
EmaCore.registerComponent('ema-chart', 'components/ema-chart.js');
EmaCore.loadComponent('ema-chart');
\`\`\`

### DO: Use Virtual Scrolling for Large Lists

\`\`\`html
<ema-virtual-scroll items="1000">
  <!-- Only visible items are rendered -->
</ema-virtual-scroll>
\`\`\`

## Accessibility

### DO: Add ARIA Labels

\`\`\`html
<ema-button aria-label="Close dialog">×</ema-button>
<ema-input aria-label="Email address" type="email"></ema-input>
\`\`\`

### DO: Support Keyboard Navigation

All emadocs components support keyboard navigation by default.

## Theming

### DO: Use CSS Variables

\`\`\`css
/* Customize theme */
:root {
  --ema-primary: #your-color;
  --ema-radius-md: 8px;
}
\`\`\`

### DO: Support Dark Mode

\`\`\`javascript
// Respect user preference
Emadocs.Theme.init(); // Auto-detects system preference
\`\`\`

## Security

### DO: Sanitize User Input

\`\`\`javascript
// Use built-in sanitization
const safe = Emadocs.Utils.sanitizeHTML(userInput);
\`\`\`

### DO: Validate Forms

\`\`\`javascript
// Use validation module
if (EmaValidation.email(input.value)) {
  // Valid email
}
\`\`\`
