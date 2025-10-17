# Adiox Components Guide

Complete guide to using Adiox Web Components.

## Built-in Components

### adi-button

Accessible button component with multiple variants.

**Attributes:**
- `variant` - Button style: 'primary', 'secondary', 'outline', 'ghost', 'danger', 'success'
- `size` - Button size: 'small', 'medium', 'large'
- `disabled` - Disable button
- `loading` - Show loading spinner

**Example:**
\`\`\`html
<adi-button variant="primary">Click Me</adi-button>
<adi-button variant="outline" size="small">Small Button</adi-button>
<adi-button variant="danger" disabled>Disabled</adi-button>
<adi-button variant="primary" loading>Loading...</adi-button>
\`\`\`

**Events:**
- `click` - Fired when button is clicked

**JavaScript:**
\`\`\`javascript
const button = document.querySelector('adi-button');
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
\`\`\`

---

### adi-card

Container component with header, body, and footer slots.

**Attributes:**
- `variant` - Card style: 'elevated', 'outlined'
- `padding` - Padding size: 'compact', 'normal', 'spacious'

**Slots:**
- `header` - Card header
- `default` - Card body (default slot)
- `footer` - Card footer

**Example:**
\`\`\`html
<adi-card variant="elevated">
  <h3 slot="header">Card Title</h3>
  <p>Card content goes here</p>
  <div slot="footer">
    <adi-button variant="primary">Action</adi-button>
  </div>
</adi-card>
\`\`\`

---

### adi-toast

Toast notification component.

**Attributes:**
- `message` - Toast message
- `type` - Toast type: 'success', 'error', 'warning', 'info'
- `no-close` - Hide close button

**Note:** Usually created programmatically via `Adiox.UI.toast()`.

---

### adi-modal

Modal dialog component.

**Attributes:**
- `title` - Modal title
- `primary-text` - Primary button text
- `secondary-text` - Secondary button text
- `size` - Modal size: 'small', 'medium', 'large'

**Slots:**
- `content` - Modal content

**Events:**
- `primary-click` - Primary button clicked
- `secondary-click` - Secondary button clicked
- `close` - Modal closed

**Note:** Usually created programmatically via `Adiox.UI.modal()`.

---

## Creating Custom Components

### Basic Component

\`\`\`javascript
Adiox.Core.defineElement('my-component', {
  attributes: ['title', 'count'],
  
  styles: `
    :host {
      display: block;
      padding: 1rem;
      background: var(--adi-surface);
      border-radius: var(--adi-radius);
    }
    h3 {
      margin: 0 0 0.5rem 0;
      color: var(--adi-primary);
    }
  `,
  
  template(element) {
    const title = element.getAttribute('title') || 'Default Title';
    const count = element.getAttribute('count') || '0';
    
    return `
      <h3>${title}</h3>
      <p>Count: <span id="count">${count}</span></p>
      <button id="increment">Increment</button>
    `;
  },
  
  connected() {
    const button = this.shadowRoot.querySelector('#increment');
    const countEl = this.shadowRoot.querySelector('#count');
    
    button.addEventListener('click', () => {
      const current = parseInt(countEl.textContent);
      countEl.textContent = current + 1;
      
      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('count-changed', {
        detail: { count: current + 1 },
        bubbles: true,
        composed: true
      }));
    });
  },
  
  disconnected() {
    // Cleanup if needed
  },
  
  attributeChanged(name, oldValue, newValue) {
    if (name === 'count') {
      const countEl = this.shadowRoot?.querySelector('#count');
      if (countEl) {
        countEl.textContent = newValue;
      }
    }
  }
});
\`\`\`

**Usage:**
\`\`\`html
<my-component title="My Counter" count="5"></my-component>

<script>
document.querySelector('my-component').addEventListener('count-changed', (e) => {
  console.log('Count changed to:', e.detail.count);
});
</script>
\`\`\`

### Component with Store Integration

\`\`\`javascript
Adiox.Core.defineElement('user-profile', {
  template() {
    return `
      <div class="profile">
        <h3 id="name">Loading...</h3>
        <p id="email">Loading...</p>
      </div>
    `;
  },
  
  connected() {
    // Bind to store
    const nameEl = this.shadowRoot.querySelector('#name');
    const emailEl = this.shadowRoot.querySelector('#email');
    
    const unbindName = Adiox.Store.bind('user.name', nameEl);
    const unbindEmail = Adiox.Store.bind('user.email', emailEl);
    
    // Store cleanup functions
    this.addCleanup(unbindName);
    this.addCleanup(unbindEmail);
  }
});
\`\`\`

### Component Best Practices

1. **Use Shadow DOM** for style encapsulation
2. **Clean up event listeners** in `disconnected()`
3. **Use semantic HTML** for accessibility
4. **Add ARIA attributes** when needed
5. **Dispatch custom events** for parent communication
6. **Use CSS custom properties** for theming
7. **Keep components focused** - single responsibility
8. **Document attributes and events**

### Accessibility Guidelines

\`\`\`javascript
Adiox.Core.defineElement('accessible-button', {
  attributes: ['label', 'disabled'],
  
  template(element) {
    const label = element.getAttribute('label');
    const disabled = element.hasAttribute('disabled');
    
    return `
      <button 
        role="button"
        aria-label="${label}"
        aria-disabled="${disabled}"
        tabindex="${disabled ? '-1' : '0'}"
      >
        <slot></slot>
      </button>
    `;
  },
  
  connected() {
    const button = this.shadowRoot.querySelector('button');
    
    // Keyboard support
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  }
});
