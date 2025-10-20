#!/usr/bin/env node

/**
 * EMADOCS CLI - Command Line Interface
 * The command-line tool for Emadocs Framework
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chokidar = require('chokidar');
const express = require('express');
const WebSocket = require('ws');
const open = require('open');

class EmadocsCLI {
  constructor() {
    this.version = '1.0.0';
    this.config = this.loadConfig();
    this.watcher = null;
    this.server = null;
    this.wss = null;
  }

  // Load configuration
  loadConfig() {
    const configPath = path.join(process.cwd(), 'emadocs.config.js');
    
    if (fs.existsSync(configPath)) {
      return require(configPath);
    }
    
    return {
      entry: './src/index.ema',
      output: './dist',
      mode: 'development',
      devServer: {
        port: 3000,
        host: 'localhost',
        hot: true,
        open: true
      },
      build: {
        minify: true,
        sourcemap: true,
        treeshaking: true
      }
    };
  }

  // Main command handler
  async run(args) {
    const command = args[0];
    
    switch (command) {
      case 'dev':
        await this.dev();
        break;
      case 'build':
        await this.build();
        break;
      case 'serve':
        await this.serve();
        break;
      case 'init':
        await this.init();
        break;
      case 'create':
        await this.create(args[1], args[2]);
        break;
      case 'generate':
        await this.generate(args[1]);
        break;
      case 'test':
        await this.test();
        break;
      case 'lint':
        await this.lint();
        break;
      case 'format':
        await this.format();
        break;
      case 'version':
        this.version();
        break;
      case 'help':
        this.help();
        break;
      default:
        console.log(`Unknown command: ${command}`);
        this.help();
    }
  }

  // Development server
  async dev() {
    console.log('🚀 Starting Emadocs development server...');
    
    // Start file watcher
    this.startWatcher();
    
    // Start development server
    await this.startDevServer();
    
    // Start WebSocket for hot reload
    this.startWebSocket();
    
    console.log(`✅ Development server running at http://${this.config.devServer.host}:${this.config.devServer.port}`);
    
    if (this.config.devServer.open) {
      await open(`http://${this.config.devServer.host}:${this.config.devServer.port}`);
    }
  }

  // Build project
  async build() {
    console.log('🔨 Building Emadocs project...');
    
    const startTime = Date.now();
    
    try {
      // Compile all .ema files
      const files = this.findEmaFiles();
      const results = [];
      
      for (const file of files) {
        console.log(`Compiling ${file}...`);
        const result = await this.compileFile(file);
        results.push(result);
      }
      
      // Generate output files
      await this.generateOutput(results);
      
      const endTime = Date.now();
      console.log(`✅ Build completed in ${endTime - startTime}ms`);
      
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  }

  // Serve built files
  async serve() {
    console.log('🌐 Serving built files...');
    
    const app = express();
    const distPath = path.resolve(this.config.output);
    
    app.use(express.static(distPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    
    const port = this.config.devServer.port || 3000;
    this.server = app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  }

  // Initialize new project
  async init() {
    console.log('🎯 Initializing new Emadocs project...');
    
    const projectName = await this.prompt('Project name: ');
    const projectPath = path.join(process.cwd(), projectName);
    
    if (fs.existsSync(projectPath)) {
      console.error(`❌ Directory ${projectName} already exists`);
      return;
    }
    
    // Create project structure
    fs.mkdirSync(projectPath);
    fs.mkdirSync(path.join(projectPath, 'src'));
    fs.mkdirSync(path.join(projectPath, 'public'));
    fs.mkdirSync(path.join(projectPath, 'components'));
    fs.mkdirSync(path.join(projectPath, 'styles'));
    fs.mkdirSync(path.join(projectPath, 'dist'));
    
    // Create package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: 'Emadocs project',
      main: 'dist/index.js',
      scripts: {
        dev: 'emadocs dev',
        build: 'emadocs build',
        serve: 'emadocs serve',
        test: 'emadocs test',
        lint: 'emadocs lint',
        format: 'emadocs format'
      },
      dependencies: {
        'emadocs-framework': '^1.0.0'
      },
      devDependencies: {
        'emadocs-cli': '^1.0.0'
      }
    };
    
    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create emadocs.config.js
    const configContent = `module.exports = {
  entry: './src/index.ema',
  output: './dist',
  mode: 'development',
  devServer: {
    port: 3000,
    host: 'localhost',
    hot: true,
    open: true
  },
  build: {
    minify: true,
    sourcemap: true,
    treeshaking: true
  }
};`;
    
    fs.writeFileSync(
      path.join(projectPath, 'emadocs.config.js'),
      configContent
    );
    
    // Create index.ema
    const indexContent = `<page title="${projectName}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  
  <body>
    <div class="app">
      <header>
        <h1>Welcome to ${projectName}</h1>
        <p>Built with Emadocs Framework</p>
      </header>
      
      <main>
        <p>Start building your amazing app!</p>
      </main>
    </div>
  </body>
</page>`;
    
    fs.writeFileSync(
      path.join(projectPath, 'src/index.ema'),
      indexContent
    );
    
    // Create README.md
    const readmeContent = `# ${projectName}

A project built with Emadocs Framework.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Serve built files
npm run serve
\`\`\`

## Project Structure

\`\`\`
${projectName}/
├── src/
│   └── index.ema
├── components/
├── styles/
├── public/
├── dist/
├── emadocs.config.js
└── package.json
\`\`\`

## Learn More

Visit [Emadocs Documentation](https://emadocs.dev) to learn more about the framework.
`;
    
    fs.writeFileSync(
      path.join(projectPath, 'README.md'),
      readmeContent
    );
    
    console.log(`✅ Project ${projectName} created successfully!`);
    console.log(`📁 Project location: ${projectPath}`);
    console.log(`🚀 Run 'cd ${projectName} && npm run dev' to start developing`);
  }

  // Create component
  async create(type, name) {
    if (!name) {
      console.error('❌ Component name is required');
      return;
    }
    
    const componentPath = path.join(process.cwd(), 'components', name);
    
    if (fs.existsSync(componentPath)) {
      console.error(`❌ Component ${name} already exists`);
      return;
    }
    
    fs.mkdirSync(componentPath, { recursive: true });
    
    switch (type) {
      case 'component':
        await this.createComponent(name);
        break;
      case 'page':
        await this.createPage(name);
        break;
      case 'layout':
        await this.createLayout(name);
        break;
      case 'hook':
        await this.createHook(name);
        break;
      case 'api':
        await this.createApi(name);
        break;
      default:
        console.error(`❌ Unknown type: ${type}`);
    }
    
    console.log(`✅ ${type} ${name} created successfully!`);
  }

  // Generate component
  async generate(name) {
    console.log(`🔧 Generating component ${name}...`);
    
    const componentPath = path.join(process.cwd(), 'components', name);
    
    if (fs.existsSync(componentPath)) {
      console.error(`❌ Component ${name} already exists`);
      return;
    }
    
    // Create component directory
    fs.mkdirSync(componentPath, { recursive: true });
    
    // Generate component files
    await this.generateComponentFiles(name, componentPath);
    
    console.log(`✅ Component ${name} generated successfully!`);
  }

  // Run tests
  async test() {
    console.log('🧪 Running tests...');
    
    try {
      // Run test command
      execSync('npm test', { stdio: 'inherit' });
      console.log('✅ All tests passed!');
    } catch (error) {
      console.error('❌ Tests failed:', error.message);
      process.exit(1);
    }
  }

  // Lint code
  async lint() {
    console.log('🔍 Linting code...');
    
    try {
      // Run lint command
      execSync('npm run lint', { stdio: 'inherit' });
      console.log('✅ Linting completed!');
    } catch (error) {
      console.error('❌ Linting failed:', error.message);
      process.exit(1);
    }
  }

  // Format code
  async format() {
    console.log('✨ Formatting code...');
    
    try {
      // Run format command
      execSync('npm run format', { stdio: 'inherit' });
      console.log('✅ Formatting completed!');
    } catch (error) {
      console.error('❌ Formatting failed:', error.message);
      process.exit(1);
    }
  }

  // Show version
  version() {
    console.log(`Emadocs CLI v${this.version}`);
  }

  // Show help
  help() {
    console.log(`
Emadocs CLI - Command Line Interface

Usage: emadocs <command> [options]

Commands:
  dev         Start development server
  build       Build project for production
  serve       Serve built files
  init        Initialize new project
  create      Create new component/page/layout/hook/api
  generate    Generate component with variants
  test        Run tests
  lint        Lint code
  format      Format code
  version     Show version
  help        Show this help

Examples:
  emadocs init
  emadocs create component Button
  emadocs generate Card
  emadocs dev
  emadocs build
`);
  }

  // Start file watcher
  startWatcher() {
    const watchPath = path.join(process.cwd(), 'src');
    
    this.watcher = chokidar.watch(watchPath, {
      ignored: /node_modules/,
      persistent: true
    });
    
    this.watcher.on('change', (filePath) => {
      console.log(`📝 File changed: ${filePath}`);
      this.handleFileChange(filePath);
    });
    
    this.watcher.on('add', (filePath) => {
      console.log(`➕ File added: ${filePath}`);
      this.handleFileChange(filePath);
    });
    
    this.watcher.on('unlink', (filePath) => {
      console.log(`🗑️  File removed: ${filePath}`);
      this.handleFileChange(filePath);
    });
  }

  // Start development server
  async startDevServer() {
    const app = express();
    
    // Serve static files from root
    app.use(express.static(process.cwd()));
    
    // Serve static files
    app.use(express.static(path.join(process.cwd(), 'public')));
    
    // Serve CSS files
    app.use('/css', express.static(path.join(process.cwd(), 'css')));
    
    // Serve JS files
    app.use('/js', express.static(path.join(process.cwd(), 'js')));
    
    // Serve assets
    app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
    
    // Serve compiled files
    app.use(express.static(path.join(process.cwd(), 'dist')));
    
    // Handle .ema files
    app.get('*.ema', async (req, res) => {
      const filePath = path.join(process.cwd(), 'src', req.path);
      
      if (fs.existsSync(filePath)) {
        const result = await this.compileFile(filePath);
        res.send(result.html);
      } else {
        res.status(404).send('File not found');
      }
    });
    
    // Handle all other routes
    app.get('*', async (req, res) => {
      // Try multiple possible index locations
      const possibleIndexes = [
        path.join(process.cwd(), 'index.ema'),
        path.join(process.cwd(), 'src', 'index.ema'),
        path.join(process.cwd(), 'src', 'index.html'),
        path.join(process.cwd(), 'index.html')
      ];
      
      let indexPath = null;
      for (const path of possibleIndexes) {
        if (fs.existsSync(path)) {
          indexPath = path;
          break;
        }
      }
      
      if (indexPath) {
        if (indexPath.endsWith('.ema')) {
          const result = await this.compileFile(indexPath);
          res.send(result.html);
        } else {
          res.sendFile(indexPath);
        }
      } else {
        res.status(404).send('Index file not found');
      }
    });
    
    const port = this.config.devServer.port || 3000;
    const host = this.config.devServer.host || 'localhost';
    
    this.server = app.listen(port, host, () => {
      console.log(`🌐 Development server running at http://${host}:${port}`);
    });
  }

  // Start WebSocket for hot reload
  startWebSocket() {
    const port = (this.config.devServer.port || 3000) + 1;
    
    this.wss = new WebSocket.Server({ port });
    
    this.wss.on('connection', (ws) => {
      console.log('🔌 WebSocket connected');
      
      ws.on('close', () => {
        console.log('🔌 WebSocket disconnected');
      });
    });
    
    console.log(`🔌 WebSocket server running on port ${port}`);
  }

  // Handle file change
  async handleFileChange(filePath) {
    // Only reload for .ema files
    if (filePath.endsWith('.ema')) {
      console.log(`Compiling ${path.basename(filePath)}...`);
      
      if (this.wss) {
        this.wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'reload',
              file: filePath
            }));
          }
        });
      }
    }
  }

  // Find .ema files
  findEmaFiles() {
    const srcPath = path.join(process.cwd(), 'src');
    const files = [];
    
    const findFiles = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          findFiles(itemPath);
        } else if (item.endsWith('.ema')) {
          files.push(itemPath);
        }
      }
    };
    
    if (fs.existsSync(srcPath)) {
      findFiles(srcPath);
    }
    
    return files;
  }

  // Compile file
  async compileFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const EmadocsCompiler = require('./core/compiler/emadocs-compiler');
    const compiler = new EmadocsCompiler(this.config);
    
    return compiler.compile(content, path.basename(filePath));
  }

  // Generate output
  async generateOutput(results) {
    const distPath = path.resolve(this.config.output);
    
    // Create dist directory
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
    }
    
    // Write output files
    for (const result of results) {
      if (result.success) {
        for (const file of result.output.files) {
          const filePath = path.join(distPath, file.name);
          const dir = path.dirname(filePath);
          
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(filePath, file.content);
        }
      } else {
        console.error('❌ Compilation failed:', result.errors);
      }
    }
  }

  // Create component
  async createComponent(name) {
    const componentPath = path.join(process.cwd(), 'components', name);
    
    // Create component.ema
    const componentContent = `component ${name} {
  prop variant: "primary" | "secondary" | "outline" = "primary";
  prop size: "sm" | "md" | "lg" = "md";
  prop disabled: boolean = false;
  prop children: any;
  
  event onClick: () => void;
  
  render() {
    <div class="ema-${name.toLowerCase()} ema-${name.toLowerCase()}--{variant} ema-${name.toLowerCase()}--{size}">
      {children}
    </div>
  }
}

style ${name} {
  .ema-${name.toLowerCase()} {
    display: inline-block;
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--duration-200) var(--ease-in-out);
  }
  
  .ema-${name.toLowerCase()}--primary {
    background: var(--active-theme);
    color: var(--active-theme-text-primary);
  }
  
  .ema-${name.toLowerCase()}--secondary {
    background: var(--neutral-100);
    color: var(--neutral-900);
    border: 1px solid var(--neutral-300);
  }
  
  .ema-${name.toLowerCase()}--outline {
    background: transparent;
    color: var(--active-theme);
    border: 1px solid var(--active-theme);
  }
  
  .ema-${name.toLowerCase()}--sm {
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }
  
  .ema-${name.toLowerCase()}--md {
    padding: var(--space-3) var(--space-6);
    font-size: var(--font-size-base);
  }
  
  .ema-${name.toLowerCase()}--lg {
    padding: var(--space-4) var(--space-8);
    font-size: var(--font-size-lg);
  }
  
  .ema-${name.toLowerCase()}:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .ema-${name.toLowerCase()}:disabled {
    opacity: var(--state-disabled);
    cursor: not-allowed;
  }
}`;
    
    fs.writeFileSync(
      path.join(componentPath, `${name}.ema`),
      componentContent
    );
    
    // Create README.md
    const readmeContent = `# ${name} Component

A reusable ${name} component for Emadocs Framework.

## Usage

\`\`\`ema
<${name} variant="primary" size="md">
  Button Text
</${name}>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "primary" \| "secondary" \| "outline" | "primary" | Component variant |
| size | "sm" \| "md" \| "lg" | "md" | Component size |
| disabled | boolean | false | Whether component is disabled |
| children | any | - | Component content |

## Events

| Event | Description |
|-------|-------------|
| onClick | Fired when component is clicked |

## Examples

### Primary Button
\`\`\`ema
<${name} variant="primary">
  Primary Button
</${name}>
\`\`\`

### Secondary Button
\`\`\`ema
<${name} variant="secondary">
  Secondary Button
</${name}>
\`\`\`

### Outline Button
\`\`\`ema
<${name} variant="outline">
  Outline Button
</${name}>
\`\`\`
`;
    
    fs.writeFileSync(
      path.join(componentPath, 'README.md'),
      readmeContent
    );
  }

  // Create page
  async createPage(name) {
    const pagePath = path.join(process.cwd(), 'src', 'pages');
    
    if (!fs.existsSync(pagePath)) {
      fs.mkdirSync(pagePath, { recursive: true });
    }
    
    const pageContent = `<page title="${name}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  
  <body>
    <div class="page-${name.toLowerCase()}">
      <header>
        <h1>${name}</h1>
      </header>
      
      <main>
        <p>Welcome to ${name} page!</p>
      </main>
    </div>
  </body>
</page>

style Page${name} {
  .page-${name.toLowerCase()} {
    min-height: 100vh;
    padding: var(--space-6);
  }
  
  header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  h1 {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--active-theme-text-primary);
  }
  
  main {
    max-width: 800px;
    margin: 0 auto;
  }
}`;
    
    fs.writeFileSync(
      path.join(pagePath, `${name}.ema`),
      pageContent
    );
  }

  // Create layout
  async createLayout(name) {
    const layoutPath = path.join(process.cwd(), 'src', 'layouts');
    
    if (!fs.existsSync(layoutPath)) {
      fs.mkdirSync(layoutPath, { recursive: true });
    }
    
    const layoutContent = `layout ${name} {
  render() {
    <div class="layout-${name.toLowerCase()}">
      <header class="layout-header">
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      
      <main class="layout-main">
        <slot />
      </main>
      
      <footer class="layout-footer">
        <p>&copy; 2024 Emadocs Framework</p>
      </footer>
    </div>
  }
}

style ${name} {
  .layout-${name.toLowerCase()} {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .layout-header {
    background: var(--active-theme-bg-card);
    padding: var(--space-4);
    border-bottom: 1px solid var(--active-theme-border);
  }
  
  .layout-main {
    flex: 1;
    padding: var(--space-6);
  }
  
  .layout-footer {
    background: var(--active-theme-bg-card);
    padding: var(--space-4);
    text-align: center;
    border-top: 1px solid var(--active-theme-border);
  }
  
  nav {
    display: flex;
    gap: var(--space-4);
  }
  
  nav a {
    color: var(--active-theme-text-primary);
    text-decoration: none;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    transition: all var(--duration-200) var(--ease-in-out);
  }
  
  nav a:hover {
    background: var(--active-theme-bg-light);
  }
}`;
    
    fs.writeFileSync(
      path.join(layoutPath, `${name}.ema`),
      layoutContent
    );
  }

  // Create hook
  async createHook(name) {
    const hookPath = path.join(process.cwd(), 'src', 'hooks');
    
    if (!fs.existsSync(hookPath)) {
      fs.mkdirSync(hookPath, { recursive: true });
    }
    
    const hookContent = `hook use${name}() {
  // Hook implementation
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Effect implementation
  }, []);
  
  return { state, setState };
}`;
    
    fs.writeFileSync(
      path.join(hookPath, `use${name}.ema`),
      hookContent
    );
  }

  // Create API
  async createApi(name) {
    const apiPath = path.join(process.cwd(), 'src', 'api');
    
    if (!fs.existsSync(apiPath)) {
      fs.mkdirSync(apiPath, { recursive: true });
    }
    
    const apiContent = `api ${name} {
  baseUrl: "https://api.example.com";
  
  async getItems(): Promise<Item[]> {
    const response = await fetch(\`\${baseUrl}/items\`);
    return response.json();
  }
  
  async getItem(id: number): Promise<Item> {
    const response = await fetch(\`\${baseUrl}/items/\${id}\`);
    return response.json();
  }
  
  async createItem(item: Item): Promise<Item> {
    const response = await fetch(\`\${baseUrl}/items\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    return response.json();
  }
  
  async updateItem(id: number, item: Item): Promise<Item> {
    const response = await fetch(\`\${baseUrl}/items/\${id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    return response.json();
  }
  
  async deleteItem(id: number): Promise<void> {
    await fetch(\`\${baseUrl}/items/\${id}\`, {
      method: "DELETE"
    });
  }
}`;
    
    fs.writeFileSync(
      path.join(apiPath, `${name}.ema`),
      apiContent
    );
  }

  // Generate component files
  async generateComponentFiles(name, componentPath) {
    // Generate 5 variants
    const variants = ['minimal', 'neo', 'soft', 'glass', 'premium'];
    
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const variantPath = path.join(componentPath, `variant-${i + 1}`);
      
      fs.mkdirSync(variantPath, { recursive: true });
      
      // Generate HTML
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - ${variant} Variant</title>
    <link rel="stylesheet" href="../../../css/theme.css">
    <link rel="stylesheet" href="../../../css/emadocs.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="demo-container">
        <h1>${name} - ${variant} Variant</h1>
        
        <div class="component-demo">
            <div class="ema-${name.toLowerCase()} ema-${name.toLowerCase()}--${variant}">
                <!-- Component content -->
            </div>
        </div>
    </div>
    
    <script src="../../../js/emadocs.js"></script>
    <script src="script.js"></script>
</body>
</html>`;
      
      fs.writeFileSync(
        path.join(variantPath, 'index.html'),
        htmlContent
      );
      
      // Generate CSS
      const cssContent = `/* ${name} Component - ${variant} Variant */

.ema-${name.toLowerCase()} {
  display: block;
  position: relative;
  box-sizing: border-box;
}

.ema-${name.toLowerCase()}--${variant} {
  /* ${variant} variant styles */
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--active-theme-bg-card);
  border: 1px solid var(--active-theme-border);
  transition: all var(--duration-200) var(--ease-in-out);
}

.ema-${name.toLowerCase()}--${variant}:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive Design */
@media (max-width: 480px) {
  .ema-${name.toLowerCase()}--${variant} {
    padding: var(--space-3);
  }
}

@media (min-width: 768px) {
  .ema-${name.toLowerCase()}--${variant} {
    padding: var(--space-5);
  }
}

@media (min-width: 1024px) {
  .ema-${name.toLowerCase()}--${variant} {
    padding: var(--space-6);
  }
}`;
      
      fs.writeFileSync(
        path.join(variantPath, 'style.css'),
        cssContent
      );
      
      // Generate JavaScript
      const jsContent = `/**
 * ${name} Component - ${variant} Variant
 */

(function() {
  'use strict';
  
  function init${name}${variant.charAt(0).toUpperCase() + variant.slice(1)}() {
    const components = document.querySelectorAll('.ema-${name.toLowerCase()}--${variant}');
    
    components.forEach(component => {
      setupEventListeners(component);
      setupAccessibility(component);
    });
  }
  
  function setupEventListeners(component) {
    component.addEventListener('click', handleClick);
    component.addEventListener('keydown', handleKeydown);
  }
  
  function setupAccessibility(component) {
    component.setAttribute('role', 'button');
    component.setAttribute('tabindex', '0');
  }
  
  function handleClick(event) {
    console.log('${name} ${variant} clicked');
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      component.click();
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init${name}${variant.charAt(0).toUpperCase() + variant.slice(1)});
  } else {
    init${name}${variant.charAt(0).toUpperCase() + variant.slice(1)}();
  }
})();`;
      
      fs.writeFileSync(
        path.join(variantPath, 'script.js'),
        jsContent
      );
    }
  }

  // Prompt for input
  async prompt(question) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
}

// Main execution
if (require.main === module) {
  const cli = new EmadocsCLI();
  cli.run(process.argv.slice(2)).catch(console.error);
}

module.exports = EmadocsCLI;
