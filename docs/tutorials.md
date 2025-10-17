# emadocs Tutorials

## Tutorial 1: Building Your First App

### Step 1: Setup

Create an HTML file with emadocs:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="css/emadocs.css">
</head>
<body>
  <div id="app"></div>
  <script src="js/emadocs.js"></script>
</body>
</html>
\`\`\`

### Step 2: Create Components

\`\`\`html
<ema-button variant="primary" onclick="handleClick()">
  Click Me
</ema-button>

<ema-card>
  <h3 slot="header">My Card</h3>
  <p slot="body">Card content here</p>
</ema-card>
\`\`\`

### Step 3: Add Interactivity

\`\`\`javascript
function handleClick() {
  Emadocs.UI.toast('Button clicked!', { type: 'success' });
}

// Store data
Emadocs.Store.set('count', 0);

// Watch changes
Emadocs.Store.watch('count', (newVal) => {
  console.log('Count:', newVal);
});
\`\`\`

## Tutorial 2: Building a Todo App

### HTML Structure

\`\`\`html
<div class="ema-container">
  <h1>Todo App</h1>
  
  <ema-input id="todoInput" placeholder="Add todo"></ema-input>
  <ema-button variant="primary" onclick="addTodo()">Add</ema-button>
  
  <div id="todoList"></div>
</div>
\`\`\`

### JavaScript Logic

\`\`\`javascript
// Initialize store
Emadocs.Store.set('todos', []);

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  
  if (text) {
    const todos = Emadocs.Store.get('todos');
    todos.push({ id: Date.now(), text, done: false });
    Emadocs.Store.set('todos', todos);
    input.value = '';
    renderTodos();
  }
}

function renderTodos() {
  const todos = Emadocs.Store.get('todos');
  const list = document.getElementById('todoList');
  
  list.innerHTML = todos.map(todo => \`
    <ema-card>
      <ema-checkbox 
        \${todo.done ? 'checked' : ''}
        onchange="toggleTodo(\${todo.id})"
      >
        \${todo.text}
      </ema-checkbox>
    </ema-card>
  \`).join('');
}

function toggleTodo(id) {
  const todos = Emadocs.Store.get('todos');
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    Emadocs.Store.set('todos', todos);
    renderTodos();
  }
}

// Initial render
renderTodos();
\`\`\`

## Tutorial 3: Creating a 3D Scene

\`\`\`javascript
// Initialize 3D canvas
const scene = Ema3D.init('myCanvas');

// Create rotating cube
Ema3D.createCube('myCanvas', {
  color: [0.54, 0.36, 0.96, 1.0],
  rotationSpeed: { x: 0.01, y: 0.02, z: 0 }
});

// Create particle system
Ema3D.createParticles('myCanvas', 500);

// Add lighting
Ema3D.addLight('myCanvas', 'ambient', {
  intensity: 0.5
});

// Start rendering
Ema3D.start('myCanvas');
\`\`\`

## Tutorial 4: Building a Dashboard

Complete dashboard with charts, cards, and real-time data.

[See full tutorial →](tutorials/dashboard.md)

## Tutorial 5: E-commerce Product Page

Build a product page with image gallery, reviews, and cart.

[See full tutorial →](tutorials/ecommerce.md)
