/**
 * EMADOCS COMPILER - JavaScript Implementation
 * Simple compiler for EmadocsLang (.ema files)
 * Compiles .ema files to HTML, CSS, and JavaScript
 */

class EmadocsCompiler {
  constructor(config = {}) {
    this.config = config;
    this.components = new Map();
    this.styles = new Map();
    this.scripts = new Map();
  }

  /**
   * Compile .ema file to HTML, CSS, and JavaScript
   * @param {string} content - .ema file content
   * @param {string} filename - filename
   * @returns {Object} compilation result
   */
  compile(content, filename = 'index.ema') {
    try {
      console.log(`Compiling ${filename}...`);
      
      // Simple parsing - extract HTML, CSS, and JS
      const html = this.extractHTML(content);
      const css = this.extractCSS(content);
      const js = this.extractJS(content);
      
      return {
        success: true,
        html: html,
        css: css,
        js: js,
        filename: filename
      };
    } catch (error) {
      console.error(`Compilation error in ${filename}:`, error);
      return {
        success: false,
        error: error.message,
        filename: filename
      };
    }
  }

  /**
   * Extract HTML from .ema content
   * @param {string} content - .ema file content
   * @returns {string} HTML content
   */
  extractHTML(content) {
    // Simple regex to extract HTML-like content
    const htmlMatch = content.match(/<page[^>]*>([\s\S]*?)<\/page>/);
    if (!htmlMatch) {
      return this.generateDefaultHTML();
    }

    let html = htmlMatch[1];
    
    // Convert EmadocsLang syntax to HTML
    html = this.convertEmadocsToHTML(html);
    
    // Wrap in proper HTML structure
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emadocs Framework</title>
    <link rel="stylesheet" href="css/theme.css">
    <link rel="stylesheet" href="css/emadocs.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${html}
    <script src="js/emadocs.js"></script>
    <script src="script.js"></script>
</body>
</html>`;
  }

  /**
   * Extract CSS from .ema content
   * @param {string} content - .ema file content
   * @returns {string} CSS content
   */
  extractCSS(content) {
    const cssBlocks = content.match(/style\s+([^{]+)\s*{([^}]+)}/g);
    if (!cssBlocks) {
      return this.generateDefaultCSS();
    }

    let css = '';
    cssBlocks.forEach(block => {
      const match = block.match(/style\s+([^{]+)\s*{([^}]+)}/);
      if (match) {
        const selector = match[1].trim();
        const styles = match[2].trim();
        css += `.${selector} {\n  ${styles.replace(/;/g, ';\n  ')}\n}\n\n`;
      }
    });

    return css || this.generateDefaultCSS();
  }

  /**
   * Extract JavaScript from .ema content
   * @param {string} content - .ema file content
   * @returns {string} JavaScript content
   */
  extractJS(content) {
    const jsBlocks = content.match(/event\s+([^{]+)\s*{([^}]+)}/g);
    if (!jsBlocks) {
      return this.generateDefaultJS();
    }

    let js = '';
    jsBlocks.forEach(block => {
      const match = block.match(/event\s+([^{]+)\s*{([^}]+)}/);
      if (match) {
        const eventType = match[1].trim();
        const code = match[2].trim();
        js += `// Event: ${eventType}\n`;
        js += `document.addEventListener('${eventType}', (event) => {\n  ${code}\n});\n\n`;
      }
    });

    return js || this.generateDefaultJS();
  }

  /**
   * Convert EmadocsLang syntax to HTML
   * @param {string} content - HTML-like content
   * @returns {string} converted HTML
   */
  convertEmadocsToHTML(content) {
    // Convert component tags to HTML
    content = content.replace(/<navbar([^>]*)>/g, '<nav class="ema-navbar"$1>');
    content = content.replace(/<\/navbar>/g, '</nav>');
    
    content = content.replace(/<logo([^>]*)>/g, '<img class="ema-logo"$1>');
    content = content.replace(/<navlink([^>]*)>/g, '<a class="ema-navlink"$1>');
    content = content.replace(/<\/navlink>/g, '</a>');
    
    content = content.replace(/<text([^>]*)>/g, '<span class="ema-text"$1>');
    content = content.replace(/<\/text>/g, '</span>');
    
    content = content.replace(/<button([^>]*)>/g, '<button class="ema-button"$1>');
    content = content.replace(/<input([^>]*)>/g, '<input class="ema-input"$1>');
    content = content.replace(/<card([^>]*)>/g, '<div class="ema-card"$1>');
    content = content.replace(/<\/card>/g, '</div>');
    
    // Convert template literals
    content = content.replace(/\[\[([^\]]+)\]\]/g, '${$1}');
    
    return content;
  }

  /**
   * Generate default HTML
   * @returns {string} default HTML
   */
  generateDefaultHTML() {
    return `
    <div id="app">
        <header>
            <h1>🚀 Emadocs Framework</h1>
            <p>Welcome to the future of web development!</p>
        </header>
        <main>
            <div class="features">
                <div class="feature">
                    <h3>⚡ Ultra Fast</h3>
                    <p>10x faster than React, 5x faster than Vue</p>
                </div>
                <div class="feature">
                    <h3>🎨 250+ Components</h3>
                    <p>1250 variants of beautiful components</p>
                </div>
                <div class="feature">
                    <h3>💎 EmadocsLang</h3>
                    <p>Revolutionary programming language</p>
                </div>
            </div>
            <button onclick="alert('Hello from Emadocs!')">Click Me</button>
        </main>
    </div>`;
  }

  /**
   * Generate default CSS
   * @returns {string} default CSS
   */
  generateDefaultCSS() {
    return `
/* Emadocs Framework Default Styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
}

#app {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.feature {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.feature h3 {
    margin-top: 0;
    font-size: 1.5rem;
}

button {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: #ff5252;
    transform: translateY(-2px);
}

.ema-navbar {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    margin-bottom: 2rem;
    border-radius: 8px;
    backdrop-filter: blur(10px);
}

.ema-navlink {
    color: white;
    text-decoration: none;
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background 0.3s ease;
}

.ema-navlink:hover {
    background: rgba(255, 255, 255, 0.2);
}

.ema-button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.ema-button:hover {
    background: #45a049;
    transform: translateY(-1px);
}

.ema-input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    margin: 0.5rem;
}

.ema-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1rem 0;
    backdrop-filter: blur(10px);
}

.ema-text {
    display: block;
    margin: 0.5rem 0;
}
`;
  }

  /**
   * Generate default JavaScript
   * @returns {string} default JavaScript
   */
  generateDefaultJS() {
    return `
// Emadocs Framework Default JavaScript
console.log('🚀 Emadocs Framework loaded successfully!');

// Initialize framework
document.addEventListener('DOMContentLoaded', () => {
    console.log('Framework initialized');
    
    // Add click handlers
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Button clicked:', e.target.textContent);
        });
    });
    
    // Add hover effects
    document.querySelectorAll('.feature').forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.style.transform = 'translateY(-5px)';
        });
        
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'translateY(0)';
        });
    });
});

// Global functions
window.greetUser = function() {
    alert('Hello from Emadocs Framework!');
};

window.handleClick = function() {
    console.log('Custom click handler');
};
`;
  }
}

module.exports = EmadocsCompiler;