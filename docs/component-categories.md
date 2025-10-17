# emadocs Component Categories

## Component Organization

### 1. Basic Components (20)
Essential building blocks for any application.

### 2. Form Components (30)
Complete form controls with validation support.

### 3. Navigation Components (25)
Navigation patterns for all screen sizes.

### 4. Feedback Components (20)
User feedback and notification systems.

### 5. Data Display Components (30)
Components for displaying structured data.

### 6. Layout Components (20)
Layout utilities and containers.

### 7. Media Components (15)
Image, video, and media handling.

### 8. Chart Components (15)
Data visualization components.

### 9. Advanced Components (25)
Complex, feature-rich components.

### 10. Utility Components (20)
Helper components and directives.

### 11. 3D Components (10)
WebGL 3D rendering components.

### 12. Animation Components (10)
Animation wrappers and effects.

### 13. Social Components (10)
Social media integration.

### 14. Additional Components (10+)
Specialized components for specific use cases.

## Usage Example

\`\`\`html
<!-- Basic Button -->
<ema-button variant="primary">Click Me</ema-button>

<!-- Form Input -->
<ema-input type="email" placeholder="Enter email"></ema-input>

<!-- Card Component -->
<ema-card>
  <h3 slot="header">Card Title</h3>
  <p slot="body">Card content goes here</p>
  <ema-button slot="footer" variant="primary">Action</ema-button>
</ema-card>

<!-- Progress Bar -->
<ema-progress value="75" max="100"></ema-progress>

<!-- Badge -->
<ema-badge variant="success">New</ema-badge>

<!-- Avatar -->
<ema-avatar src="/user.jpg" alt="User" size="lg"></ema-avatar>
\`\`\`

## Component Features

All emadocs components include:
- Shadow DOM encapsulation
- Customizable via CSS variables
- Accessible (ARIA support)
- Responsive design
- Dark mode support
- Purple theme integration
- Event handling
- Slot support for composition
