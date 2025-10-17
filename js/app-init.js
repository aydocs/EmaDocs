/**
 * EMADOCS FRAMEWORK - APPLICATION INITIALIZATION
 * Sets up routes and initializes the framework
 */

// Import Emadocs and Ema3D
const Emadocs = require("emadocs")
const Ema3D = require("ema3d")

// Define routes
Emadocs.Router.addRoute("/", () => {
  return `
    <div class="ema-page ema-fade-in">
      <h2>Welcome to emadocs Framework</h2>
      <p>A modern front-end framework with 500+ features, 250+ components, and 100+ modules.</p>
      
      <div class="ema-row">
        <div class="ema-col-4">
          <ema-card>
            <h3 slot="header">250+ Components</h3>
            <p slot="body">Comprehensive UI component library with Web Components and Shadow DOM.</p>
          </ema-card>
        </div>
        <div class="ema-col-4">
          <ema-card>
            <h3 slot="header">100+ Modules</h3>
            <p slot="body">Powerful JavaScript modules for routing, state, animations, and more.</p>
          </ema-card>
        </div>
        <div class="ema-col-4">
          <ema-card>
            <h3 slot="header">3D Engine</h3>
            <p slot="body">Built-in WebGL 3D engine for immersive experiences.</p>
          </ema-card>
        </div>
      </div>

      <div class="ema-actions">
        <ema-button variant="primary" onclick="Emadocs.UI.toast('Welcome to emadocs!', {type: 'success'})">
          Show Toast
        </ema-button>
        <ema-button variant="accent" onclick="showModal()">
          Open Modal
        </ema-button>
        <ema-button variant="success" onclick="Emadocs.Router.navigate('/3d')">
          View 3D Demo
        </ema-button>
      </div>
    </div>
  `
})

Emadocs.Router.addRoute("/components", () => {
  return `
    <div class="ema-page ema-slide-up">
      <h2>Component Library - 250+ Components</h2>
      
      <div class="ema-section">
        <h3>Buttons</h3>
        <div class="ema-button-group">
          <ema-button variant="primary">Primary</ema-button>
          <ema-button variant="secondary">Secondary</ema-button>
          <ema-button variant="accent">Accent</ema-button>
          <ema-button variant="success">Success</ema-button>
          <ema-button variant="warning">Warning</ema-button>
          <ema-button variant="danger">Danger</ema-button>
          <ema-button variant="outline">Outline</ema-button>
        </div>
      </div>

      <div class="ema-section">
        <h3>Cards</h3>
        <div class="ema-row">
          <div class="ema-col-6">
            <ema-card>
              <h4 slot="header">Purple Card</h4>
              <p slot="body">This is a card component with the emadocs purple theme.</p>
              <div slot="footer">
                <ema-button variant="primary">Action</ema-button>
              </div>
            </ema-card>
          </div>
          <div class="ema-col-6">
            <ema-card>
              <h4 slot="header">Feature Card</h4>
              <p slot="body">Cards are fully customizable and responsive with shadow DOM.</p>
            </ema-card>
          </div>
        </div>
      </div>

      <div class="ema-section">
        <h3>Toasts & Notifications</h3>
        <div class="ema-button-group">
          <ema-button variant="success" onclick="Emadocs.UI.toast('Success message!', {type: 'success'})">
            Success Toast
          </ema-button>
          <ema-button variant="danger" onclick="Emadocs.UI.toast('Error occurred!', {type: 'error'})">
            Error Toast
          </ema-button>
          <ema-button variant="primary" onclick="Emadocs.UI.toast('Information message', {type: 'info'})">
            Info Toast
          </ema-button>
          <ema-button variant="warning" onclick="Emadocs.UI.toast('Warning message', {type: 'warning'})">
            Warning Toast
          </ema-button>
        </div>
      </div>
    </div>
  `
})

Emadocs.Router.addRoute("/3d", () => {
  return `
    <div class="ema-page ema-scale">
      <h2>3D Features - WebGL Engine</h2>
      
      <div class="ema-section">
        <h3>3D Rotating Cube</h3>
        <canvas id="canvas3d-cube" class="ema-3d-canvas"></canvas>
        <div class="ema-button-group" style="margin-top: 1rem;">
          <ema-button variant="primary" onclick="start3DCube()">Start</ema-button>
          <ema-button variant="danger" onclick="stop3DCube()">Stop</ema-button>
          <ema-button variant="secondary" onclick="reset3DCube()">Reset</ema-button>
        </div>
      </div>

      <div class="ema-section">
        <h3>3D Particle System</h3>
        <canvas id="canvas3d-particles" class="ema-3d-canvas"></canvas>
        <div class="ema-button-group" style="margin-top: 1rem;">
          <ema-button variant="primary" onclick="start3DParticles()">Start</ema-button>
          <ema-button variant="danger" onclick="stop3DParticles()">Stop</ema-button>
        </div>
      </div>
    </div>
  `
})

Emadocs.Router.addRoute("/modules", () => {
  return `
    <div class="ema-page ema-fade-in">
      <h2>JavaScript Modules - 100+ Modules</h2>
      
      <div class="ema-row">
        <div class="ema-col-4">
          <div class="ema-section">
            <h3>Core Modules</h3>
            <ul>
              <li>Event Bus</li>
              <li>Plugin System</li>
              <li>Component Registry</li>
              <li>Lazy Loading</li>
              <li>Web Components</li>
            </ul>
          </div>
        </div>
        <div class="ema-col-4">
          <div class="ema-section">
            <h3>UI Modules</h3>
            <ul>
              <li>Toast System</li>
              <li>Modal Dialogs</li>
              <li>Tooltips</li>
              <li>Dropdowns</li>
              <li>Popovers</li>
            </ul>
          </div>
        </div>
        <div class="ema-col-4">
          <div class="ema-section">
            <h3>Advanced Modules</h3>
            <ul>
              <li>3D Engine</li>
              <li>Animation System</li>
              <li>State Management</li>
              <li>Router</li>
              <li>i18n</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})

Emadocs.Router.addRoute("/docs", () => {
  return `
    <div class="ema-page ema-slide-up">
      <h2>Documentation</h2>
      
      <div class="ema-section">
        <h3>Getting Started</h3>
        <p>emadocs is a comprehensive front-end framework with 500+ features.</p>
        <pre style="background: var(--ema-muted); padding: 1rem; border-radius: var(--ema-radius-md); overflow-x: auto;">
&lt;!-- Include emadocs --&gt;
&lt;link rel="stylesheet" href="css/emadocs.css"&gt;
&lt;script src="js/emadocs.js"&gt;&lt;/script&gt;

&lt;!-- Use components --&gt;
&lt;ema-button variant="primary"&gt;Click Me&lt;/ema-button&gt;
        </pre>
      </div>

      <div class="ema-section">
        <h3>Features</h3>
        <ul>
          <li>250+ UI Components</li>
          <li>100+ JavaScript Modules</li>
          <li>3D WebGL Engine</li>
          <li>Advanced Animation System</li>
          <li>Reactive State Management</li>
          <li>SPA Router</li>
          <li>Theme System (Purple Theme)</li>
          <li>Internationalization</li>
          <li>Accessibility Features</li>
          <li>And 490+ more features!</li>
        </ul>
      </div>
    </div>
  `
})

// 404 route
Emadocs.Router.set404(() => {
  return `
    <div class="ema-page ema-fade-in">
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <ema-button variant="primary" onclick="Emadocs.Router.navigate('/')">Go Home</ema-button>
    </div>
  `
})

// Initialize router
Emadocs.Router.init()

// Helper functions
function showModal() {
  Emadocs.UI.modal({
    title: "Welcome to emadocs",
    html: "<p>This is a modal component built with Web Components and Shadow DOM. emadocs has 500+ features!</p>",
    primaryText: "Got it!",
    onPrimary: () => {
      Emadocs.UI.toast("Modal closed!", { type: "success" })
    },
  })
}

// 3D Demo Functions
function start3DCube() {
  const scene = Ema3D.init("canvas3d-cube")
  if (scene) {
    Ema3D.createCube("canvas3d-cube", {
      color: [0.54, 0.36, 0.96, 1.0],
      rotationSpeed: { x: 0.01, y: 0.02, z: 0 },
    })
    Ema3D.start("canvas3d-cube")
    Emadocs.UI.toast("3D Cube started!", { type: "success" })
  }
}

function stop3DCube() {
  Ema3D.stop("canvas3d-cube")
  Emadocs.UI.toast("3D Cube stopped", { type: "info" })
}

function reset3DCube() {
  Ema3D.stop("canvas3d-cube")
  Ema3D.clear("canvas3d-cube")
  Emadocs.UI.toast("3D Cube reset", { type: "info" })
}

function start3DParticles() {
  const scene = Ema3D.init("canvas3d-particles")
  if (scene) {
    Ema3D.createParticles("canvas3d-particles", 200, { size: 3 })
    Ema3D.start("canvas3d-particles")
    Emadocs.UI.toast("Particle system started!", { type: "success" })
  }
}

function stop3DParticles() {
  Ema3D.stop("canvas3d-particles")
  Emadocs.UI.toast("Particle system stopped", { type: "info" })
}

// Initialize emadocs
Emadocs.init({
  router: { mode: "hash" },
})

console.log("%c✨ emadocs Framework Loaded", "color: #8b5cf6; font-size: 14px; font-weight: bold;")
console.log("%c500+ Features | 250+ Components | 100+ Modules", "color: #a78bfa; font-size: 12px;")
