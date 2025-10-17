# Adiox Plugin Development Guide

This guide explains how to create plugins for the Adiox framework.

## Plugin Structure

A plugin is a JavaScript object with the following structure:

\`\`\`javascript
const MyPlugin = {
  name: "MyPlugin",
  version: "1.0.0",
  
  install(Adiox, options = {}) {
    // Plugin initialization code
    
    // Add API to Adiox namespace
    Adiox.MyPlugin = {
      // Your plugin methods
    };
    
    // Emit plugin loaded event
    Adiox.emit("plugin:loaded", { 
      name: "MyPlugin", 
      version: "1.0.0" 
    });
  }
};
\`\`\`

## Plugin Lifecycle

### 1. Installation

Plugins are installed using `Adiox.use()`:

\`\`\`javascript
Adiox.use(MyPlugin, {
  option1: "value1",
  option2: "value2"
});
\`\`\`

### 2. Initialization

The `install` method receives:
- `Adiox` - The framework instance
- `options` - Configuration object

### 3. Events

Plugins can listen to and emit events:

\`\`\`javascript
// Listen to framework events
Adiox.on("route:change", (data) => {
  console.log("Route changed:", data);
});

// Emit custom events
Adiox.emit("myplugin:action", { data: "value" });
\`\`\`

## Best Practices

### 1. Namespace Your API

Always add your plugin API under a unique namespace:

\`\`\`javascript
Adiox.MyPlugin = {
  method1() {},
  method2() {}
};
\`\`\`

### 2. Provide Configuration

Allow users to configure your plugin:

\`\`\`javascript
install(Adiox, options = {}) {
  const config = {
    enabled: options.enabled !== false,
    debug: options.debug || false,
    apiKey: options.apiKey || ""
  };
  
  // Use config throughout plugin
}
\`\`\`

### 3. Clean Up Resources

Provide cleanup methods if needed:

\`\`\`javascript
Adiox.MyPlugin = {
  destroy() {
    // Remove event listeners
    // Clear timers
    // Release resources
  }
};
\`\`\`

### 4. Document Your Plugin

Include JSDoc comments:

\`\`\`javascript
/**
 * My Plugin Description
 * 
 * @example
 * Adiox.use(MyPlugin, { apiKey: "xxx" });
 * Adiox.MyPlugin.doSomething();
 */
\`\`\`

## Example Plugins

### Analytics Plugin

\`\`\`javascript
const AnalyticsPlugin = {
  name: "Analytics",
  version: "1.0.0",
  
  install(Adiox, options = {}) {
    const trackingId = options.trackingId || "";
    
    Adiox.Analytics = {
      track(event, data) {
        console.log("Track:", event, data);
        // Send to analytics service
      },
      
      pageView(path) {
        this.track("page_view", { path });
      }
    };
    
    // Auto-track route changes
    if (options.autoTrack) {
      Adiox.on("route:change", (data) => {
        Adiox.Analytics.pageView(data.path);
      });
    }
  }
};
\`\`\`

### Logger Plugin

\`\`\`javascript
const LoggerPlugin = {
  name: "Logger",
  version: "1.0.0",
  
  install(Adiox, options = {}) {
    const level = options.level || "info";
    const prefix = options.prefix || "[Adiox]";
    
    const levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    Adiox.Logger = {
      debug(...args) {
        if (levels[level] <= levels.debug) {
          console.log(prefix, ...args);
        }
      },
      
      info(...args) {
        if (levels[level] <= levels.info) {
          console.info(prefix, ...args);
        }
      },
      
      warn(...args) {
        if (levels[level] <= levels.warn) {
          console.warn(prefix, ...args);
        }
      },
      
      error(...args) {
        if (levels[level] <= levels.error) {
          console.error(prefix, ...args);
        }
      }
    };
  }
};
\`\`\`

### Form Validation Plugin

\`\`\`javascript
const ValidationPlugin = {
  name: "Validation",
  version: "1.0.0",
  
  install(Adiox, options = {}) {
    const rules = {
      required: (value) => value.trim() !== "",
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      minLength: (value, min) => value.length >= min,
      maxLength: (value, max) => value.length <= max,
      pattern: (value, regex) => new RegExp(regex).test(value)
    };
    
    Adiox.Validation = {
      validate(value, ruleSet) {
        const errors = [];
        
        for (const [rule, param] of Object.entries(ruleSet)) {
          if (rules[rule] && !rules[rule](value, param)) {
            errors.push(`Validation failed: ${rule}`);
          }
        }
        
        return {
          valid: errors.length === 0,
          errors
        };
      },
      
      addRule(name, fn) {
        rules[name] = fn;
      }
    };
  }
};
\`\`\`

## Testing Your Plugin

Create tests for your plugin:

\`\`\`javascript
describe("MyPlugin", () => {
  beforeEach(() => {
    Adiox.use(MyPlugin, { option: "value" });
  });
  
  it("should be installed", () => {
    expect(Adiox.MyPlugin).toBeTruthy();
  });
  
  it("should perform action", () => {
    const result = Adiox.MyPlugin.doSomething();
    expect(result).toBe(expected);
  });
});
\`\`\`

## Publishing Your Plugin

1. Create a repository
2. Add documentation (README.md)
3. Include examples
4. Publish to npm (optional)
5. Share with the community

## Plugin Ideas

- State persistence (IndexedDB, SessionStorage)
- Form handling and validation
- HTTP client with interceptors
- WebSocket integration
- Service worker registration
- Performance monitoring
- Error tracking
- A/B testing
- Feature flags
- Internationalization helpers
- Authentication flows
- Data caching strategies

## Support

For questions or issues with plugin development, please open an issue on GitHub or join our community discussions.
