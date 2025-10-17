# Adiox Framework - API Reference

Complete API documentation for all Adiox modules.

## Table of Contents

- [Core Module](#core-module)
- [Router Module](#router-module)
- [Store Module](#store-module)
- [UI Module](#ui-module)
- [Animations Module](#animations-module)
- [Theme Module](#theme-module)
- [Utils Module](#utils-module)
- [I18n Module](#i18n-module)

---

## Core Module

**Namespace:** `Adiox.Core`

Event bus system, plugin architecture, and component registry.

### Methods

#### `on(event, callback)`

Subscribe to an event.

**Parameters:**
- `event` (string) - Event name
- `callback` (Function) - Callback function

**Returns:** Function - Unsubscribe function

**Example:**
\`\`\`javascript
const unsubscribe = Adiox.Core.on('user:login', (data) => {
  console.log('User logged in:', data);
});

// Later: unsubscribe()
\`\`\`

#### `once(event, callback)`

Subscribe to an event once.

#### `off(event, callback)`

Unsubscribe from an event.

#### `emit(event, data)`

Emit an event.

**Example:**
\`\`\`javascript
Adiox.Core.emit('user:login', { userId: 123 });
\`\`\`

#### `defineElement(name, options)`

Define a custom element.

**Parameters:**
- `name` (string) - Element name (must include hyphen)
- `options` (Object) - Element configuration
  - `attributes` (Array) - Observed attributes
  - `styles` (string) - CSS styles
  - `template` (Function) - Template function
  - `connected` (Function) - Connected callback
  - `disconnected` (Function) - Disconnected callback
  - `attributeChanged` (Function) - Attribute changed callback

**Example:**
\`\`\`javascript
Adiox.Core.defineElement('my-component', {
  attributes: ['title'],
  styles: `p { color: blue; }`,
  template(element) {
    return `<p>${element.getAttribute('title')}</p>`;
  }
});
\`\`\`

#### `use(plugin)`

Register a plugin.

**Parameters:**
- `plugin` (Object) - Plugin object with `install` method

---

## Router Module

**Namespace:** `Adiox.Router`

SPA routing with animations and route parameters.

### Methods

#### `init(options)`

Initialize router.

**Parameters:**
- `options` (Object)
  - `mode` (string) - 'hash' or 'history' (default: 'hash')
  - `outlet` (string) - Outlet element ID (default: 'router-outlet')

#### `addRoute(path, handler)`

Add a route.

**Parameters:**
- `path` (string) - Route path (supports :param syntax)
- `handler` (Function|Object) - Route handler or config

**Example:**
\`\`\`javascript
Adiox.Router.addRoute('/user/:id', (params) => {
  return `<h1>User ${params.id}</h1>`;
});

// With config
Adiox.Router.addRoute('/admin', {
  component: () => '<h1>Admin</h1>',
  beforeEnter: ({ path, params }) => {
    if (!isAdmin()) return false; // Cancel navigation
  }
});
\`\`\`

#### `navigate(path, options)`

Navigate to a route.

**Parameters:**
- `path` (string) - Route path
- `options` (Object)
  - `replace` (boolean) - Replace history instead of push

#### `set404(handler)`

Set 404 handler.

#### `beforeEnter(hook)`

Add global before enter hook.

#### `afterEnter(hook)`

Add global after enter hook.

#### `getCurrentRoute()`

Get current route path.

#### `getParams()`

Get current route parameters.

---

## Store Module

**Namespace:** `Adiox.Store`

Reactive state management with persistence.

### Methods

#### `set(key, value, options)`

Set a value in the store.

**Parameters:**
- `key` (string) - Key path (supports dot notation)
- `value` (any) - Value to set
- `options` (Object)
  - `silent` (boolean) - Don't trigger watchers

**Example:**
\`\`\`javascript
Adiox.Store.set('user.name', 'John');
Adiox.Store.set('settings.theme', 'dark');
\`\`\`

#### `get(key, defaultValue)`

Get a value from the store.

**Returns:** any - Value or defaultValue

#### `has(key)`

Check if key exists.

**Returns:** boolean

#### `delete(key)`

Delete a key from the store.

#### `watch(key, callback)`

Watch a key for changes.

**Parameters:**
- `key` (string) - Key to watch
- `callback` (Function) - Callback (receives newValue, oldValue)

**Returns:** Function - Unwatch function

**Example:**
\`\`\`javascript
const unwatch = Adiox.Store.watch('user.name', (newValue, oldValue) => {
  console.log(`Name changed from ${oldValue} to ${newValue}`);
});
\`\`\`

#### `bind(key, target, options)`

Bind store value to DOM element.

**Parameters:**
- `key` (string) - Store key
- `target` (string|HTMLElement) - Selector or element
- `options` (Object)
  - `property` (string) - Element property (default: 'textContent')
  - `transform` (Function) - Transform function

**Returns:** Function - Unbind function

**Example:**
\`\`\`javascript
Adiox.Store.bind('count', '#counter');
Adiox.Store.bind('user.name', '#username', {
  transform: (name) => `Hello, ${name}!`
});
\`\`\`

#### `persist(key, options)`

Make a key persistent.

**Parameters:**
- `key` (string) - Key to persist
- `options` (Object)
  - `storage` (string) - 'local' or 'session' (default: 'local')

#### `clear(options)`

Clear the store.

---

## UI Module

**Namespace:** `Adiox.UI`

Toast, Modal, and Alert systems.

### Methods

#### `toast(message, options)`

Show a toast notification.

**Parameters:**
- `message` (string) - Toast message
- `options` (Object)
  - `type` (string) - 'success', 'error', 'warning', 'info' (default: 'info')
  - `duration` (number) - Duration in ms (default: 3000, 0 for persistent)
  - `position` (string) - Position (default: 'top-right')
  - `pauseOnHover` (boolean) - Pause on hover (default: true)
  - `closable` (boolean) - Show close button (default: true)

**Returns:** Object - Toast instance with `close()` method

**Example:**
\`\`\`javascript
const toast = Adiox.UI.toast('Success!', { 
  type: 'success',
  duration: 5000 
});

// Close manually
toast.close();
\`\`\`

#### `modal(options)`

Show a modal dialog.

**Parameters:**
- `options` (Object)
  - `title` (string) - Modal title
  - `html` (string) - Modal content HTML
  - `primaryText` (string) - Primary button text (default: 'OK')
  - `secondaryText` (string) - Secondary button text (default: 'Cancel')
  - `onPrimary` (Function) - Primary button callback
  - `onSecondary` (Function) - Secondary button callback
  - `onClose` (Function) - Close callback
  - `showSecondary` (boolean) - Show secondary button (default: true)
  - `closeOnBackdrop` (boolean) - Close on backdrop click (default: true)
  - `closeOnEscape` (boolean) - Close on Escape key (default: true)
  - `size` (string) - 'small', 'medium', 'large' (default: 'medium')

**Returns:** Promise - Resolves with 'primary', 'secondary', or 'close'

**Example:**
\`\`\`javascript
const result = await Adiox.UI.modal({
  title: 'Confirm',
  html: '<p>Are you sure?</p>',
  primaryText: 'Yes',
  secondaryText: 'No'
});

if (result === 'primary') {
  console.log('Confirmed');
}
\`\`\`

#### `alert(message, options)`

Show an alert.

**Returns:** Promise

#### `confirm(message, options)`

Show a confirmation dialog.

**Returns:** Promise<boolean> - True if confirmed

#### `prompt(message, options)`

Show a prompt dialog.

**Parameters:**
- `options` (Object)
  - `defaultValue` (string) - Default input value
  - `placeholder` (string) - Input placeholder

**Returns:** Promise<string|null> - Input value or null if cancelled

---

## Animations Module

**Namespace:** `Adiox.Animations`

Hardware-accelerated animations.

### Methods

#### `apply(element, animation, options)`

Apply animation to element.

**Parameters:**
- `element` (HTMLElement|string) - Element or selector
- `animation` (string|Object) - Animation name or custom config
- `options` (Object)
  - `duration` (number) - Duration in ms
  - `easing` (string) - Easing function
  - `delay` (number) - Delay in ms
  - `iterations` (number) - Number of iterations

**Returns:** Promise<Animation>

**Example:**
\`\`\`javascript
await Adiox.Animations.apply('#element', 'fadeIn', {
  duration: 500,
  easing: 'ease-out'
});
\`\`\`

### Preset Animations

- `fadeIn`, `fadeOut`
- `slideUp`, `slideDown`, `slideLeft`, `slideRight`
- `scale`, `scaleUp`
- `bounce`, `shake`, `pulse`
- `spin`, `rotate`, `flip`
- `zoomIn`, `zoomOut`
- `swing`

### Shorthand Methods

\`\`\`javascript
Adiox.Animations.fadeIn(element, options);
Adiox.Animations.slideUp(element, options);
Adiox.Animations.bounce(element, options);
// ... etc
\`\`\`

#### `sequence(animations, stagger)`

Animate elements in sequence.

**Parameters:**
- `animations` (Array) - Array of {element, animation, options}
- `stagger` (number) - Delay between animations (default: 100ms)

#### `stagger(animations, stagger)`

Animate elements with stagger effect.

#### `parallel(animations)`

Animate elements in parallel.

#### `onScroll(element, animation, options)`

Trigger animation on scroll.

**Parameters:**
- `options` (Object)
  - `threshold` (number) - Intersection threshold (default: 0.1)
  - `once` (boolean) - Animate only once (default: true)

**Returns:** IntersectionObserver

#### `register(name, config)`

Register custom animation preset.

---

## Theme Module

**Namespace:** `Adiox.Theme`

Dark/Light theme management.

### Methods

#### `set(theme)`

Set theme.

**Parameters:**
- `theme` (string) - 'light' or 'dark'

#### `toggle()`

Toggle between light and dark theme.

#### `get()`

Get current theme.

**Returns:** string

#### `isDark()`

Check if dark mode is active.

**Returns:** boolean

#### `isLight()`

Check if light mode is active.

**Returns:** boolean

---

## Utils Module

**Namespace:** `Adiox.Utils`

Utility functions.

### Methods

#### `sanitizeHTML(html)`

Sanitize HTML to prevent XSS.

#### `generateId(prefix)`

Generate unique ID.

#### `formatDate(date, format)`

Format date.

#### `parseQuery(search)`

Parse query string.

#### `buildQuery(params)`

Build query string.

#### `isInViewport(element, offset)`

Check if element is in viewport.

#### `scrollTo(element, options)`

Scroll to element smoothly.

#### `copyToClipboard(text)`

Copy text to clipboard.

#### `formatFileSize(bytes, decimals)`

Format file size.

#### `truncate(str, length, suffix)`

Truncate string.

#### `capitalize(str)`

Capitalize first letter.

#### `kebabCase(str)`

Convert to kebab-case.

#### `camelCase(str)`

Convert to camelCase.

#### `isEmpty(obj)`

Check if object is empty.

#### `random(min, max)`

Get random number.

#### `shuffle(array)`

Shuffle array.

#### `groupBy(array, key)`

Group array by key.

#### `unique(array)`

Remove duplicates from array.

#### `isEmail(email)`

Validate email.

#### `isURL(url)`

Validate URL.

#### `waitFor(condition, timeout, interval)`

Wait for condition to be true.

---

## I18n Module

**Namespace:** `Adiox.I18n`

Internationalization with RTL support.

### Methods

#### `init(options)`

Initialize i18n system.

**Parameters:**
- `options` (Object)
  - `locale` (string) - Initial locale (default: 'en')
  - `fallback` (string) - Fallback locale (default: 'en')

#### `load(locale, translations)`

Load translations.

**Parameters:**
- `locale` (string) - Locale code
- `translations` (Object) - Translation object

**Example:**
\`\`\`javascript
Adiox.I18n.load('en', {
  welcome: 'Welcome',
  user: {
    greeting: 'Hello {name}!'
  }
});
\`\`\`

#### `loadFromURL(locale, url)`

Load translations from URL.

**Returns:** Promise

#### `setLocale(locale)`

Set current locale.

#### `getLocale()`

Get current locale.

#### `t(key, params, locale)`

Translate key.

**Parameters:**
- `key` (string) - Translation key (supports dot notation)
- `params` (Object) - Parameters for interpolation
- `locale` (string) - Specific locale (optional)

**Returns:** string

**Example:**
\`\`\`javascript
const text = Adiox.I18n.t('user.greeting', { name: 'John' });
// Output: "Hello John!"
\`\`\`

#### `isRTL(locale)`

Check if locale is RTL.

**Returns:** boolean

#### `getAvailableLocales()`

Get available locales.

**Returns:** Array<string>
