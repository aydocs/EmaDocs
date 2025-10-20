/**
 * EMADOCS COMPILER - EmadocsLang to HTML/CSS/JS Compiler
 * Compiles .ema files to optimized HTML, CSS, and JavaScript
 */

const EmadocsParser = require('../parser/emadocs-parser');

class EmadocsCompiler {
  constructor(options = {}) {
    this.options = {
      minify: options.minify || false,
      sourcemap: options.sourcemap || false,
      treeshaking: options.treeshaking || true,
      target: options.target || 'browser',
      ...options
    };
    
    this.parser = new EmadocsParser();
    this.components = new Map();
    this.styles = new Map();
    this.scripts = new Map();
    this.imports = new Set();
    this.exports = new Set();
  }

  // Main compilation method
  compile(input, filename = 'main.ema') {
    try {
      // Parse the input
      const ast = this.parser.parse(input);
      
      // Transform AST to intermediate representation
      const ir = this.transformAST(ast);
      
      // Generate output files
      const output = this.generateOutput(ir, filename);
      
      return {
        success: true,
        output,
        errors: [],
        warnings: []
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        errors: [error.message],
        warnings: []
      };
    }
  }

  // Transform AST to intermediate representation
  transformAST(ast) {
    const ir = {
      pages: [],
      components: [],
      styles: [],
      scripts: [],
      imports: [],
      exports: [],
      types: [],
      hooks: [],
      plugins: [],
      config: null
    };

    for (const node of ast.body) {
      switch (node.type) {
        case 'Page':
          ir.pages.push(this.transformPage(node));
          break;
        case 'Component':
          ir.components.push(this.transformComponent(node));
          break;
        case 'Style':
          ir.styles.push(this.transformStyle(node));
          break;
        case 'Event':
          ir.scripts.push(this.transformEvent(node));
          break;
        case 'State':
          ir.scripts.push(this.transformState(node));
          break;
        case 'Api':
          ir.scripts.push(this.transformApi(node));
          break;
        case 'Router':
          ir.scripts.push(this.transformRouter(node));
          break;
        case 'Layout':
          ir.components.push(this.transformLayout(node));
          break;
        case 'Animation':
          ir.styles.push(this.transformAnimation(node));
          break;
        case 'Type':
          ir.types.push(this.transformType(node));
          break;
        case 'Hook':
          ir.hooks.push(this.transformHook(node));
          break;
        case 'Plugin':
          ir.plugins.push(this.transformPlugin(node));
          break;
        case 'Config':
          ir.config = this.transformConfig(node);
          break;
        case 'Import':
          ir.imports.push(this.transformImport(node));
          break;
        case 'Export':
          ir.exports.push(this.transformExport(node));
          break;
      }
    }

    return ir;
  }

  // Transform page node
  transformPage(node) {
    return {
      type: 'page',
      name: node.name,
      attributes: node.attributes,
      head: this.extractHead(node.body),
      body: this.extractBody(node.body),
      scripts: this.extractScripts(node.body),
      styles: this.extractStyles(node.body)
    };
  }

  // Transform component node
  transformComponent(node) {
    const component = {
      type: 'component',
      name: node.name,
      typeParams: node.typeParams,
      props: node.props,
      events: node.events,
      state: node.state,
      methods: node.methods,
      render: node.render,
      css: this.generateComponentCSS(node),
      js: this.generateComponentJS(node)
    };

    this.components.set(node.name, component);
    return component;
  }

  // Transform style node
  transformStyle(node) {
    const style = {
      type: 'style',
      selector: node.selector,
      rules: node.rules,
      css: this.generateCSS(node)
    };

    this.styles.set(node.selector, style);
    return style;
  }

  // Transform event node
  transformEvent(node) {
    return {
      type: 'event',
      eventType: node.eventType,
      target: node.target,
      body: node.body,
      js: this.generateEventJS(node)
    };
  }

  // Transform state node
  transformState(node) {
    return {
      type: 'state',
      name: node.name,
      properties: node.properties,
      js: this.generateStateJS(node)
    };
  }

  // Transform API node
  transformApi(node) {
    return {
      type: 'api',
      name: node.name,
      properties: node.properties,
      methods: node.methods,
      js: this.generateApiJS(node)
    };
  }

  // Transform router node
  transformRouter(node) {
    return {
      type: 'router',
      routes: node.routes,
      js: this.generateRouterJS(node)
    };
  }

  // Transform layout node
  transformLayout(node) {
    return {
      type: 'layout',
      name: node.name,
      render: node.render,
      css: this.generateLayoutCSS(node),
      js: this.generateLayoutJS(node)
    };
  }

  // Transform animation node
  transformAnimation(node) {
    return {
      type: 'animation',
      name: node.name,
      keyframes: node.keyframes,
      css: this.generateAnimationCSS(node)
    };
  }

  // Transform type node
  transformType(node) {
    return {
      type: 'type',
      name: node.name,
      definition: node.definition,
      ts: this.generateTypeScript(node)
    };
  }

  // Transform hook node
  transformHook(node) {
    return {
      type: 'hook',
      name: node.name,
      parameters: node.parameters,
      body: node.body,
      js: this.generateHookJS(node)
    };
  }

  // Transform plugin node
  transformPlugin(node) {
    return {
      type: 'plugin',
      name: node.name,
      properties: node.properties,
      js: this.generatePluginJS(node)
    };
  }

  // Transform config node
  transformConfig(node) {
    return {
      type: 'config',
      properties: node.properties,
      js: this.generateConfigJS(node)
    };
  }

  // Transform import node
  transformImport(node) {
    return {
      type: 'import',
      specifiers: node.specifiers,
      source: node.source,
      js: this.generateImportJS(node)
    };
  }

  // Transform export node
  transformExport(node) {
    return {
      type: 'export',
      specifiers: node.specifiers,
      source: node.source,
      js: this.generateExportJS(node)
    };
  }

  // Generate final output
  generateOutput(ir, filename) {
    const output = {
      html: this.generateHTML(ir),
      css: this.generateCSS(ir),
      js: this.generateJS(ir),
      files: []
    };

    // Generate individual files
    if (ir.pages.length > 0) {
      output.files.push({
        name: 'index.html',
        content: output.html,
        type: 'html'
      });
    }

    if (ir.styles.length > 0 || ir.components.some(c => c.css)) {
      output.files.push({
        name: 'styles.css',
        content: output.css,
        type: 'css'
      });
    }

    if (ir.scripts.length > 0 || ir.components.some(c => c.js)) {
      output.files.push({
        name: 'script.js',
        content: output.js,
        type: 'js'
      });
    }

    // Generate component files
    for (const component of ir.components) {
      if (component.css) {
        output.files.push({
          name: `components/${component.name}.css`,
          content: component.css,
          type: 'css'
        });
      }
      
      if (component.js) {
        output.files.push({
          name: `components/${component.name}.js`,
          content: component.js,
          type: 'js'
        });
      }
    }

    return output;
  }

  // Generate HTML output
  generateHTML(ir) {
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    
    // Add meta tags
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    
    // Add title
    if (ir.pages.length > 0) {
      const page = ir.pages[0];
      html += `  <title>${page.attributes.title || 'Emadocs App'}</title>\n`;
    }
    
    // Add CSS links
    html += '  <link rel="stylesheet" href="css/theme.css">\n';
    html += '  <link rel="stylesheet" href="css/emadocs.css">\n';
    html += '  <link rel="stylesheet" href="styles.css">\n';
    
    // Add component CSS
    for (const component of ir.components) {
      if (component.css) {
        html += `  <link rel="stylesheet" href="components/${component.name}.css">\n`;
      }
    }
    
    html += '</head>\n<body>\n';
    
    // Add page content
    if (ir.pages.length > 0) {
      const page = ir.pages[0];
      html += this.generatePageContent(page);
    }
    
    // Add JavaScript
    html += '  <script src="js/emadocs.js"></script>\n';
    html += '  <script src="script.js"></script>\n';
    
    // Add component JavaScript
    for (const component of ir.components) {
      if (component.js) {
        html += `  <script src="components/${component.name}.js"></script>\n`;
      }
    }
    
    html += '</body>\n</html>';
    
    return html;
  }

  // Generate CSS output
  generateCSS(ir) {
    let css = '/* Emadocs Generated CSS */\n\n';
    
    // Add component CSS
    for (const component of ir.components) {
      if (component.css) {
        css += `/* ${component.name} Component */\n`;
        css += component.css + '\n\n';
      }
    }
    
    // Add styles
    for (const style of ir.styles) {
      css += `/* ${style.selector} Styles */\n`;
      css += style.css + '\n\n';
    }
    
    return css;
  }

  // Generate JavaScript output
  generateJS(ir) {
    let js = '/* Emadocs Generated JavaScript */\n\n';
    
    // Add imports
    for (const importNode of ir.imports) {
      js += importNode.js + '\n';
    }
    
    // Add component JavaScript
    for (const component of ir.components) {
      if (component.js) {
        js += `/* ${component.name} Component */\n`;
        js += component.js + '\n\n';
      }
    }
    
    // Add scripts
    for (const script of ir.scripts) {
      js += script.js + '\n';
    }
    
    // Add exports
    for (const exportNode of ir.exports) {
      js += exportNode.js + '\n';
    }
    
    return js;
  }

  // Generate component CSS
  generateComponentCSS(node) {
    let css = `.ema-${node.name} {\n`;
    css += '  /* Base component styles */\n';
    css += '  display: block;\n';
    css += '  position: relative;\n';
    css += '  box-sizing: border-box;\n';
    css += '}\n\n';
    
    // Add variant styles
    for (const prop of node.props) {
      if (prop.name === 'variant') {
        const variants = this.extractVariants(prop.type);
        for (const variant of variants) {
          css += `.ema-${node.name}--${variant} {\n`;
          css += `  /* ${variant} variant styles */\n`;
          css += '}\n\n';
        }
      }
    }
    
    return css;
  }

  // Generate component JavaScript
  generateComponentJS(node) {
    let js = `class Ema${this.capitalize(node.name)} extends HTMLElement {\n`;
    js += '  constructor() {\n';
    js += '    super();\n';
    js += '    this.attachShadow({ mode: "open" });\n';
    js += '  }\n\n';
    
    js += '  connectedCallback() {\n';
    js += '    this.render();\n';
    js += '    this.setupEventListeners();\n';
    js += '  }\n\n';
    
    js += '  render() {\n';
    js += '    this.shadowRoot.innerHTML = this.getTemplate();\n';
    js += '  }\n\n';
    
    js += '  getTemplate() {\n';
    js += '    return `\n';
    js += this.generateComponentTemplate(node);
    js += '    `;\n';
    js += '  }\n\n';
    
    js += '  setupEventListeners() {\n';
    js += '    // Event listeners will be added here\n';
    js += '  }\n';
    js += '}\n\n';
    
    js += `customElements.define('ema-${node.name}', Ema${this.capitalize(node.name)});\n`;
    
    return js;
  }

  // Generate component template
  generateComponentTemplate(node) {
    let template = '';
    
    if (node.render) {
      template = this.generateJSX(node.render);
    } else {
      template = `<div class="ema-${node.name}">\n`;
      template += '  <slot></slot>\n';
      template += '</div>';
    }
    
    return template;
  }

  // Generate JSX from render function
  generateJSX(renderNode) {
    // This would convert the render AST to JSX
    // For now, return a simple template
    return '<div class="component-content">\n  <slot></slot>\n</div>';
  }

  // Helper methods
  extractHead(body) {
    const headNodes = body.filter(node => 
      node.type === 'Element' && node.tagName === 'head'
    );
    return headNodes.length > 0 ? headNodes[0] : null;
  }

  extractBody(body) {
    return body.filter(node => 
      node.type === 'Element' && node.tagName === 'body'
    );
  }

  extractScripts(body) {
    return body.filter(node => 
      node.type === 'Element' && node.tagName === 'script'
    );
  }

  extractStyles(body) {
    return body.filter(node => 
      node.type === 'Element' && node.tagName === 'style'
    );
  }

  extractVariants(typeNode) {
    if (typeNode.type === 'UnionType') {
      return typeNode.types.map(t => t.name);
    }
    return [];
  }

  generatePageContent(page) {
    let content = '';
    
    if (page.body) {
      for (const node of page.body) {
        content += this.generateElement(node);
      }
    }
    
    return content;
  }

  generateElement(node) {
    if (node.type === 'Element') {
      let html = `<${node.tagName}`;
      
      // Add attributes
      for (const [key, value] of Object.entries(node.attributes || {})) {
        html += ` ${key}="${value}"`;
      }
      
      if (node.selfClosing) {
        html += ' />';
      } else {
        html += '>';
        
        // Add children
        if (node.children) {
          for (const child of node.children) {
            html += this.generateElement(child);
          }
        }
        
        html += `</${node.tagName}>`;
      }
      
      return html;
    }
    
    if (node.type === 'Text') {
      return node.value;
    }
    
    return '';
  }

  generateEventJS(node) {
    let js = `// Event: ${node.eventType} on ${node.target}\n`;
    js += `document.addEventListener('${node.eventType}', (event) => {\n`;
    js += '  // Event handler code\n';
    js += '});\n';
    return js;
  }

  generateStateJS(node) {
    let js = `// State: ${node.name}\n`;
    js += `const ${node.name} = {\n`;
    
    for (const prop of node.properties) {
      js += `  ${prop.name}: ${JSON.stringify(prop.defaultValue)},\n`;
    }
    
    js += '};\n';
    return js;
  }

  generateApiJS(node) {
    let js = `// API: ${node.name}\n`;
    js += `class ${node.name} {\n`;
    js += `  constructor() {\n`;
    js += `    this.baseUrl = '${node.properties.baseUrl || ''}';\n`;
    js += '  }\n\n';
    
    for (const method of node.methods) {
      js += `  async ${method.name}() {\n`;
      js += '    // Method implementation\n';
      js += '  }\n\n';
    }
    
    js += '}\n';
    return js;
  }

  generateRouterJS(node) {
    let js = '// Router\n';
    js += 'class EmadocsRouter {\n';
    js += '  constructor() {\n';
    js += '    this.routes = new Map();\n';
    js += '    this.init();\n';
    js += '  }\n\n';
    
    js += '  init() {\n';
    js += '    window.addEventListener("popstate", () => this.handleRoute());\n';
    js += '    this.handleRoute();\n';
    js += '  }\n\n';
    
    js += '  handleRoute() {\n';
    js += '    const path = window.location.pathname;\n';
    js += '    // Route handling logic\n';
    js += '  }\n';
    js += '}\n';
    
    return js;
  }

  generateLayoutCSS(node) {
    let css = `.ema-${node.name} {\n`;
    css += '  /* Layout styles */\n';
    css += '}\n';
    return css;
  }

  generateLayoutJS(node) {
    let js = `class Ema${this.capitalize(node.name)} {\n`;
    js += '  render() {\n';
    js += '    // Layout render logic\n';
    js += '  }\n';
    js += '}\n';
    return js;
  }

  generateAnimationCSS(node) {
    let css = `@keyframes ${node.name} {\n`;
    
    for (const keyframe of node.keyframes) {
      css += `  ${keyframe.percentage}% {\n`;
      for (const [property, value] of Object.entries(keyframe.properties)) {
        css += `    ${property}: ${value};\n`;
      }
      css += '  }\n';
    }
    
    css += '}\n';
    return css;
  }

  generateTypeScript(node) {
    let ts = `type ${node.name} = `;
    ts += this.generateTypeDefinition(node.definition);
    ts += ';\n';
    return ts;
  }

  generateHookJS(node) {
    let js = `function use${this.capitalize(node.name)}() {\n`;
    js += '  // Hook implementation\n';
    js += '}\n';
    return js;
  }

  generatePluginJS(node) {
    let js = `class ${node.name} {\n`;
    js += '  constructor() {\n';
    js += '    // Plugin initialization\n';
    js += '  }\n';
    js += '}\n';
    return js;
  }

  generateConfigJS(node) {
    let js = 'const config = {\n';
    
    for (const [key, value] of Object.entries(node.properties)) {
      js += `  ${key}: ${JSON.stringify(value)},\n`;
    }
    
    js += '};\n';
    return js;
  }

  generateImportJS(node) {
    let js = 'import ';
    
    if (node.specifiers.length === 1) {
      js += node.specifiers[0].name;
    } else {
      js += '{ ' + node.specifiers.map(s => s.name).join(', ') + ' }';
    }
    
    if (node.source) {
      js += ` from '${node.source}'`;
    }
    
    js += ';\n';
    return js;
  }

  generateExportJS(node) {
    let js = 'export ';
    
    if (node.specifiers.length === 1) {
      js += node.specifiers[0].name;
    } else {
      js += '{ ' + node.specifiers.map(s => s.name).join(', ') + ' }';
    }
    
    if (node.source) {
      js += ` from '${node.source}'`;
    }
    
    js += ';\n';
    return js;
  }

  generateTypeDefinition(typeNode) {
    if (typeNode.type === 'ObjectType') {
      let ts = '{\n';
      for (const [key, value] of Object.entries(typeNode.properties)) {
        ts += `  ${key}: ${this.generateTypeDefinition(value)};\n`;
      }
      ts += '}';
      return ts;
    }
    
    if (typeNode.type === 'ArrayType') {
      return `${this.generateTypeDefinition(typeNode.elementType)}[]`;
    }
    
    if (typeNode.type === 'UnionType') {
      return typeNode.types.map(t => t.name).join(' | ');
    }
    
    return typeNode.name || 'any';
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmadocsCompiler;
} else if (typeof window !== 'undefined') {
  window.EmadocsCompiler = EmadocsCompiler;
}
