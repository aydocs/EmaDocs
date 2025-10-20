/**
 * EMADOCS CONFIGURATION
 * Configuration file for Emadocs Framework
 */

module.exports = {
  // Entry point
  entry: './index.ema',
  
  // Output directory
  output: './dist',
  
  // Development mode
  mode: 'development',
  
  // Development server configuration
  devServer: {
    port: 3000,
    host: 'localhost',
    hot: true,
    open: true,
    liveReload: true,
    watchFiles: ['**/*.ema', '**/*.css', '**/*.js'],
    static: {
      directory: './',
      publicPath: '/',
    },
    historyApiFallback: true,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
  
  // Build configuration
  build: {
    minify: true,
    sourcemap: true,
    treeshaking: true,
    optimize: true,
    compress: true,
  },
  
  // Compiler options
  compiler: {
    // Choose compiler: 'cpp', 'rust', 'go', 'js'
    type: 'js',
    
    // Compiler-specific options
    cpp: {
      optimization: 'O3',
      debug: false,
    },
    rust: {
      optimization: 'release',
      debug: false,
    },
    go: {
      optimization: true,
      debug: false,
    },
    js: {
      minify: true,
      sourcemap: true,
    },
  },
  
  // Theme configuration
  theme: {
    default: 'purple',
    available: ['purple', 'blue', 'green', 'yellow', 'red', 'cyan', 'pink', 'orange'],
    darkMode: true,
    customProperties: true,
  },
  
  // Component configuration
  components: {
    // Component library path
    library: './components',
    
    // Auto-import components
    autoImport: true,
    
    // Component variants
    variants: ['minimal', 'neo', 'soft', 'glass', 'premium'],
    
    // Component generation
    generate: {
      enabled: true,
      path: './components',
      template: 'default',
    },
  },
  
  // CSS configuration
  css: {
    // CSS framework
    framework: 'emadocs',
    
    // Preprocessors
    preprocessors: ['scss', 'sass', 'less'],
    
    // PostCSS plugins
    postcss: {
      autoprefixer: true,
      cssnano: true,
    },
    
    // CSS modules
    modules: false,
    
    // CSS variables
    variables: true,
  },
  
  // JavaScript configuration
  javascript: {
    // ES version
    target: 'es2020',
    
    // Module system
    module: 'esnext',
    
    // Transpilation
    transpile: true,
    
    // Polyfills
    polyfills: true,
  },
  
  // Development tools
  devtools: {
    // Hot reload
    hotReload: true,
    
    // Live preview
    livePreview: true,
    
    // Error overlay
    errorOverlay: true,
    
    // Performance monitoring
    performance: true,
    
    // Debug mode
    debug: true,
  },
  
  // Plugins
  plugins: [
    // Core plugins
    'emadocs-core',
    'emadocs-components',
    'emadocs-router',
    'emadocs-state',
    
    // Development plugins
    'emadocs-dev-tools',
    'emadocs-hot-reload',
    'emadocs-live-preview',
    
    // Optional plugins
    'emadocs-analytics',
    'emadocs-pwa',
    'emadocs-i18n',
  ],
  
  // Aliases
  alias: {
    '@': './src',
    '@components': './components',
    '@css': './css',
    '@js': './js',
    '@assets': './assets',
    '@utils': './utils',
  },
  
  // Externals
  externals: {
    // External dependencies
    'react': 'React',
    'vue': 'Vue',
    'angular': 'angular',
  },
  
  // Environment variables
  env: {
    NODE_ENV: 'development',
    EMADOCS_VERSION: '1.0.0',
    EMADOCS_DEBUG: true,
  },
  
  // Performance
  performance: {
    // Bundle analysis
    analyze: false,
    
    // Size limits
    maxAssetSize: 1000000, // 1MB
    maxEntrypointSize: 1000000, // 1MB
    
    // Hints
    hints: 'warning',
  },
  
  // Security
  security: {
    // Content Security Policy
    csp: true,
    
    // HTTPS
    https: false,
    
    // Headers
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  // Testing
  testing: {
    // Test framework
    framework: 'jest',
    
    // Test files
    testMatch: ['**/*.test.ema', '**/*.spec.ema'],
    
    // Coverage
    coverage: {
      enabled: true,
      threshold: 80,
    },
  },
  
  // Linting
  linting: {
    // ESLint
    eslint: true,
    
    // Prettier
    prettier: true,
    
    // Stylelint
    stylelint: true,
  },
  
  // Documentation
  docs: {
    // Auto-generate docs
    autoGenerate: true,
    
    // Documentation path
    path: './docs',
    
    // Markdown support
    markdown: true,
    
    // JSDoc support
    jsdoc: true,
  },
  
  // PWA
  pwa: {
    enabled: false,
    manifest: './manifest.json',
    serviceWorker: './sw.js',
  },
  
  // Internationalization
  i18n: {
    enabled: false,
    locales: ['en', 'tr'],
    defaultLocale: 'en',
    path: './locales',
  },
  
  // Analytics
  analytics: {
    enabled: false,
    provider: 'google', // 'google', 'mixpanel', 'custom'
    trackingId: '',
  },
  
  // Error handling
  errorHandling: {
    // Error boundary
    errorBoundary: true,
    
    // Error reporting
    reporting: false,
    
    // Error tracking
    tracking: false,
  },
  
  // Logging
  logging: {
    level: 'info', // 'error', 'warn', 'info', 'debug'
    console: true,
    file: false,
  },
  
  // Cache
  cache: {
    enabled: true,
    type: 'memory', // 'memory', 'file', 'redis'
    ttl: 3600, // 1 hour
  },
  
  // Compression
  compression: {
    enabled: true,
    algorithm: 'gzip',
    level: 6,
  },
  
  // Optimization
  optimization: {
    // Code splitting
    codeSplitting: true,
    
    // Tree shaking
    treeShaking: true,
    
    // Dead code elimination
    deadCodeElimination: true,
    
    // Minification
    minification: true,
  },
};
