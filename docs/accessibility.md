# Adiox Framework - Accessibility Guide

Comprehensive guide to building accessible applications with Adiox.

## Overview

Adiox is designed with accessibility as a core principle, following WCAG 2.1 AA guidelines. This guide covers best practices and built-in accessibility features.

## Core Principles

### 1. Semantic HTML

Always use semantic HTML elements:

\`\`\`html
<!-- Good -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<!-- Bad -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
\`\`\`

### 2. Keyboard Navigation

All interactive elements must be keyboard accessible:

\`\`\`javascript
Adiox.Core.defineElement('accessible-button', {
  template() {
    return `
      <button 
        role="button"
        tabindex="0"
        aria-label="Click me"
      >
        <slot></slot>
      </button>
    `;
  },
  
  connected() {
    const button = this.shadowRoot.querySelector('button');
    
    // Support Enter and Space keys
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  }
});
\`\`\`

### 3. ARIA Attributes

Use ARIA attributes to enhance accessibility:

\`\`\`html
<!-- Button with state -->
<button 
  aria-pressed="false"
  aria-label="Toggle dark mode"
>
  Toggle Theme
</button>

<!-- Loading state -->
<button 
  aria-busy="true"
  aria-label="Loading..."
>
  Loading
</button>

<!-- Disabled state -->
<button 
  disabled
  aria-disabled="true"
>
  Submit
</button>
\`\`\`

### 4. Focus Management

Manage focus for better keyboard navigation:

\`\`\`javascript
// Focus first element in modal
function openModal() {
  const modal = document.querySelector('adi-modal');
  modal.addEventListener('opened', () => {
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  });
}

// Restore focus after modal closes
let previousFocus;

function openModal() {
  previousFocus = document.activeElement;
  // ... open modal
}

function closeModal() {
  // ... close modal
  if (previousFocus) {
    previousFocus.focus();
  }
}
\`\`\`

## Built-in Accessibility Features

### Focus Visible

Adiox provides clear focus indicators:

\`\`\`css
:focus-visible {
  outline: 2px solid var(--adi-primary);
  outline-offset: 2px;
}
\`\`\`

### Skip Links

Add skip links for keyboard users:

\`\`\`html
<a href="#main-content" class="adi-skip-link">
  Skip to main content
</a>

<main id="main-content">
  <!-- Content -->
</main>
\`\`\`

### Screen Reader Only Content

Use `.adi-sr-only` for screen reader only text:

\`\`\`html
<button>
  <svg><!-- icon --></svg>
  <span class="adi-sr-only">Close dialog</span>
</button>
\`\`\`

### Reduced Motion

Adiox respects `prefers-reduced-motion`:

\`\`\`javascript
// Animations automatically respect reduced motion
Adiox.Animations.fadeIn('#element'); // No animation if reduced motion

// Check manually
if (Adiox.Animations.prefersReducedMotion()) {
  // Skip animations
}
\`\`\`

## Component Accessibility

### Buttons

\`\`\`html
<!-- Good button -->
<adi-button 
  variant="primary"
  aria-label="Submit form"
>
  Submit
</adi-button>

<!-- Disabled button -->
<adi-button 
  variant="primary"
  disabled
  aria-disabled="true"
>
  Submit
</adi-button>

<!-- Loading button -->
<adi-button 
  variant="primary"
  loading
  aria-busy="true"
  aria-label="Submitting..."
>
  Submit
</adi-button>
\`\`\`

### Modals

Modals include:
- Focus trap
- Escape key support
- Focus restoration
- ARIA attributes

\`\`\`javascript
Adiox.UI.modal({
  title: 'Confirm Action',
  html: '<p>Are you sure?</p>',
  primaryText: 'Confirm',
  secondaryText: 'Cancel'
});

// Modal automatically:
// - Sets aria-modal="true"
// - Sets aria-labelledby
// - Traps focus
// - Restores focus on close
\`\`\`

### Toasts

Toasts use proper ARIA live regions:

\`\`\`javascript
// Info/success: polite
Adiox.UI.toast('Saved successfully', { type: 'success' });
// aria-live="polite"

// Error: assertive
Adiox.UI.toast('Error occurred', { type: 'error' });
// aria-live="assertive"
\`\`\`

### Forms

\`\`\`html
<form>
  <label for="email" class="adi-label">
    Email Address
    <span aria-label="required">*</span>
  </label>
  <input 
    type="email"
    id="email"
    class="adi-input"
    required
    aria-required="true"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert" class="error">
    <!-- Error message -->
  </span>
</form>
\`\`\`

## Testing Accessibility

### Keyboard Testing

Test all functionality with keyboard only:

1. **Tab** - Navigate forward
2. **Shift + Tab** - Navigate backward
3. **Enter** - Activate buttons/links
4. **Space** - Activate buttons, toggle checkboxes
5. **Escape** - Close modals/dropdowns
6. **Arrow keys** - Navigate menus/lists

### Screen Reader Testing

Test with screen readers:

- **Windows**: NVDA (free), JAWS
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca

### Automated Testing

Use the test runner to check accessibility:

\`\`\`javascript
describe('Accessibility', () => {
  it('should have proper ARIA attributes', () => {
    const button = document.querySelector('adi-button');
    expect(button.getAttribute('role')).toBe('button');
  });

  it('should be keyboard accessible', () => {
    const button = document.querySelector('adi-button');
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    // Check if action was triggered
  });
});
\`\`\`

## Color Contrast

Adiox theme colors meet WCAG AA contrast requirements:

- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

Check contrast with browser DevTools or online tools.

## Best Practices Checklist

- [ ] Use semantic HTML elements
- [ ] Provide text alternatives for images
- [ ] Ensure keyboard accessibility
- [ ] Add ARIA attributes where needed
- [ ] Manage focus properly
- [ ] Use sufficient color contrast
- [ ] Support reduced motion
- [ ] Test with keyboard only
- [ ] Test with screen readers
- [ ] Provide skip links
- [ ] Use proper heading hierarchy
- [ ] Label form inputs
- [ ] Provide error messages
- [ ] Make interactive elements focusable
- [ ] Avoid keyboard traps

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

## Common Issues and Solutions

### Issue: Custom elements not keyboard accessible

**Solution:** Add tabindex and keyboard event handlers

\`\`\`javascript
Adiox.Core.defineElement('my-element', {
  template() {
    return `<div tabindex="0" role="button">Click me</div>`;
  },
  connected() {
    const el = this.shadowRoot.querySelector('div');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Handle action
      }
    });
  }
});
\`\`\`

### Issue: Focus lost after dynamic content update

**Solution:** Restore or manage focus explicitly

\`\`\`javascript
const previousFocus = document.activeElement;
// Update content
if (previousFocus) {
  previousFocus.focus();
}
\`\`\`

### Issue: Screen reader not announcing updates

**Solution:** Use ARIA live regions

\`\`\`html
<div aria-live="polite" aria-atomic="true">
  <!-- Dynamic content -->
</div>
\`\`\`
\`\`\`
