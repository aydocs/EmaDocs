/**
 * EMADOCS FRAMEWORK - CORE MODULE
 * Provides event bus, plugin system, and component registry
 * @version 1.0.0
 * @license MIT
 */

;((window) => {
  const EmaCore = {
    // Event bus for global communication
    events: {},

    // Component registry for lazy loading
    components: new Map(),

    // Loaded components cache
    loadedComponents: new Set(),

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = []
      }
      this.events[event].push(callback)

      // Return unsubscribe function
      return () => this.off(event, callback)
    },

    /**
     * Subscribe to an event once
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
      const wrapper = (data) => {
        callback(data)
        this.off(event, wrapper)
      }
      this.on(event, wrapper)
    },

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
      if (!this.events[event]) return
      this.events[event] = this.events[event].filter((cb) => cb !== callback)
    },

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Data to pass to callbacks
     */
    emit(event, data) {
      if (!this.events[event]) return
      this.events[event].forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[Emadocs Core] Error in event handler for "${event}":`, error)
        }
      })
    },

    /**
     * Register a component for lazy loading
     * @param {string} name - Component name (must include hyphen)
     * @param {string} path - Path to component file
     */
    registerComponent(name, path) {
      if (!name.includes("-")) {
        console.error("[Emadocs Core] Component name must include a hyphen")
        return
      }
      this.components.set(name, path)
    },

    /**
     * Load a component dynamically
     * @param {string} name - Component name
     * @returns {Promise<void>}
     */
    async loadComponent(name) {
      if (this.loadedComponents.has(name)) {
        return // Already loaded
      }

      const path = this.components.get(name)
      if (!path) {
        console.error(`[Emadocs Core] Component "${name}" not registered`)
        return
      }

      try {
        const response = await fetch(path)
        const html = await response.text()

        // Parse and execute the component
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")
        const script = doc.querySelector("script")

        if (script) {
          eval(script.textContent)
          this.loadedComponents.add(name)
          this.emit("component:loaded", { name })
        }
      } catch (error) {
        console.error(`[Emadocs Core] Failed to load component "${name}":`, error)
      }
    },

    /**
     * Define a custom element with Shadow DOM
     * @param {string} name - Element name (must include hyphen)
     * @param {Object} options - Element configuration
     * @param {Function} [options.template] - Template function
     * @param {string} [options.styles] - CSS styles
     * @param {Function} [options.connected] - Connected callback
     * @param {Function} [options.disconnected] - Disconnected callback
     * @param {Function} [options.attributeChanged] - Attribute changed callback
     * @param {string[]} [options.attributes] - Observed attributes
     * @param {boolean} [options.useShadow=true] - Use Shadow DOM
     */
    defineElement(name, options = {}) {
      if (customElements.get(name)) {
        console.warn(`[Emadocs Core] Element "${name}" already defined`)
        return
      }

      if (!name.includes("-")) {
        console.error("[Emadocs Core] Element name must include a hyphen")
        return
      }

      const useShadow = options.useShadow !== false

      class EmaElement extends HTMLElement {
        constructor() {
          super()

          // Attach Shadow DOM if enabled
          if (useShadow) {
            this.attachShadow({ mode: "open" })
          }

          // Apply styles
          if (options.styles) {
            const style = document.createElement("style")
            style.textContent = options.styles

            if (useShadow) {
              this.shadowRoot.appendChild(style)
            } else {
              this.appendChild(style)
            }
          }

          // Store cleanup functions
          this._cleanup = []
        }

        connectedCallback() {
          // Render template
          if (options.template) {
            const template = document.createElement("template")
            template.innerHTML = options.template(this)

            const content = template.content.cloneNode(true)

            if (useShadow) {
              this.shadowRoot.appendChild(content)
            } else {
              this.appendChild(content)
            }
          }

          // Call connected callback
          if (options.connected) {
            options.connected.call(this)
          }

          // Emit event
          EmaCore.emit("element:connected", { name, element: this })
        }

        disconnectedCallback() {
          // Run cleanup functions
          this._cleanup.forEach((fn) => fn())
          this._cleanup = []

          // Call disconnected callback
          if (options.disconnected) {
            options.disconnected.call(this)
          }

          // Emit event
          EmaCore.emit("element:disconnected", { name, element: this })
        }

        attributeChangedCallback(attrName, oldValue, newValue) {
          if (options.attributeChanged) {
            options.attributeChanged.call(this, attrName, oldValue, newValue)
          }
        }

        static get observedAttributes() {
          return options.attributes || []
        }

        // Helper method to add cleanup function
        addCleanup(fn) {
          this._cleanup.push(fn)
        }
      }

      customElements.define(name, EmaElement)
      this.emit("element:defined", { name })
    },

    /**
     * Plugin system
     */
    plugins: [],

    /**
     * Register a plugin
     * @param {Object} plugin - Plugin object with install method
     * @param {Function} plugin.install - Install function
     * @param {string} [plugin.name] - Plugin name
     * @param {string} [plugin.version] - Plugin version
     */
    use(plugin) {
      if (this.plugins.includes(plugin)) {
        console.warn("[Emadocs Core] Plugin already registered")
        return
      }

      if (typeof plugin.install !== "function") {
        console.error("[Emadocs Core] Plugin must have an install method")
        return
      }

      try {
        plugin.install(window.Emadocs)
        this.plugins.push(plugin)
        this.emit("plugin:installed", { plugin })

        if (plugin.name) {
          console.log(`[Emadocs Core] Plugin "${plugin.name}" installed`)
        }
      } catch (error) {
        console.error("[Emadocs Core] Plugin installation failed:", error)
      }
    },

    /**
     * Get plugin by name
     * @param {string} name - Plugin name
     * @returns {Object|null} Plugin object or null
     */
    getPlugin(name) {
      return this.plugins.find((p) => p.name === name) || null
    },

    /**
     * Utility: Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },

    /**
     * Utility: Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
      let inThrottle
      return function executedFunction(...args) {
        if (!inThrottle) {
          func(...args)
          inThrottle = true
          setTimeout(() => (inThrottle = false), limit)
        }
      }
    },

    /**
     * Utility: Deep clone object
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    clone(obj) {
      if (obj === null || typeof obj !== "object") return obj
      if (obj instanceof Date) return new Date(obj.getTime())
      if (obj instanceof Array) return obj.map((item) => this.clone(item))
      if (obj instanceof Object) {
        const clonedObj = {}
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            clonedObj[key] = this.clone(obj[key])
          }
        }
        return clonedObj
      }
    },
  }

  // Export to window
  window.EmaCore = EmaCore
})(window)
